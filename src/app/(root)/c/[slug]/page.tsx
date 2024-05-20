import MiniCreatePost from "@/components/MiniCreatePost"
import PostFeed from "@/components/PostFeed"
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle"
import UserAvatar from "@/components/UserAvatar"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { hasSubscription } from "@/helpers/billing"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { format } from "date-fns"
import { Gem, UserCircle2Icon } from "lucide-react"
import { notFound } from "next/navigation"
import { redirect } from "next/navigation"

interface PageProps {
  params: {
    slug: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params
  const session = await getAuthSession()

  const hasSub = await hasSubscription()

  const community = await db.community.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  })

  const subscription = !session?.user
    ? undefined
    : await db.subscribtion.findFirst({
        where: {
          community: {
            name: slug,
          },
          user: { id: session.user.id },
        },
      })

  const isSubscribed = !!subscription

  const memberCount = await db.subscribtion.count({
    where: {
      community: {
        name: slug,
      },
    },
  })

  if (!community) {
    return notFound()
  }

  if (community?.isPremium && !hasSub) {
    redirect("/")
  }

  return (
    <>
      <div className="flex max-md:flex-col max-lg:gap-3 md:items-center justify-between">
        <div className="flex items-center gap-3">
          {community.image ? (
            <div className="relative">
              <UserAvatar
                user={{
                  name: community.name || null,
                  image: community.image || null,
                }}
                className="h-10 w-10 md:h-20 md:w-20"
              />
              {community.isPremium ? (
                <Gem
                  strokeWidth={2}
                  fill="#38b1e7"
                  className="absolute h-[14px] w-[14px] md:h-[26px] md:w-[26px] right-0 bottom-0 stroke-[#299acc]"
                />
              ) : null}
            </div>
          ) : (
            <div className="relative">
              <UserCircle2Icon
                strokeWidth={0.75}
                className="h-10 w-10 md:h-20 md:w-20 stroke-[#F97316]"
              />
              {community.isPremium ? (
                <Gem
                  strokeWidth={2}
                  fill="#38b1e7"
                  className="absolute h-[14px] w-[14px] md:h-[26px] md:w-[26px] right-0 bottom-0 stroke-[#299acc]"
                />
              ) : null}
            </div>
          )}
          <div className="flex max-xl:flex-col">
            <h1 className="font-bold text-2xl md:text-3xl ">
              c/{community.name}
            </h1>
            <div className="flex gap-1">
              <p className="text-[12px] text-[#576f76] dark:text-[#838383] xl:hidden">
                {memberCount === 1
                  ? memberCount + " member"
                  : memberCount + " members"}
              </p>
              <p className="text-[12px] text-[#F97316] xl:hidden">|</p>
              <p className="text-[12px] text-[#576f76] dark:text-[#838383] xl:hidden">
                <time dateTime={community.createdAt.toDateString()}>
                  Created on {format(community.createdAt, "MMMM d, yyyy")}
                </time>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <MiniCreatePost />
          {community.creatorId !== session?.user.id ? (
            <SubscribeLeaveToggle
              communityId={community.id}
              communityName={community.name}
              isSubscribed={isSubscribed}
            />
          ) : null}
        </div>
      </div>
      <PostFeed initialPosts={community.posts} communityName={community.name} />
    </>
  )
}

export default Page
