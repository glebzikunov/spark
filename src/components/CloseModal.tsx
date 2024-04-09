"use client"

import { X } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

const CloseModal = () => {
  const router = useRouter()

  return (
    <Button
      aria-label="close model"
      variant={"ghost"}
      onClick={() => router.back()}
    >
      <X className="h-4 w-4" />
    </Button>
  )
}

export default CloseModal
