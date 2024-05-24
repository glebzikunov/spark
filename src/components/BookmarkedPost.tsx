"use client"

import { formatTimeToNow } from "@/lib/utils"
import EditorOutput from "./EditorOutput"
import UserAvatar from "./UserAvatar"
import { BookmarkPostRequest } from "@/lib/validators/post"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Bookmark, Loader2 } from "lucide-react"

interface BookmarkedPostProps {
  authorUsername: string | null
  authorImage: string | null
  postId: string
  postDatetime: Date
  postTitle: string
  postContent: any
  communityName: string
}

const BookmarkedPost = ({
  authorUsername,
  authorImage,
  postId,
  postDatetime,
  postTitle,
  postContent,
  communityName,
}: BookmarkedPostProps) => {
  const router = useRouter()

  const { mutate: removeBookmark, isLoading } = useMutation({
    mutationFn: async ({ postId }: BookmarkPostRequest) => {
      const payload: BookmarkPostRequest = {
        postId,
      }

      const { data } = await axios.patch(
        `/api/community/post/bookmark/remove`,
        payload
      )
      return data
    },
    onSuccess: () => {
      router.refresh()
      return toast({
        description: "Bookmark has been successfully removed.",
      })
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Bookmark wasn't removed successfully. Try again later.",
        variant: "destructive",
      })
    },
  })

  return (
    <div className="rounded-lg border border-border dark:border-[#ffffff33] shadow transition-colors hover:bg-[#f9fafa] dark:hover:bg-[#262626]">
      <div className="px-4 py-4 sm:px-6 sm:py-6 flex">
        <div className="w-0 flex-1">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <UserAvatar
                user={{
                  name: authorUsername || null,
                  image: authorImage || null,
                }}
                className="h-7 w-7"
              />
              <div className="flex items-center max-h-40 text-xs">
                <div className="flex flex-col">
                  <a
                    className="text-[#2A3C42] dark:text-[#5A5A5A] font-bold hover:underline hover:underline-offset-2"
                    href={`/c/${communityName}`}
                  >
                    c/{communityName}
                  </a>
                  <a
                    href={`/u/${authorUsername}`}
                    className="font-bold text-[#2A3C42] dark:text-[#838383] hover:underline underline-offset-2"
                  >
                    u/{authorUsername}
                  </a>
                </div>
                <span className="text-[#F97316] font-bold px-2">●</span>
                <span className="font-medium text-[#576F76] dark:text-[#838383]">
                  {formatTimeToNow(new Date(postDatetime))}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeBookmark({ postId })}
              className="rounded-full hover:bg-[#1F1F1F]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Bookmark
                  fill="true"
                  className="h-5 w-5 fill-[#F97316] stroke-[#F97316]"
                />
              )}
            </Button>
          </div>
          <a href={`/c/${communityName}/post/${postId}`}>
            <h1 className="text-xl font-semibold pt-4 pb-[11px] leading-6">
              {postTitle}
            </h1>
          </a>
          <EditorOutput content={postContent} />
        </div>
      </div>
    </div>
  )
}

export default BookmarkedPost
