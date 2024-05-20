import { hasSubscription } from "@/helpers/billing"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommunityValidator } from "@/lib/validators/community"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, image, description, isPremium } =
      CommunityValidator.parse(body)

    const communityExists = await db.community.findFirst({
      where: {
        name,
      },
    })

    if (communityExists) {
      return new Response("Community already exists", { status: 409 })
    }

    const hasSub = await hasSubscription()

    if (hasSub && isPremium === true) {
      const community = await db.community.create({
        data: {
          name,
          image,
          description,
          creatorId: session.user.id,
          isPremium: true,
        },
      })

      await db.subscribtion.create({
        data: {
          userId: session.user.id,
          communityId: community.id,
          isModerator: true,
        },
      })
    } else if (!hasSub && isPremium === true) {
      return new Response("Access denied. You are not a spark premium user.", {
        status: 403,
      })
    } else if (isPremium === false) {
      const community = await db.community.create({
        data: {
          name,
          image,
          description,
          creatorId: session.user.id,
          isPremium: false,
        },
      })

      await db.subscribtion.create({
        data: {
          userId: session.user.id,
          communityId: community.id,
          isModerator: true,
        },
      })
    }

    return new Response(name)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response("Could not create a community. Try again later.", {
      status: 500,
    })
  }
}
