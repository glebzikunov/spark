import { string, z } from "zod"

export const CommunityValidator = z.object({
  image: z.string(),
  description: z.string().max(500),
  name: z.string().min(3).max(21),
  isPremium: z.boolean().optional(),
})

export const CommunityImageValidator = z.object({
  id: z.string(),
  image: z.string(),
})

export const CommunityDescriptionValidator = z.object({
  id: z.string(),
  description: z.string().max(500),
})

export const CommunityBadgeValidator = z.object({
  id: z.string(),
  title: z.string().max(21),
  color: z.string(),
})

export const CommunitySubscriptionValidator = z.object({
  communityId: z.string(),
})

export type CreateCommunityPayload = z.infer<typeof CommunityValidator>
export type CommunityImagePayload = z.infer<typeof CommunityImageValidator>
export type CommunityDescriptionPayload = z.infer<
  typeof CommunityDescriptionValidator
>
export type CommunityBadgePayload = z.infer<typeof CommunityBadgeValidator>
export type SubscribeToCommunityPayload = z.infer<
  typeof CommunitySubscriptionValidator
>
