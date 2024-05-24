import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommunityBadgeValidator } from "@/lib/validators/community"
import { z } from "zod"

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { id, title, color } = CommunityBadgeValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    await db.badge.delete({
      where: {
        id,
      },
    })

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }

    return new Response("Could not delete badge. Try again later.", {
      status: 500,
    })
  }
}
