"use client"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useState } from "react"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const AuthForm = ({ className, ...props }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const loginWithGoogle = async () => {
    setIsLoading(true)

    try {
      await signIn("google")
    } catch (error) {
      toast({
        title: "Error!",
        description: "There was an error logging with Google",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button onClick={loginWithGoogle} size="sm" className="w-full mt-6">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Image
            className="mr-2"
            src="/assets/google.svg"
            alt="Logo"
            width={24}
            height={24}
          ></Image>
        )}
        Google
      </Button>
    </div>
  )
}

export default AuthForm
