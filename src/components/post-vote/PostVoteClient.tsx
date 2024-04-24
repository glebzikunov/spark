"use client"

import { usePrevious } from "@mantine/hooks"
import { VoteType } from "@prisma/client"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { ThumbsDown, ZapIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { PostVoteRequest } from "@/lib/validators/vote"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { useCustomToast } from "@/hooks/use-custom.toast"

interface PostVoteClientProps {
  postId: string
  initialVotesAmount: number
  initialVote?: VoteType | null
}

const PostVoteClient = ({
  postId,
  initialVotesAmount,
  initialVote,
}: PostVoteClientProps) => {
  const { loginToast } = useCustomToast()
  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const previousVote = usePrevious(currentVote)

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      }

      await axios.patch("/api/community/post/vote", payload)
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
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined)

        if (type === "LIKE") setVotesAmount((prev) => prev - 1)
        else if (type === "DISLIKE") setVotesAmount((prev) => prev + 1)
      } else {
        setCurrentVote(type)

        if (type === "LIKE")
          setVotesAmount((prev) => prev + (currentVote ? 2 : 1))
        else if (type === "DISLIKE")
          setVotesAmount((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className="flex gap-1 sm:gap-2 rounded-sm bg-[#EAEDEF]">
      <Button
        onClick={() => vote("LIKE")}
        className="px-1 sm:px-3 rounded-sm"
        size="sm"
        variant="ghost"
        aria-label="like"
      >
        <ZapIcon
          className={cn("h-5 w-5", {
            "text-[#F97316] fill-[#F97316]": currentVote === "LIKE",
          })}
        />
      </Button>
      <p className="flex items-center justify-center font-medium text-sm">
        {votesAmount}
      </p>
      <Button
        onClick={() => vote("DISLIKE")}
        className="px-1 sm:px-3 rounded-sm"
        size="sm"
        variant="ghost"
        aria-label="dislike"
      >
        <ThumbsDown
          className={cn("h-5 w-5", {
            "text-[#F97316] stroke-[#F97316]": currentVote === "DISLIKE",
          })}
        />
      </Button>
    </div>
  )
}

export default PostVoteClient
