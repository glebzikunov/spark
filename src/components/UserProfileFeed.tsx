"use client"

import { ExtendedPost } from "@/types/db"
import { useSession } from "next-auth/react"
import Post from "./Post"

interface UserProfileFeedProps {
  initialPosts: ExtendedPost[]
}

const UserProfileFeed = ({ initialPosts }: UserProfileFeedProps) => {
  const { data: session } = useSession()

  const posts = initialPosts || []

  return (
    <section className="mt-6">
      <ul className="flex flex-col col-span-2 space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => {
            const votesAmount = post.votes.reduce((acc, vote) => {
              if (vote.type === "LIKE") return acc + 1
              if (vote.type === "DISLIKE") return acc - 1
              return acc
            }, 0)

            const currentVote = post.votes.find(
              (vote) => vote.userId === session?.user.id
            )

            return (
              <li key={post.id}>
                <Post
                  currentVote={currentVote}
                  votesAmount={votesAmount}
                  commentAmount={post.comments.length}
                  post={post}
                  communityName={post.community.name}
                />
              </li>
            )
          })
        ) : (
          <p className="text-[14px] text-[#576f76] dark:text-[#838383]">
            No activity.
          </p>
        )}
      </ul>
    </section>
  )
}


export default UserProfileFeed
