"use client"

import { UsernameRequest, UsernameValidator } from "@/lib/validators/username"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface UserNameFormProps {
  user: Pick<User, "id" | "username">
}

const UserNameForm = ({ user }: UserNameFormProps) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user.username || "",
    },
  })

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = { name }

      const { data } = await axios.patch(`/api/username`, payload)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Username is already taken.",
            description: "Please choose another username.",
            variant: "destructive",
          })
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your username was not updated. Try again later.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      toast({
        description: "Your username has been updated.",
      })
      router.refresh()
    },
  })

  return (
    <form onSubmit={handleSubmit((e) => updateUsername(e))}>
      <Card className="dark:bg-[#262626]">
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a display username you are comfortable with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm">u/</span>
            </div>

            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px] pl-6 bg-[#eaedef] dark:bg-[#303030]"
              size={32}
              {...register("name")}
            />

            {errors?.name && (
              <p className="px-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Change username"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default UserNameForm
