"use client"

import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { Plus } from "lucide-react"

const MiniCreatePost = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Button
      onClick={() => router.push(pathname + "/submit")}
      variant="outline"
      className="flex gap-2 rounded-full dark:bg-[#1f1f1f] dark:border-[#313131] dark:hover:bg-[#303030]"
    >
      <Plus strokeWidth={1} />
      Create a post
    </Button>
  )
}

export default MiniCreatePost
