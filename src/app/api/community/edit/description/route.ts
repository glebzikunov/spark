import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommunityDescriptionValidator } from "@/lib/validators/community"
import { z } from "zod"

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { description, id } = CommunityDescriptionValidator.parse(body)

    const community = await db.community.findFirst({ where: { id } })

    if (community?.creatorId !== session.user.id) {
      return new Response(
        "Access denied. You are not moderator of this community.",
        { status: 403 }
      )
    }

    await db.community.update({
      where: {
        id: community.id,
      },
      data: {
        description: description,
      },
    })

    return new Response("OK")
  } catch (error) {
    error

    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 400 })
    }

    return new Response(
      "Could not update community description at this time. Try again later.",
      { status: 500 }
    )
  }
}
