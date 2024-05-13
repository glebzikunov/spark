import EditCommunityForm from "@/components/EditCommunityForm"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"

interface EditCommunityProps {
  params: {
    slug: string
  }
}

const EditCommunity = async ({ params }: EditCommunityProps) => {
  const session = await getAuthSession()
  const community = await db.community.findFirst({
    where: { name: params.slug },
  })

  return (
    <>
      <h1 className="font-bold text-2xl md:text-3xl">
        Manage{" "}
        <span className="underline underline-offset-4">c/{params.slug}</span>
      </h1>
      <div className="mt-5">
        <EditCommunityForm
          id={community?.id || ""}
          creatorId={community?.creatorId}
          userId={session?.user.id}
          communityImage={community?.image}
          description={community?.description || `${community?.name} community`}
        />
      </div>
    </>
  )
}

export default EditCommunity
