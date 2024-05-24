import { User } from "next-auth"
import { Avatar, AvatarFallback } from "./ui/avatar"
import Image from "next/image"
import { AvatarProps } from "@radix-ui/react-avatar"
import { UserCircle2Icon } from "lucide-react"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">
}

const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            alt="Avatar"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <UserCircle2Icon
            strokeWidth={0.5}
            className="h-4 w-4 stroke-[#F97316]"
          />
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default UserAvatar
