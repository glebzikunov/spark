"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { CreateCommunityPayload } from "@/lib/validators/community"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useCustomToast } from "@/hooks/use-custom.toast"
import { UploadDropzone } from "@uploadthing/react"
import { OurFileRouter } from "@/app/api/uploadthing/core"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const Page = () => {
  const [input, setInput] = useState<string>("")
  const [isCommunityPremium, setIsCommunityPremium] = useState<boolean>(false)
  const [communityDescription, setCommunityDescription] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")
  const router = useRouter()
  const { loginToast } = useCustomToast()

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateCommunityPayload = {
        image: imageUrl,
        description: communityDescription,
        name: input,
        isPremium: isCommunityPremium,
      }

      const { data } = await axios.post("/api/community", payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Community already exists.",
            description: "Please choose a different community name.",
            variant: "destructive",
          })
        }

        if (err.response?.status === 422) {
          return toast({
            title: "Invalid community name.",
            description: "Please choose a name between 3 and 21 characters.",
            variant: "destructive",
          })
        }

        if (err.response?.status === 403) {
          return toast({
            title: "Access denied.",
            description: "You are not a spark premium user.",
            variant: "destructive",
          })
        }

        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      toast({
        title: "There was an error.",
        description: "Try again later.",
        variant: "destructive",
      })
    },
    onSuccess: (data) => {
      router.push(`/c/${data}`)
      toast({
        description: "Community created.",
      })
    },
  })

  return (
    <div className=" w-full flex items-center h-full max-w-5xl mx-auto">
      <div className="relative bg-[#eaedef] dark:bg-[#262626] w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Create a community</h1>
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-medium">Image</p>
          <p className="text-xs text-[#576f76] dark:text-[#838383] pb-2">
            Files up to 4MB
          </p>
          {imageUrl.length > 0 ? (
            <Image
              src={imageUrl}
              alt="Community image"
              width={80}
              height={80}
              className="rounded-full aspect-square object-cover self-center"
            />
          ) : (
            <UploadDropzone<OurFileRouter>
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
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs text-[#576f76] dark:text-[#838383] pb-2">
            Choose wisely. Once you pick a name, it can&apos;t be changed.
          </p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-[#576f76] dark:text-[#838383]">
              c/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6 dark:bg-[#303030]"
              placeholder=""
            />
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-medium">Description</p>
          <Textarea
            value={communityDescription}
            onChange={(e) => setCommunityDescription(e.target.value)}
            rows={1}
            placeholder="Community bio"
            className="mt-2 bg-[#f9fafa] dark:bg-[#262626] border border-border dark:border-[#ffffff33]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium">Make Private</p>
          <div className="flex gap-2">
            <input
              type="radio"
              id="free"
              name="subscription"
              value="false"
              checked={!isCommunityPremium}
              onChange={() => setIsCommunityPremium(false)}
            />
            <Label htmlFor="free">Open</Label>
            <input
              type="radio"
              id="private"
              name="subscription"
              value="true"
              checked={isCommunityPremium}
              onChange={() => setIsCommunityPremium(true)}
            />
            <Label htmlFor="private">Private</Label>
          </div>
        </div>
        <div className="flex justify-between xs:justify-end xs:gap-4">
          <Button variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Create your community
              </>
            ) : (
              "Create your community"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page
