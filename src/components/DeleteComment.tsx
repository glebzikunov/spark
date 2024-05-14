"use client"

import { toast } from "@/hooks/use-toast"
import { DeleteCommentRequest } from "@/lib/validators/comment"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "./ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"

interface DeleteCommentProps {
  commentId: string
  currentUserId: string | undefined
  authorId: string
}
const DeleteComment = ({
  commentId,
  currentUserId,
  authorId,
}: DeleteCommentProps) => {
  const { data: session } = useSession()
  const router = useRouter()

  const { mutate: deleteComment, isLoading } = useMutation({
    mutationFn: async ({ commentId }: DeleteCommentRequest) => {
      const payload: DeleteCommentRequest = {
        commentId,
      }

      const { data } = await axios.patch(
        `/api/community/post/comment/delete`,
        payload
      )
      return data
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Comment wasn't deleted successfully. Try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      router.refresh()
      toast({
        description: "Comment successfully deleted.",
      })
    },
  })

  if (currentUserId === authorId) {
    return (
      <Button
        onClick={() => {
          if (!session) router.push("/sign-in")
          deleteComment({ commentId })
        }}
        variant="ghost"
        size="sm"
        className="flex items-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
            <span className="hidden sm:block">Delete</span>
          </>
        ) : (
          <>
            <Trash2 className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:block">Delete</span>
          </>
        )}
      </Button>
    )
  } else {
    return null
  }
}

export default DeleteComment
