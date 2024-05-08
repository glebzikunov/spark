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

const Page = () => {
  const [input, setInput] = useState<string>("")
  const router = useRouter()
  const { loginToast } = useCustomToast()

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateCommunityPayload = {
        name: input,
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
    },
  })

  return (
    <div className=" w-full flex items-center h-full max-w-5xl mx-auto">
      <div className="relative bg-[#eaedef] dark:bg-[#262626] w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>
        <hr className="bg-[#303030] dark:bg-[#ffffff33] h-[2px]" />
        <div className="flex flex-col">
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs text-[#576f76] dark:text-[#838383] pb-2">
            Choose wisely. Once you pick a name, it can't be changed.
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
        <div className="flex justify-end gap-4">
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
