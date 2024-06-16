import CommentsSection from "@/components/CommentsSection"
import EditorOutput from "@/components/EditorOutput"
import PostVoteServer from "@/components/post-vote/PostVoteServer"
import { Button } from "@/components/ui/button"
import { hasSubscription } from "@/helpers/billing"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { formatTimeToNow } from "@/lib/utils"
import { CachedPost } from "@/types/redis"
import { Post, User, Vote } from "@prisma/client"
import { Loader2, ThumbsDown, ZapIcon } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"

interface PageProps {
  params: {
    postId: string
  }
}

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

const Page = async ({ params }: PageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost

  let post: (Post & { votes: Vote[]; author: User }) | null = null

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    })
  }

  if (!cachedPost && !post) return notFound()

  const communityPost = await db.post.findFirst({
    where: {
      id: params.postId,
    },
  })

  const community = await db.community.findFirst({
    where: {
      id: communityPost?.communityId,
    },
  })

  const hasSub = await hasSubscription()

  if (communityPost?.isPremium && !hasSub) {
    redirect("/")
  }

  return (
    <div>
      <div className="rounded-lg border border-border dark:border-[#ffffff33] shadow transition-colors hover:bg-[#f9fafa] dark:hover:bg-[#262626]">
        <div className="px-4 pt-4 sm:px-6 sm:pt-6 pb-0 flex">
          <div className="w-0 flex-1">
            <div className="flex items-center">
              <div className="flex items-center max-h-40 text-xs">
                <div className="flex flex-col">
                  <Link
                    href={`/c/${community?.name}`}
                    className="text-[#2A3C42] dark:text-[#5A5A5A] font-bold hover:underline hover:underline-offset-2"
                  >
                    c/{community?.name}
                  </Link>
                  <Link
                    href={`/u/${
                      post?.author.username ?? cachedPost.authorUsername
                    }`}
                    className="font-bold text-[#2A3C42] dark:text-[#838383] hover:underline underline-offset-2"
                  >
                    u/{post?.author.username ?? cachedPost.authorUsername}
                  </Link>
                </div>
                <span className="text-[#F97316] font-bold px-2">●</span>
                <span className="font-medium text-[#576F76] dark:text-[#838383]">
                  {formatTimeToNow(
                    new Date(post?.createdAt ?? cachedPost.createdAt)
                  )}
                </span>
              </div>
            </div>
            {communityPost?.badgeColor !== "none" ? (
              <p
                //@ts-ignore
                style={{ backgroundColor: communityPost.badgeColor || "" }}
                className="mt-4 text-sm px-2 w-fit h-fit text-white rounded-full"
              >
                {communityPost?.badgeTitle}
              </p>
            ) : null}
            <h1 className="text-xl font-semibold mt-4 pb-[11px] leading-6">
              {post?.title ?? cachedPost.title}
            </h1>
            <EditorOutput content={post?.content ?? cachedPost.content} />
          </div>
        </div>
        <div className="z-20 text-sm px-4 pb-4 sm:px-6 pt-4 sm:pb-6 ">
          <div className="flex items-center gap-4 sm:gap-8">
            <Suspense fallback={<PostVoteShell />}>
              {/* @ts-expect-error server component */}
              <PostVoteServer
                postId={post?.id ?? cachedPost.id}
                getData={async () => {
                  return await db.post.findUnique({
                    where: {
                      id: params.postId,
                    },
                    include: {
                      votes: true,
                    },
                  })
                }}
              />
            </Suspense>
          </div>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="flex w-full justify-center">
            <Loader2 className="h-5 w-5 animate-spin mt-6" />
          </div>
        }
      >
        {/* @ts-expect-error server component */}
        <CommentsSection postId={post?.id ?? cachedPost.id} />
      </Suspense>
    </div>
  )
}

function PostVoteShell() {
  return (
    <div className="flex items-center pr-6 w-20">
      <Button
        className="px-1 sm:px-3 rounded-sm hover:bg-[#dcdcdd] dark:hover:bg-[#464646]"
        size="sm"
        variant="ghost"
        aria-label="like"
      >
        <ZapIcon className="h-5 w-5" />
      </Button>
      <p className="flex items-center justify-center font-medium text-sm">
        <Loader2 className="h-3 w-3 animate-spin" />
      </p>
      <Button
        className="px-1 sm:px-3 rounded-sm hover:bg-[#dcdcdd] dark:hover:bg-[#464646]"
        size="sm"
        variant="ghost"
        aria-label="dislike"
      >
        <ThumbsDown className="h-5 w-5" />
      </Button>
    </div>
  )
}

export default Page
