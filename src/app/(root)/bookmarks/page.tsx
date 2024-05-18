import BookmarkedPost from "@/components/BookmarkedPost"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"

export const metadata = {
  title: "Bookmarks",
  description: "Your saved posts.",
}

const page = async () => {
  const session = await getAuthSession()

  const bookmarks = await db.bookmark.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      post: true,
    },
  })

  const bookmarkedPostIds = bookmarks.map((bookmark) => bookmark.postId)

  const bookmarkedPosts = await db.post.findMany({
    where: {
      id: {
        in: bookmarkedPostIds,
      },
    },
    include: {
      author: true,
      community: true,
    },
  })

  return (
    <>
      <h1 className="font-bold text-2xl md:text-3xl">Your saved posts</h1>

      <section className="mt-5 flex w-full flex-col gap-4">
        {bookmarkedPosts.length === 0 ? (
          <p className="text-[14px] text-[#576f76] dark:text-[#838383]">
            You didn't save any post yet.
          </p>
        ) : (
          <>
            {bookmarkedPosts.map((post) => (
              <BookmarkedPost
                key={post.id}
                authorUsername={post.author.username}
                authorImage={post.author.image}
                postId={post.id}
                postDatetime={post.createdAt}
                postTitle={post.title}
                postContent={post.content}
                communityName={post.community.name}
              />
            ))}
          </>
        )}
      </section>
    </>
  )
}

export default page
