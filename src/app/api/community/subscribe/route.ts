import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommunitySubscriptionValidator } from "@/lib/validators/community"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { communityId } = CommunitySubscriptionValidator.parse(body)

    const subscriptionExists = await db.subscribtion.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    })

    if (subscriptionExists) {
      return new Response("You are already a member.", { status: 400 })
    }

    await db.subscribtion.create({
      data: {
        communityId,
        userId: session.user.id,
        isModerator: false,
      },
    })

    return new Response(communityId)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }

    return new Response("Could not create a subscription. Try again later.", {
      status: 500,
    })
  }
}
