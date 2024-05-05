"use client"

import { useCustomToast } from "@/hooks/use-custom.toast"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { CommentVoteRequest } from "@/lib/validators/vote"
import { usePrevious } from "@mantine/hooks"
import { CommentVote, VoteType } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { ThumbsDown, ZapIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"

type PartialVote = Pick<CommentVote, "type">

interface CommentVotesProps {
  commentId: string
  initialVotesAmount: number
  initialVote?: PartialVote
}

const CommentVotes = ({
  commentId,
  initialVotesAmount,
  initialVote,
}: CommentVotesProps) => {
  const { loginToast } = useCustomToast()
  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const previousVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      }

      await axios.patch("/api/community/post/comment/vote", payload)
    },
    onError: (err, voteType) => {
      if (voteType === "LIKE") setVotesAmount((prev) => prev - 1)
      else setVotesAmount((prev) => prev + 1)

      setCurrentVote(previousVote)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      toast({
        title: "Something went wrong.",
        description: "Your vote wasn't registered. Try again later.",
        variant: "destructive",
      })
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined)

        if (type === "LIKE") setVotesAmount((prev) => prev - 1)
        else if (type === "DISLIKE") setVotesAmount((prev) => prev + 1)
      } else {
        setCurrentVote({ type })

        if (type === "LIKE")
          setVotesAmount((prev) => prev + (currentVote ? 2 : 1))
        else if (type === "DISLIKE")
          setVotesAmount((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className="flex gap-1 sm:gap-2 rounded-sm bg-[#EAEDEF] dark:bg-[#303030]">
      <Button
        onClick={() => vote("LIKE")}
        className="px-1 sm:px-3 rounded-sm hover:bg-[#dcdcdd] dark:hover:bg-[#464646]"
        size="sm"
        variant="ghost"
        aria-label="like"
      >
        <ZapIcon
          className={cn("h-5 w-5", {
            "text-[#F97316] fill-[#F97316]": currentVote?.type === "LIKE",
          })}
        />
      </Button>
      <p className="flex items-center justify-center font-medium text-sm">
        {votesAmount}
      </p>
      <Button
        onClick={() => vote("DISLIKE")}
        className="px-1 sm:px-3 rounded-sm hover:bg-[#dcdcdd] dark:hover:bg-[#464646]"
        size="sm"
        variant="ghost"
        aria-label="dislike"
      >
        <ThumbsDown
          className={cn("h-5 w-5", {
            "text-[#F97316] stroke-[#F97316]": currentVote?.type === "DISLIKE",
          })}
        />
      </Button>
    </div>
  )
}

export default CommentVotes
