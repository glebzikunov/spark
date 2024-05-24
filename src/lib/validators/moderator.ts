import { z } from "zod"

export const ModeratorValidator = z.object({
  userId: z.string(),
  communityName: z.string(),
  communityId: z.string(),
})

export type ModeratorRequest = z.infer<typeof ModeratorValidator>
