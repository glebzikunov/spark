"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { CommunityBadgePayload } from "@/lib/validators/community"
import axios, { AxiosError } from "axios"
import { useCustomToast } from "@/hooks/use-custom.toast"
import { Input } from "./ui/input"
import { HexColorPicker } from "react-colorful"
import Badge from "./Badge"

interface CommunityBadgesFormProps {
  id: string
  badges: {
    id: string
    color: string
    title: string
    communityId: string
  }[]
}

const CommunityBadgesForm = ({ id, badges }: CommunityBadgesFormProps) => {
  const router = useRouter()
  const [badgeTitle, setBadgeTitle] = useState<string>("")
  const [badgeColor, setBadgeColor] = useState<string>("#000000")
  const { loginToast } = useCustomToast()

  const { mutate: createCommunityBadge, isLoading } = useMutation({
    mutationFn: async ({ id, title, color }: CommunityBadgePayload) => {
      const payload: CommunityBadgePayload = { id, title, color }

      const { data } = await axios.post(`/api/community/badge/create`, payload)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }

        if (err.response?.status === 400) {
          return toast({
            title: "Oops...",
            description: "You are already have this badge.",
            variant: "destructive",
          })
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Community badge wasn't created. Try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      toast({
        description: "Badge has been created.",
      })
      router.refresh()
    },
  })

  return (
    <Card className="dark:bg-[#262626] dark:border-[#ffffff33]">
      <CardHeader>
        <CardTitle>Community badges</CardTitle>
        <CardDescription>
          Custom badges for your community posts.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <HexColorPicker color={badgeColor} onChange={setBadgeColor} />
        <div className="flex gap-2">
          <Input
            value={badgeTitle}
            onChange={(e) => setBadgeTitle(e.target.value)}
            placeholder="Badge title..."
            className="border border-border dark:border-[#ffffff33] bg-[#eaedef] dark:bg-[#303030] max-w-sm"
          />
          <Button
            disabled={badgeTitle.length === 0}
            onClick={() => {
              createCommunityBadge({ id, title: badgeTitle, color: badgeColor })
              setBadgeTitle("")
            }}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex items-start flex-col gap-2">
        {badges.length === 0 ? (
          <p className="text-[14px] text-[#576f76] dark:text-[#838383]">
            You didn&apos;t create any badge.
          </p>
        ) : (
          <>
            {badges.map((badge) => (
              <Badge
                key={badge.id}
                badgeId={badge.id}
                badgeTitle={badge.title}
                badgeColor={badge.color}
              />
            ))}
          </>
        )}
      </CardFooter>
    </Card>
  )
}

export default CommunityBadgesForm
