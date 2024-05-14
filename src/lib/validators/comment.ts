import { z } from "zod"

export const CommentValidator = z.object({
  postId: z.string(),
  text: z.string().min(3),
  replyToId: z.string().optional(),
})

export const DeleteCommentValidator = z.object({
  commentId: z.string(),
})

export type CommentRequest = z.infer<typeof CommentValidator>
export type DeleteCommentRequest = z.infer<typeof DeleteCommentValidator>
