"use client"

import { useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu"
import { Ellipsis, Loader2, Share2, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { PostDeletionRequest } from "@/lib/validators/post"
import axios from "axios"

interface PostDropdown {
  communityName: string
  authorId: string
  postId: string
}

const PostDropdown = ({ communityName, authorId, postId }: PostDropdown) => {
  const router = useRouter()
  const { data: session } = useSession()

  const { mutate: deletePost, isLoading } = useMutation({
    mutationFn: async ({ postId }: PostDeletionRequest) => {
      const payload: PostDeletionRequest = {
        postId,
      }

      const { data } = await axios.patch(`/api/community/post/delete`, payload)
      return data
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Post wasn't deleted successfully. Try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      router.refresh()
      return toast({
        description: "Post has been successfully deleted.",
      })
    },
  })

  const copyPostUrl = () => {
    navigator.clipboard.writeText(
      window.location.toString() + `c/${communityName}/post/${postId}`
    )
    toast({
      description: "Post link has been added to your clipboard.",
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="dark:bg-[#303030] dark:border-[#ffffff33]"
        align="end"
      >
        <DropdownMenuItem
          className="flex justify-center cursor-pointer"
          onClick={(event) => {
            event.preventDefault()
            copyPostUrl()
          }}
        >
          <Share2 className="h-5 w-5 sm:mr-2" fill="true" />
          <span className="hidden sm:block font-medium">Share</span>
        </DropdownMenuItem>
        {session?.user.id === authorId ? (
          <DropdownMenuItem
            onClick={(event) => {
              event.preventDefault()
              if (!session) router.push("/sign-in")
              deletePost({ postId })
            }}
            className="flex justify-center cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin sm:mr-2" />
                <span className="hidden sm:block">Delete</span>
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:block">Delete</span>
              </>
            )}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PostDropdown