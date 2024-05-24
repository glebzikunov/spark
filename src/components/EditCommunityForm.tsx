"use client"

import { useRouter } from "next/navigation"
import CommunityImageForm from "./CommunityImageForm"
import CommunityDescriptionForm from "./CommunityDescriptionForm"
import CommunityBadgesForm from "./CommunityBadgesForm"

interface EditCommunityFormProps {
  id: string
  isModerator: boolean
  communityImage: string | null | undefined
  description: string | null | undefined
  badges: {
    id: string
    color: string
    title: string
    communityId: string
  }[]
}

const EditCommunityForm = ({
  id,
  isModerator,
  communityImage,
  description,
  badges,
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
        <CommunityBadgesForm id={id || ""} badges={badges} />
      </div>
    </div>
  )
}

export default EditCommunityForm
