import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { format } from "date-fns"

export default async function RootLayout({
  children,
  params: { slug },
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const session = await getAuthSession()

  const community = await db.community.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  if (!community) return notFound()

  const memberCount = await db.subscribtion.count({
    where: {
      community: {
        name: slug,
      },
    },
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
      <div className="flex flex-col col-span-2 space-y-6">{children}</div>
      <div className="hidden xl:block overflow-hidden h-fit rounded-lg border border-border">
        <div className="bg-[#f9fafa] px-3 py-3">
          <div className="flex flex-col">
            <h2 className="text-[14px] font-bold text-[#2a3c42]">
              /c/{community.name}
            </h2>
            <p className="text-[14px] text-[#576f76]">
              Spark community subtitle community subtitle community subtitle
              community subtitle community
            </p>
          </div>
          <dl className="mt-4 border-t-[1px] border-border divide-y divide-border leading-6">
            <div className="flex justify-between gap-x-4 py-2">
              <dt className="text-[12px] text-[#576f76]">Created On</dt>
              <dd className="text-[14px] font-semibold text-[#2a3c42]">
                <time dateTime={community.createdAt.toDateString()}>
                  {format(community.createdAt, "MMMM d, yyyy")}
                </time>
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-2">
              <dt className="text-[12px] text-[#576f76]">Members</dt>
              <dt className="text-[14px] font-semibold text-[#2a3c42]">
                {memberCount}
              </dt>
            </div>

            {community.creatorId === session?.user.id ? (
              <div className="flex justify-end gap-x-4 pt-4">
                <p className="text-[12px] text-[#576f76]">
                  You created this community
                </p>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </div>
  )
}
