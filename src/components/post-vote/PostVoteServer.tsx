import { Post, Vote, VoteType } from "@prisma/client"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import PostVoteClient from "./PostVoteClient"

interface PostVoteServerProps {
  postId: string
  initialVotesAmount?: number
  initialVote?: VoteType | null
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>
}

const PostVoteServer = async ({
  postId,
  initialVotesAmount,
  initialVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getServerSession()

  let _votesAmount: number = 0
  let _currentVote: VoteType | null | undefined = undefined

  if (getData) {
    const post = await getData()
    if (!post) return notFound()

    _votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === "LIKE") return acc + 1
      if (vote.type === "DISLIKE") return acc - 1

      return acc
    }, 0)

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id
    )?.type
  } else {
    _votesAmount = initialVotesAmount!
    _currentVote = initialVote
  }
  return (
    <PostVoteClient
      postId={postId}
      initialVotesAmount={_votesAmount}
      initialVote={_currentVote}
    />
  )
}

export default PostVoteServer
