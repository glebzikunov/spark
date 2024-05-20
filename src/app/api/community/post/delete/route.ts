import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { DeletePostValidator } from "@/lib/validators/post"
import { z } from "zod"

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { postId } = DeletePostValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const post = await db.post.findFirst({
      where: {
        id: postId,
      },
    })

    if (post?.authorId === session.user.id) {
      await db.post.delete({
        where: {
          id: postId,
        },
      })
    } else {
      return new Response("Access denied. You are not post author.", {
        status: 403,
      })
    }

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }

    return new Response("Could not delete your post. Try again later.", {
      status: 500,
    })
  }
}
