import { hasSubscription } from "@/helpers/billing"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentValidator } from "@/lib/validators/comment"
import { z } from "zod"

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { postId, text, replyToId } = CommentValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const hasSub = await hasSubscription()
    const post = await db.post.findFirst({
      where: {
        id: postId,
      },
    })

    if (post?.isPremium && !hasSub) {
      return new Response("Access denied. You are not a spark premium user.", {
        status: 403,
      })
    } else {
      await db.comment.create({
        data: {
          text,
          postId,
          authorId: session.user.id,
          replyToId,
        },
      })
    }

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response("Could not comment at this time. Try again later.", {
      status: 500,
    })
  }
}
