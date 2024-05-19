import EditCommunityForm from "@/components/EditCommunityForm"
import { columns } from "@/components/community-table/columns"
import { DataTable } from "@/components/community-table/data-table"
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
    include: {
      badges: true,
    },
  })

  const currentUserSubscription = await db.subscribtion.findFirst({
    where: {
      communityId: community?.id,
      userId: session?.user.id,
    },
  })

  const subscribedUsers = await db.user.findMany({
    where: {
      Subscribption: {
        some: {
          communityId: community?.id,
        },
      },
    },
    select: {
      id: true,
      username: true,
      Subscribption: {
        select: {
          communityId: true,
        },
      },
    },
  })

  const result = subscribedUsers.map((user) => ({
    id: user.id,
    username: user.username,
    communityId: user.Subscribption[0].communityId,
    communityName: params.slug,
  }))

  return (
    <>
      <h1 className="font-bold text-2xl md:text-3xl">
        Manage{" "}
        <span className="underline underline-offset-4">c/{params.slug}</span>
      </h1>
      <div className="mt-5">
        <EditCommunityForm
          isModerator={currentUserSubscription?.isModerator}
          id={community?.id || ""}
          communityImage={community?.image}
          description={community?.description || `${community?.name} community`}
          badges={community?.badges}
        />
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={result} />
      </div>
    </>
  )
}

export default EditCommunity
