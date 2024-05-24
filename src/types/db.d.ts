import type { Comment, Community, Post, User, Vote } from "@prisma/client"

export type ExtendedPost = Post & {
  community: Community
  votes: Vote[]
  author: User
  comments: Comment[]
  isPremium?: boolean | null
}
