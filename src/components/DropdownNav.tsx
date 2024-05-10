"use client"

import { User } from "next-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu"
import UserAvatar from "./UserAvatar"
import Link from "next/link"
import { signOut } from "next-auth/react"

interface DropdownNavProps {
  user: Pick<User, "name" | "image" | "email">
  username: string
}

const DropdownNav = ({ user, username }: DropdownNavProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="dark:bg-[#303030] dark:border-[#ffffff33]"
        align="end"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm">{user.email}</p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator className="dark:bg-[#ffffff33]" />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/u/${username}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/">Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/c/create">Create community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`,
            })
          }}
          className="cursor-pointer"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownNav
