import UserAvatar from "@/components/UserAvatar"
import UserProfileFeed from "@/components/UserProfileFeed"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants"
import { db } from "@/lib/db"
import { UserCircle2Icon } from "lucide-react"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    slug: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params

  const user = await db.user.findFirst({
    where: { username: slug },
  })

  if (!user) {
    return notFound()
  }

  const posts = await db.post.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      community: true,
    },
  })

  const popularPosts = await getPopularPosts(user.id)

  return (
    <>
      <div className="flex max-md:flex-col max-lg:gap-3 md:items-center justify-between">
        <div className="flex items-center gap-3">
          {user.image ? (
            <UserAvatar
              user={{
                name: user.username || null,
                image: user.image || null,
              }}
              className="h-10 w-10 md:h-20 md:w-20"
            />
          ) : (
            <UserCircle2Icon
              strokeWidth={0.75}
              className="h-10 w-10 md:h-20 md:w-20 stroke-[#F97316]"
            />
          )}
          <div className="flex flex-col">
            <h1 className="font-bold text-xl md:text-2xl">{user.name}</h1>
            <p className="font-semibold text-lg md:text-xl text-[#576f76] dark:text-[#838383]">
              u/{user.username}
            </p>
          </div>
        </div>
      </div>
      <div className="flex mt-5">
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="flex min-h-[50px] flex-1 items-center border border-border dark:border-[#ffffff33] text-[#576f76] dark:text-[#838383] bg-[#F9FAFA] dark:bg-[#262626]  dark:data-[state=active]:bg-[#303030] data-[state=active]:bg-[#eaedef] data-[state=active]:text-light-2">
            {profileTabs.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.value}
                className="flex min-h-[40px] flex-1 items-center text-[#576f76] dark:text-[#838383] bg-[#F9FAFA] dark:bg-[#262626]  dark:data-[state=active]:bg-[#303030] data-[state=active]:bg-[#eaedef] data-[state=active]:text-light-2"
              >
                <p>{tab.label}</p>
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent key="content-New" value="new" className="w-full">
            <UserProfileFeed initialPosts={posts} />
          </TabsContent>
          <TabsContent key="content-Popular" value="popular" className="w-full">
            <UserProfileFeed initialPosts={popularPosts} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

const getPopularPosts = async (userId: string) => {
  const posts = await db.post.findMany({
    where: {
      authorId: userId,
    },
    include: {
      community: true,
      votes: true,
      author: true,
      comments: true,
    },
  })

  const postsWithVoteCounts = posts.map((post) => {
    const votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === "LIKE") return acc + 1
      if (vote.type === "DISLIKE") return acc - 1
      return acc
    }, 0)
    return {
      ...post,
      votesAmount,
    }
  })

  const sortedPosts = postsWithVoteCounts.sort(
    (a, b) => b.votesAmount - a.votesAmount
  )

  const finalPosts = sortedPosts.map(({ votesAmount, ...post }) => ({
    ...post,
    community: post.community,
    votes: post.votes,
    author: post.author,
    comments: post.comments,
  }))

  return finalPosts
}

export default Page
