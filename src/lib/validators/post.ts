import { z } from "zod"

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(300, { message: "Title must be less then 300 characters" }),
  communityId: z.string(),
  content: z.any(),
  badgeTitle: z.string().optional(),
  badgeColor: z.string().optional(),
})

export const EditPostValidator = z.object({
  postId: z.string(),
  content: z.any(),
})

export const DeletePostValidator = z.object({
  postId: z.string(),
})

export const BookmarkPostValidator = z.object({
  postId: z.string(),
})

export type PostCreationRequest = z.infer<typeof PostValidator>
export type PostEditingRequest = z.infer<typeof EditPostValidator>
export type PostDeletionRequest = z.infer<typeof DeletePostValidator>
export type BookmarkPostRequest = z.infer<typeof BookmarkPostValidator>
