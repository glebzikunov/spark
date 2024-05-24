import { z } from "zod"

export const UserImageValidator = z.object({
  image: z.string(),
})

export const UsernameValidator = z.object({
  name: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/),
})

export type UsernameRequest = z.infer<typeof UsernameValidator>
export type UserImageRequest = z.infer<typeof UserImageValidator>
