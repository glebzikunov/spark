"use client"

import React, { useRef, useState } from "react"
import UserAvatar from "./UserAvatar"
import { Comment, CommentVote, User } from "@prisma/client"
import { formatTimeToNow } from "@/lib/utils"
import CommentVotes from "./CommentVotes"
import { Button } from "./ui/button"
import { Loader2, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { useMutation } from "@tanstack/react-query"
import { CommentRequest } from "@/lib/validators/comment"
import axios from "axios"
import { toast } from "@/hooks/use-toast"

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
}

interface PostCommentProps {
  comment: ExtendedComment
  votesAmount: number
  currentVote: CommentVote | undefined
  postId: string
}

const PostComment = ({
  comment,
  votesAmount,
  currentVote,
  postId,
}: PostCommentProps) => {
  const commentRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { data: session } = useSession()
  const [isReplying, setIsReplying] = useState<boolean>(false)
  const [input, setInput] = useState<string>("")

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      }

      const { data } = await axios.patch(`/api/community/post/comment`, payload)
      return data
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Comment wasn't posted successfully. Try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      router.refresh()
      setIsReplying(false)
      setInput("")
    },
  })

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-7 w-7"
        />
        <div className="ml-2 flex items-center text-xs gap-x-2">
          <p className="font-bold text-[#2A3C42] dark:text-[#838383]">
            u/{comment.author.username}
          </p>
          <span className="text-[#F97316] font-bold">●</span>
          <p className="max-h-40 truncate text-[#576F76] dark:text-[#838383]">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
          <span className="font-medium text-[#576F76] dark:text-[#838383]"></span>
        </div>
      </div>
      <p className="text-sm mt-2">{comment.text}</p>
      <div className="flex gap-2 items-center mt-2">
        <CommentVotes
          commentId={comment.id}
          initialVotesAmount={votesAmount}
          initialVote={currentVote}
        />
        <Button
          onClick={() => {
            if (!session) router.push("/sign-in")
            setIsReplying(true)
          }}
          variant="ghost"
          size="sm"
          className="flex items-center"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Reply
        </Button>
      </div>
      {isReplying ? (
        <div className="grid w-full gap-1.5">
          <div className="mt-3">
            <Textarea
              id="comment"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="What are your thoughts?"
              className="bg-[#f9fafa] dark:bg-[#262626] border border-border dark:border-[#313131]"
            />
            <div className="mt-2 flex gap-2 justify-end">
              <Button
                tabIndex={-1}
                variant="secondary"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  postComment({
                    postId,
                    text: input,
                    replyToId: comment.replyToId ?? comment.id,
                  })
                }
                disabled={input.length === 0}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PostComment
