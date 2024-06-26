import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommunityImageValidator } from "@/lib/validators/community"
import { z } from "zod"

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { image, id } = CommunityImageValidator.parse(body)

    const community = await db.community.findFirst({ where: { id } })
    const currentUserSubscription = await db.subscribtion.findFirst({
      where: {
        communityId: id,
        userId: session?.user.id,
      },
    })

    if (
      community?.creatorId !== session?.user.id ||
      currentUserSubscription?.isModerator === false
    ) {
      return new Response(
        "Access denied. You are not moderator of this community.",
        { status: 403 }
      )
    }

    await db.community.update({
      where: {
        id: community?.id,
      },
      data: {
        image: image,
      },
    })

    return new Response("OK")
  } catch (error) {
    error

    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 400 })
    }

    return new Response(
      "Could not update community image at this time. Try again later.",
      { status: 500 }
    )
  }
}
