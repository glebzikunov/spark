import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import "../../../../styles/globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/UserAvatar"
import { UserCircle2Icon } from "lucide-react"

export default async function RootLayout({
  children,
  params: { slug },
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const user = await db.user.findFirst({
    where: { username: slug },
  })

  if (!user) return notFound()

  const postsCount = await db.post.count({
    where: {
      authorId: user.id,
    },
  })

  const createdCommunities = await db.community.findMany({
    where: {
      creatorId: user.id,
    },
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 md:gap-x-4 pb-6">
      <div className="flex flex-col col-span-2 space-y-6">{children}</div>
      <div className="hidden xl:block overflow-hidden h-fit rounded-lg border border-border dark:border-[#ffffff33]">
        <div className="bg-[#f9fafa] dark:bg-[#262626] px-3 py-3">
          <div className="flex flex-col">
            <h2 className="text-[14px] font-bold text-[#2a3c42] dark:text-[#5A5A5A]">
              {user.name}
            </h2>
            <div className="mt-1 flex justify-between gap-x-4">
              <p className="text-[14px] font-semibold text-[#576f76] dark:text-[#838383]">
                Posts
              </p>
              <p className="text-[14px] font-semibold text-[#2a3c42] dark:text-[#5A5A5A]">
                {postsCount}
              </p>
            </div>
          </div>
          <p className="my-4 text-[15px] font-semibold uppercase">
            Moderator of these communities
          </p>
          {createdCommunities.length > 0 ? (
            createdCommunities.map((community) => (
              <div className="flex justify-between gap-x-4 py-2">
                <div className="flex items-center gap-2">
                  {community.image ? (
                    <UserAvatar
                      user={{
                        name: community.name || null,
                        image: community.image || null,
                      }}
                      className="h-8 w-8"
                    />
                  ) : (
                    <UserCircle2Icon
                      strokeWidth={0.75}
                      className="h-8 w-8 stroke-[#F97316]"
                    />
                  )}
                  <p className="text-[14px] font-semibold">
                    c/{community.name}
                  </p>
                </div>
                <div>
                  <Link href={`/c/${community.name}`}>
                    <Button size="sm" className="rounded-full">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[14px] font-semibold text-[#576f76] dark:text-[#838383]">
              No results.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
