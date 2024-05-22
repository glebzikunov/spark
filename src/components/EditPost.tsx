"use client"

import { PostEditingRequest, EditPostValidator } from "@/lib/validators/post"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useRef, useState } from "react"
import type EditorJS from "@editorjs/editorjs"
import { useRouter } from "next/navigation"
import { useCustomToast } from "@/hooks/use-custom.toast"
import { uploadFiles } from "@/lib/uploadthing"
import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"

interface EditPostProps {
  postId: string
  postContent: any
  communityName: string | undefined
}

const EditPost = ({ postId, postContent, communityName }: EditPostProps) => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<PostEditingRequest>({
    resolver: zodResolver(EditPostValidator),
    defaultValues: {
      postId,
      content: postContent,
    },
  })

  const ref = useRef<EditorJS>()
  const router = useRouter()
  const { loginToast } = useCustomToast()

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default
    const Header = (await import("@editorjs/header")).default
    const Embed = (await import("@editorjs/embed")).default
    const Table = (await import("@editorjs/table")).default
    const List = (await import("@editorjs/list")).default
    const Code = (await import("@editorjs/code")).default
    const LinkTool = (await import("@editorjs/link")).default
    const InlineCode = (await import("@editorjs/inline-code")).default
    const ImageTool = (await import("@editorjs/image")).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor
        },
        placeholder: "Click to add content",
        inlineToolbar: true,
        data: postContent,
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader")

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  }
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      })
    }
  }, [])

  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        })
      }
    }
  }, [errors])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()
    }

    if (isMounted) {
      init()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  const { mutate: editPost } = useMutation({
    mutationFn: async ({ content }: PostEditingRequest) => {
      const payload: PostEditingRequest = {
        postId,
        content,
      }
      const { data } = await axios.patch("/api/community/post/edit", payload)

      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your post wasn't updated, try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      router.push(`c/${communityName}/post/${postId}`)
      router.refresh()

      return toast({ description: "Your post has been updated." })
    },
  })

  async function onSubmit(data: PostEditingRequest) {
    const blocks = await ref.current?.save()

    const payload: PostEditingRequest = {
      postId,
      content: blocks,
    }

    editPost(payload)
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      <div className="w-full p-4 bg-[#f9fafa] dark:bg-[#303030] rounded-lg border border-border dark:border-[#ffffff33]">
        <form
          id="community-edit-post-form"
          className="max-w-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="prose prose-stone dark:prose-invert">
            <div id="editor" className="dark:bg-[#303030] min-h-[300px]" />
          </div>
        </form>
      </div>
    </>
  )
}

export default EditPost
