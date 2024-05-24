import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { ModeratorValidator } from "@/lib/validators/moderator"
import { z } from "zod"

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { userId, communityId, communityName } =
      ModeratorValidator.parse(body)

    const community = await db.community.findFirst({
      where: {
        name: communityName,
      },
    })

    if (community?.creatorId === userId) {
      return new Response("This user is a community creator.", { status: 409 })
    }

    await db.subscribtion.update({
      where: {
        userId_communityId: {
          communityId,
          userId,
        },
      },
      data: {
        isModerator: true,
      },
    })

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }

    return new Response("Could not change user role. Try again later.", {
      status: 500,
    })
  }
}
