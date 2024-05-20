import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { PostValidator } from "@/lib/validators/post"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { communityId, title, content, badgeTitle, badgeColor } =
      PostValidator.parse(body)

    const subscriptionExists = await db.subscribtion.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    })

    if (!subscriptionExists) {
      return new Response("You need to join this community, before posting.", {
        status: 400,
      })
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        communityId,
        badgeTitle,
        badgeColor,
      },
    })

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }

    return new Response("Could not publish a post. Try again later.", {
      status: 500,
    })
  }
}
