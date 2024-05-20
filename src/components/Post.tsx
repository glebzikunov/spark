"use client"

import { formatTimeToNow } from "@/lib/utils"
import { Post, User, Vote } from "@prisma/client"
import { MessageCircle } from "lucide-react"
import { useRef } from "react"
import EditorOutput from "./EditorOutput"
import UserAvatar from "./UserAvatar"
import PostVoteClient from "./post-vote/PostVoteClient"
import PostDropdown from "./PostDropdown"

type PartialVote = Pick<Vote, "type">

interface PostProps {
  communityName: string
  post: Post & {
    author: User
    votes: Vote[]
  }
  commentAmount: number
  votesAmount: number
  currentVote?: PartialVote
}

const Post = ({
  communityName,
  post,
  commentAmount,
  votesAmount,
  currentVote,
}: PostProps) => {
  const pRef = useRef<HTMLDivElement>(null)

  return (
    <div className="rounded-lg border border-border dark:border-[#ffffff33] shadow transition-colors hover:bg-[#f9fafa] dark:hover:bg-[#262626]">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 pb-0 flex">
        <div className="w-0 flex-1">
          <div className="flex items-center gap-2">
            <UserAvatar
              user={{
                name: post.author.name || null,
                image: post.author.image || null,
              }}
              className="h-7 w-7"
            />
            <div className="flex items-center max-h-40 text-xs">
              {communityName ? (
                <div className="flex flex-col">
                  <a
                    className="text-[#2A3C42] dark:text-[#5A5A5A] font-bold hover:underline hover:underline-offset-2"
                    href={`/c/${communityName}`}
                  >
                    c/{communityName}
                  </a>
                  <a
                    className="text-[#576F76] dark:text-[#838383] hover:underline hover:underline-offset-2"
                    href={`/u/${post.author.username}`}
                  >
                    u/{post.author.username}
                  </a>
                </div>
              ) : null}

              <span className="text-[#F97316] font-bold px-2">●</span>
              <span className="font-medium text-[#576F76] dark:text-[#838383]">
                {formatTimeToNow(new Date(post.createdAt))}
              </span>
            </div>
          </div>

          {post.badgeColor !== "none" ? (
            <p
              style={{ backgroundColor: post.badgeColor || "" }}
              className="mt-4 text-sm px-2 w-fit h-fit text-white rounded-full"
            >
              {post.badgeTitle}
            </p>
          ) : null}

          <a href={`/c/${communityName}/post/${post.id}`}>
            <h1 className="text-xl font-semibold mt-4 pb-[11px] leading-6">
              {post.title}
            </h1>
          </a>
          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent dark:from-[#1F1F1F]" />
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex justify-between z-20 text-sm px-4 pb-4 sm:px-6 pt-4 sm:pb-6 ">
        <div className="flex items-center gap-4 sm:gap-8">
          <PostVoteClient
            postId={post.id}
            initialVote={currentVote?.type}
            initialVotesAmount={votesAmount}
          />
          <a
            className="w-fit flex items-center gap-2 font-medium"
            href={`/c/${communityName}/post/${post.id}`}
          >
            <MessageCircle className="h-5 w-5" /> {commentAmount}
            <span className="hidden md:block">
              {commentAmount !== 1 ? "comments" : "comment"}
            </span>
          </a>
        </div>
        <PostDropdown
          communityName={communityName}
          authorId={post.author.id}
          postId={post.id}
        />
      </div>
    </div>
  )
}

export default Post
