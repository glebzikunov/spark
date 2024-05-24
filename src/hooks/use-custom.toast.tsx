import { Button } from "@/components/ui/button"
import { toast } from "./use-toast"
import Link from "next/link"

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required.",
      description: "You must be logged in.",
      variant: "destructive",
      action: (
        <Button variant="secondary" onClick={() => dismiss()} asChild>
          <Link href="/sign-in">Login</Link>
        </Button>
      ),
    })
  }

  return { loginToast }
}
