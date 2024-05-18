import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { BookmarkPostValidator } from "@/lib/validators/post"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { postId } = BookmarkPostValidator.parse(body)

    const bookmarkExists = await db.bookmark.findFirst({
      where: {
        postId,
        userId: session.user.id,
      },
    })

    if (bookmarkExists) {
      return new Response("Post is already saved.", { status: 400 })
    }

    await db.bookmark.create({
      data: {
        postId,
        userId: session.user.id,
      },
    })

    return new Response(postId)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }

    return new Response("Could not save to bookmark. Try again later.", {
      status: 500,
    })
  }
}
