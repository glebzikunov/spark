"use client"

import { useMutation } from "@tanstack/react-query"
import { Button } from "./ui/button"
import { SubscribeToCommunityPayload } from "@/lib/validators/community"
import axios, { AxiosError } from "axios"
import { useCustomToast } from "@/hooks/use-custom.toast"
import { toast } from "@/hooks/use-toast"
import { startTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface SubscribeLeaveToggleProps {
  communityId: string
  communityName: string
  isSubscribed: boolean
}

const SubscribeLeaveToggle = ({
  communityId,
  communityName,
  isSubscribed,
}: SubscribeLeaveToggleProps) => {
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { mutate: subscribe, isLoading: isSubloading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToCommunityPayload = {
        communityId,
      }

      const data = await axios.post("/api/community/subscribe", payload)
      //@ts-ignore
      return data as string
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: "There was an error.",
        description: "Something went wrong, try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: "Joined",
        description: `You have been successfully subscribed to c/${communityName}`,
      })
    },
  })

  const { mutate: unsubscribe, isLoading: isUnSubloading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToCommunityPayload = {
        communityId,
      }

      const data = await axios.post("/api/community/unsubscribe", payload)
      //@ts-ignore
      return data as string
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: "There was an error.",
        description: "Something went wrong, try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: "Unsubscribed",
        description: `You have been successfully unsubscribed from c/${communityName}`,
      })
    },
  })

  return isSubscribed ? (
    <Button
      onClick={() => unsubscribe()}
      className="rounded-full dark:bg-[#1f1f1f] dark:border-[#ffffff33] dark:hover:bg-[#303030]"
      variant="outline"
    >
      {isUnSubloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
        </>
      ) : (
        "Joined"
      )}
    </Button>
  ) : (
    <Button onClick={() => subscribe()} className="rounded-full">
      {isSubloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
        </>
      ) : (
        "Join"
      )}
    </Button>
  )
}

export default SubscribeLeaveToggle
