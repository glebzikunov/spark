import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import PostComment from "./PostComment"
import CreateComment from "./CreateComment"

interface CommentsSectionProps {
  postId: string
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession()

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      author: true,
      likes: true,
      replies: {
        include: {
          author: true,
          likes: true,
        },
      },
    },
  })

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmount = topLevelComment.likes.reduce(
              (acc, vote) => {
                if (vote.type === "LIKE") return acc + 1
                if (vote.type === "DISLIKE") return acc - 1

                return acc
              },
              0
            )

            const topLevelCommentVote = topLevelComment.likes.find(
              (like) => like.userId === session?.user.id
            )

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    /* @ts-ignore */
                    comment={topLevelComment}
                    postId={postId}
                    currentVote={topLevelCommentVote}
                    votesAmount={topLevelCommentVotesAmount}
                  />
                </div>

                {topLevelComment.replies.map((reply) => {
                  const replyVotesAmount = reply.likes.reduce((acc, vote) => {
                    if (vote.type === "LIKE") return acc + 1
                    if (vote.type === "DISLIKE") return acc - 1

                    return acc
                  }, 0)

                  const replyVote = reply.likes.find(
                    (like) => like.userId === session?.user.id
                  )

                  return (
                    <div
                      key={reply.id}
                      className="ml-3 py-2 pl-4 border-l-2 border-border dark:border-[#ffffff33]"
                    >
                      <PostComment
                        /* @ts-ignore */
                        comment={reply}
                        currentVote={replyVote}
                        votesAmount={replyVotesAmount}
                        postId={postId}
                      />
                    </div>
                  )
                })}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default CommentsSection
