import MiniCreatePost from "@/components/MiniCreatePost"
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { format } from "date-fns"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    slug: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params
  const session = await getAuthSession()

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

  return (
    <>
      <div className="flex max-md:flex-col max-lg:gap-3 justify-between">
        <div className="flex max-lg:flex-col">
          <h1 className="font-bold text-2xl md:text-3xl ">
            c/{community.name}
          </h1>
          <div className="flex gap-1">
            <p className="text-[12px] text-[#576f76] md:hidden">
              {memberCount === 1
                ? memberCount + " member"
                : memberCount + " members"}
            </p>
            <p className="text-[12px] text-[#F97316] md:hidden">|</p>
            <p className="text-[12px] text-[#576f76] md:hidden">
              <time dateTime={community.createdAt.toDateString()}>
                Created on {format(community.createdAt, "MMMM d, yyyy")}
              </time>
            </p>
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
    </>
  )
}

export default Page
