"use client"

import { useRouter } from "next/navigation"
import CommunityImageForm from "./CommunityImageForm"
import CommunityDescriptionForm from "./CommunityDescriptionForm"

interface EditCommunityFormProps {
  id: string
  isModerator: boolean
  communityImage: string | null | undefined
  description: string | null | undefined
}

const EditCommunityForm = ({
  id,
  isModerator,
  communityImage,
  description,
}: EditCommunityFormProps) => {
  const router = useRouter()

  if (isModerator === false) router.push("/")

  return (
    <div className="grid items-start gap-4">
      <div className="grid gap-5">
        <CommunityImageForm id={id || ""} image={communityImage || ""} />
        <CommunityDescriptionForm
          id={id || ""}
          description={description || ""}
        />
      </div>
    </div>
  )
}

export default EditCommunityForm
