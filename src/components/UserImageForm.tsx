"use client"

import { UserImageRequest } from "@/lib/validators/user"
import { User } from "@prisma/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Button } from "./ui/button"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { UploadButton } from "@uploadthing/react"
import { OurFileRouter } from "@/app/api/uploadthing/core"

interface UserImageFormProps {
  user: Pick<User, "id" | "image">
}

const UserImageForm = ({ user }: UserImageFormProps) => {
  const router = useRouter()
  const [image, setImage] = useState<string>(user.image || "")

  const { mutate: updateUserImage, isLoading } = useMutation({
    mutationFn: async ({ image }: UserImageRequest) => {
      const payload: UserImageRequest = { image }

      const { data } = await axios.patch(`/api/settings/image`, payload)
      return data
    },
    onError: () => {
      return toast({
        title: "Something went wrong.",
        description: "Your image wasn't updated. Try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      toast({
        description: "Your image has been updated.",
      })
      router.refresh()
    },
  })

  return (
    <Card className="dark:bg-[#262626] dark:border-[#ffffff33]">
      <CardHeader>
        <CardTitle>Your image</CardTitle>
        <CardDescription>Please choose file up to 4MB.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative grid gap-1">
          <Image
            width={80}
            height={80}
            className="rounded-full aspect-square object-cover self-center"
            alt="User image"
            src={image || ""}
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 items-start">
        <Button onClick={() => updateUserImage({ image })}>
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
            setImage(res[0].fileUrl)
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

export default UserImageForm
