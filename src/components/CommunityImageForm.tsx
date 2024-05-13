"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Loader2, UserCircle2Icon } from "lucide-react"
import { Button } from "./ui/button"
import { UploadButton } from "@uploadthing/react"
import { OurFileRouter } from "@/app/api/uploadthing/core"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { CommunityImagePayload } from "@/lib/validators/community"
import { useMutation } from "@tanstack/react-query"
import { useCustomToast } from "@/hooks/use-custom.toast"

interface CommunityImageFormProps {
  id: string
  image: string | ""
}

const CommunityImageForm = ({ id, image }: CommunityImageFormProps) => {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string>(image)
  const { loginToast } = useCustomToast()

  const { mutate: updateCommunityImage, isLoading } = useMutation({
    mutationFn: async ({ image, id }: CommunityImagePayload) => {
      const payload: CommunityImagePayload = { image, id }

      const { data } = await axios.patch(`/api/community/edit/image`, payload)
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
        description: "Community image wasn't updated. Try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      toast({
        description: "Community image has been updated.",
      })
      router.refresh()
    },
  })

  return (
    <Card className="dark:bg-[#262626] dark:border-[#ffffff33]">
      <CardHeader>
        <CardTitle>Community image</CardTitle>
        <CardDescription>Please choose file up to 4MB.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative grid gap-1">
          {
            // @ts-ignore
            imageUrl?.length > 0 ? (
              <Image
                width={80}
                height={80}
                className="rounded-full aspect-square object-cover self-center"
                alt="Community image"
                src={imageUrl || ""}
              />
            ) : (
              <UserCircle2Icon
                strokeWidth={0.75}
                className="h-20 w-20 stroke-[#F97316]"
              />
            )
          }
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 items-start">
        <Button onClick={() => updateCommunityImage({ image: imageUrl, id })}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Change image"
          )}
        </Button>
        <UploadButton<OurFileRouter>
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // @ts-ignore
            setImageUrl(res[0].fileUrl)
          }}
          onUploadError={(error: Error) => {
            toast({
              title: "There was an error uploading a photo.",
              description: `Error: ${error.message}`,
              variant: "destructive",
            })
          }}
        />
      </CardFooter>
    </Card>
  )
}

export default CommunityImageForm
