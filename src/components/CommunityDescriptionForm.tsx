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
import { Textarea } from "./ui/textarea"
import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { CommunityDescriptionPayload } from "@/lib/validators/community"
import axios, { AxiosError } from "axios"
import { useCustomToast } from "@/hooks/use-custom.toast"

interface CommunityDescriptionFormProps {
  id: string
  description: string | ""
}

const CommunityDescriptionForm = ({
  id,
  description,
}: CommunityDescriptionFormProps) => {
  const router = useRouter()
  const [communityDescription, setCommunityDescription] =
    useState<string>(description)
  const { loginToast } = useCustomToast()

  const { mutate: updateCommunityDescription, isLoading } = useMutation({
    mutationFn: async ({ description, id }: CommunityDescriptionPayload) => {
      const payload: CommunityDescriptionPayload = { description, id }

      const { data } = await axios.patch(
        `/api/community/edit/description`,
        payload
      )
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }

        if (err.response?.status === 403) {
          router.push("/")
          toast({
            title: "Access denied.",
            description: "You are not moderator of this community.",
            variant: "destructive",
          })
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Community description wasn't updated. Try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      toast({
        description: "Community description has been updated.",
      })
      router.refresh()
    },
  })

  return (
    <Card className="dark:bg-[#262626] dark:border-[#ffffff33]">
      <CardHeader>
        <CardTitle>Community description</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          id="description"
          // @ts-ignore
          value={communityDescription}
          onChange={(e) => setCommunityDescription(e.target.value)}
          rows={1}
          placeholder="Community bio"
          className="mt-2 bg-[#f9fafa] dark:bg-[#262626] border border-border dark:border-[#ffffff33]"
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={() =>
            updateCommunityDescription({
              description: communityDescription,
              id,
            })
          }
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Change description"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CommunityDescriptionForm
