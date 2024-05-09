"use client"

import React, { useState } from "react"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { useMutation } from "@tanstack/react-query"
import { CommentRequest } from "@/lib/validators/comment"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { useCustomToast } from "@/hooks/use-custom.toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface CreateCommentProps {
  postId: string
  replyToId?: string
}

const CreateComment = ({ postId, replyToId }: CreateCommentProps) => {
  const [input, setInput] = useState<string>("")
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      }

      const { data } = await axios.patch(`/api/community/post/comment`, payload)
      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: "There was an error.",
        description: "Something went wrong, try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput("")
      toast({
        description: "Comment successfully posted.",
      })
    },
  })

  return (
    <div className="grid w-full gap-1.5 mt-6">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
          className="bg-[#f9fafa] dark:bg-[#262626] border border-border dark:border-[#ffffff33]"
        />
        <div className="mt-2 flex justify-end">
          <Button
            onClick={() => comment({ postId, text: input, replyToId })}
            disabled={input.length === 0}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment
