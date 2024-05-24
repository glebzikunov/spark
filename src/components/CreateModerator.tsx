"use client"

import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import { ModeratorRequest } from "@/lib/validators/moderator"
import { useCustomToast } from "@/hooks/use-custom.toast"

interface CreateModeratorProps {
  communityName: string
  communityId: string
  userId: string
}
const CreateModerator = ({
  communityId,
  userId,
  communityName,
}: CreateModeratorProps) => {
  const router = useRouter()
  const { loginToast } = useCustomToast()

  const { mutate: createModerator } = useMutation({
    mutationFn: async ({
      userId,
      communityId,
      communityName,
    }: ModeratorRequest) => {
      const payload: ModeratorRequest = {
        userId,
        communityId,
        communityName,
      }

      const { data } = await axios.patch(
        `/api/community/edit/moderator/create`,
        payload
      )
      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast()
        }

        if (error.response?.status === 409) {
          return toast({
            title: "Error.",
            description: "This user is a community creator.",
            variant: "destructive",
          })
        }
      }

      return toast({
        title: "Something went wrong",
        description: "User role wasn't updated successfully. Try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      router.refresh()
      toast({
        description: "Role changed to moderator.",
      })
    },
  })

  return (
    <Button
      onClick={() => {
        createModerator({ communityId, userId, communityName })
      }}
      variant="ghost"
      className="font-normal p-0 h-fit"
    >
      <span className="hidden sm:block">Change role to moderator</span>
    </Button>
  )
}

export default CreateModerator
