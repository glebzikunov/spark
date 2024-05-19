import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommunityBadgeValidator } from "@/lib/validators/community"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { id, title, color } = CommunityBadgeValidator.parse(body)

    const badgeExists = await db.badge.findFirst({
      where: {
        communityId: id,
        title,
      },
    })

    if (badgeExists) {
      return new Response("You are already have this badge.", { status: 400 })
    }

    await db.badge.create({
      data: {
        communityId: id,
        title,
        color,
      },
    })

    return new Response(id)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }

    return new Response("Could not create badge. Try again later.", {
      status: 500,
    })
  }
}
