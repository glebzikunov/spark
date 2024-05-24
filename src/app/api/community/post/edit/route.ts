import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { EditPostValidator } from "@/lib/validators/post"
import { z } from "zod"

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { postId, content } = EditPostValidator.parse(body)

    const post = await db.post.findFirst({
      where: {
        id: postId,
      },
    })

    await db.post.update({
      where: {
        id: post?.id,
      },
      data: {
        content: content,
      },
    })

    return new Response("OK")
  } catch (error) {
    error

    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 400 })
    }

    return new Response(
      "Could not update post at this time. Try again later.",
      { status: 500 }
    )
  }
}
