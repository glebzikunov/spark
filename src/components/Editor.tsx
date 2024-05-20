"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import TextareaAutosize from "react-textarea-autosize"
import { useForm } from "react-hook-form"
import { PostCreationRequest, PostValidator } from "@/lib/validators/post"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useRef, useState } from "react"
import type EditorJS from "@editorjs/editorjs"
import { uploadFiles } from "@/lib/uploadthing"
import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { usePathname, useRouter } from "next/navigation"
import { useCustomToast } from "@/hooks/use-custom.toast"
import { Button } from "./ui/button"

interface Badge {
  id: string
  color: string
  title: string
  communityId: string
}

interface EditorProps {
  communityId: string
  badges?: Badge[]
}

const Editor = ({ communityId, badges }: EditorProps) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge>({
    id: "none",
    color: "none",
    title: "none",
    communityId: "none",
  })
  const [badge, setBadge] = useState<Badge>(selectedBadge)

  const handleBadgeChange = (badge: Badge) => {
    setSelectedBadge(badge)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      communityId,
    },
  })

  const ref = useRef<EditorJS>()
  const _titleRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const pathname = usePathname()
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
        data: { blocks: [] },
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

      setTimeout(() => {
        _titleRef.current?.focus()
      }, 0)
    }

    if (isMounted) {
      init()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      communityId,
      badgeTitle,
      badgeColor,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        communityId,
        title,
        content,
        badgeTitle,
        badgeColor,
      }
      const { data } = await axios.post("/api/community/post/create", payload)

      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }

        if (err.response?.status === 400) {
          return toast({
            title: "Error publishing post.",
            description: "You need to join this community, before posting.",
            variant: "destructive",
          })
        }
      }
      return toast({
        title: "Something went wrong.",
        description: "Your post wasn't published, try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      const newPathname = pathname.split("/").slice(0, -1).join("/")
      router.push(newPathname)

      router.refresh()

      return toast({ description: "Your post has been published." })
    },
  })

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save()

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      communityId,
      badgeTitle: badge.title,
      badgeColor: badge.color,
    }

    createPost(payload)
  }

  if (!isMounted) {
    return null
  }

  const { ref: titleRef, ...rest } = register("title")

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger className="transition rounded-lg hover:bg-[#eaedef] dark:hover:bg-[#303030] border border-border dark:border-[#ffffff33] px-4 py-2">
          Add Badge
        </AlertDialogTrigger>
        <AlertDialogContent className="max-h-[350px] overflow-auto bg-background dark:bg-[#1F1F1F] border border-border dark:border-[#ffffff33]">
          <AlertDialogHeader>
            <AlertDialogTitle>Add community badge</AlertDialogTitle>
            <AlertDialogDescription>
              Choose badge depending on your content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {badges.length > 0 ? (
            <ul className="flex flex-col gap-2">
              <li>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="badge"
                    value="none"
                    checked={selectedBadge.id === "none"}
                    onChange={() =>
                      handleBadgeChange({
                        id: "none",
                        title: "none",
                        color: "none",
                        communityId: "none",
                      })
                    }
                  />
                  No badge
                </label>
              </li>
              {badges?.map((badge, index) => (
                <li key={index}>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="badge"
                      value={badge.id}
                      checked={selectedBadge.id === badge.id}
                      onChange={() => handleBadgeChange(badge)}
                    />
                    <span
                      style={{ backgroundColor: badge.color }}
                      className="px-4 py-1 h-fit text-white rounded-full"
                    >
                      {badge.title}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                handleBadgeChange({
                  id: "none",
                  title: "none",
                  color: "none",
                  communityId: "none",
                })
                setBadge(selectedBadge)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setBadge(selectedBadge)}>
              <Button>Add</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="w-full p-4 bg-[#f9fafa] dark:bg-[#262626] rounded-lg border border-border dark:border-[#313131]">
        <form
          id="community-post-form"
          className="max-w-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="prose prose-stone dark:prose-invert">
            <TextareaAutosize
              ref={(e) => {
                titleRef(e)

                // @ts-ignore
                _titleRef.current = e
              }}
              {...rest}
              placeholder="Title"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-3xl font-bold focus:outline-none"
            />

            <div id="editor" className="min-h-[300px]" />
          </div>
        </form>
      </div>
    </>
  )
}

export default Editor
