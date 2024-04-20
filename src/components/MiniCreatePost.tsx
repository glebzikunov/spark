"use client"

import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"

const MiniCreatePost = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Button
      onClick={() => router.push(pathname + "/submit")}
      variant="outline"
      className="flex gap-2 rounded-full"
    >
      <Image
        src="/assets/create.svg"
        alt="Create post button"
        width={20}
        height={20}
      />
      Create a post
    </Button>
  )
}

export default MiniCreatePost
