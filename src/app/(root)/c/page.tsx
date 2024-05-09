import MiniCommunityCard from "@/components/MiniCommunityCard"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"

export const metadata = {
  title: "Communities",
  description: "Communities you are currently joined.",
}

const page = async () => {
  const session = await getAuthSession()

  const followedCommunities = await db.subscribtion.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      community: {
        include: {
          subscribers: {
            take: 3,
            include: {
              user: {
                select: {
                  id: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  })

  return (
    <>
      <h1 className="font-bold text-2xl md:text-3xl">Followed Communities</h1>

      <section className="mt-5 flex flex-wrap gap-4">
        {followedCommunities.length === 0 ? (
          <p className="no-result">You didn't join any community.</p>
        ) : (
          <>
            {followedCommunities.map(({ community, communityId }) => (
              <MiniCommunityCard
                key={communityId}
                id={communityId}
                communityDescription={community.description}
                imgUrl={community.image}
                communityName={community.name}
                subscribers={community.subscribers}
              />
            ))}
          </>
        )}
      </section>
    </>
  )
}

export default page
