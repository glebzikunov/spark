import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { DeleteCommentValidator } from "@/lib/validators/comment"
import { z } from "zod"

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { commentId } = DeleteCommentValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const commentToDelete = await db.comment.findFirst({
      where: { id: commentId },
      include: {
        replies: true,
      },
    })

    const remainingComments = await db.comment.findMany({
      where: {
        postId: commentToDelete?.postId,
        id: { not: commentToDelete?.id },
      },
    })

    for (const remainingComment of remainingComments) {
      if (remainingComment.replyToId === commentToDelete?.id) {
        await db.comment.update({
          where: { id: remainingComment.id },
          data: {
            replyToId: null,
          },
        })
      }
      if (remainingComment.id === commentToDelete?.replyToId) {
        await db.comment.update({
          where: { id: remainingComment.id },
          data: {
            replyToId: null,
          },
        })
      }
    }

    await db.comment.delete({
      where: { id: commentId },
    })

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      "Could not delete comment at this time. Try again later.",
      {
        status: 500,
      }
    )
  }
}
