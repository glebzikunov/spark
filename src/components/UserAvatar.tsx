import { User } from "next-auth"
import { Avatar, AvatarFallback } from "./ui/avatar"
import Image from "next/image"
import { AvatarProps } from "@radix-ui/react-avatar"

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
            alt="Profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <Image
            className="h-4 w-4"
            src="/assets/user.svg"
            alt="Profile picture"
          />
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default UserAvatar
