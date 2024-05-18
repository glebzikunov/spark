import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { BookmarkPostValidator } from "@/lib/validators/post"
import { z } from "zod"

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { postId } = BookmarkPostValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    await db.bookmark.delete({
      where: {
        userId_postId: {
          postId,
          userId: session.user.id,
        },
      },
    })

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }

    return new Response("Could not remove your bookmark. Try again later.", {
      status: 500,
    })
  }
}
