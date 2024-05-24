import EditPost from "@/components/EditPost"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import Link from "next/link"

interface PageProps {
  params: {
    postId: string
  }
}

const page = async ({ params }: PageProps) => {
  const post = await db.post.findFirst({
    where: {
      id: params.postId,
    },
  })

  const community = await db.community.findFirst({
    where: {
      id: post?.communityId,
    },
  })

  return (
    <>
      <h1 className="font-bold text-2xl md:text-3xl">Edit post</h1>
      <section className="mt-5 flex flex-wrap gap-4">
        <EditPost
          postId={params.postId}
          postContent={post?.content}
          communityName={community?.name}
        />
        <div className="w-full flex justify-end gap-3">
          <Button variant="secondary" asChild>
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button
            className="border-[#ea580ce6] hover:bg-[#ea580ce6] text-[#ea580ce6] hover:text-white"
            variant="outline"
            type="submit"
            form="community-edit-post-form"
          >
            Edit
          </Button>
        </div>
      </section>
    </>
  )
}

export default page
