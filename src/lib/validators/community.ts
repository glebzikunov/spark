import { z } from "zod"

export const CommunityValidator = z.object({
  image: z.string(),
  description: z.string().max(500),
  name: z.string().min(3).max(21),
})

export const CommunitySubscriptionValidator = z.object({
  communityId: z.string(),
})

export type CreateCommunityPayload = z.infer<typeof CommunityValidator>
export type SubscribeToCommunityPayload = z.infer<
  typeof CommunitySubscriptionValidator
>
