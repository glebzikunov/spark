"use client"

import { Button } from "./ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCustomToast } from "@/hooks/use-custom.toast"
import { useMutation } from "@tanstack/react-query"
import { CommunityBadgePayload } from "@/lib/validators/community"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"

interface BadgeProps {
  badgeId: string
  badgeColor: string
  badgeTitle: string
}

const Badge = ({ badgeId, badgeColor, badgeTitle }: BadgeProps) => {
  const router = useRouter()
  const { loginToast } = useCustomToast()

  const { mutate: deleteCommunityBadge, isLoading: isDeleting } = useMutation({
    mutationFn: async ({ id, title, color }: CommunityBadgePayload) => {
      const payload: CommunityBadgePayload = { id, title, color }

      const { data } = await axios.patch(`/api/community/badge/delete`, payload)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Community badge wasn't deleted. Try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      toast({
        description: "Badge has been deleted.",
      })
      router.refresh()
    },
  })

  return (
    <div className="flex items-center w-full justify-between">
      <p
        style={{ backgroundColor: badgeColor }}
        className="text-sm px-2 h-fit text-white rounded-full"
      >
        {badgeTitle}
      </p>
      <Button
        onClick={() =>
          deleteCommunityBadge({
            id: badgeId,
            title: badgeTitle,
            color: badgeColor,
          })
        }
        variant="ghost"
        size="sm"
        className="rounded-full"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2
            fill="true"
            className="h-5 w-5 fill-transparent stroke-[#F97316]"
          />
        )}
      </Button>
    </div>
  )
}

export default Badge
