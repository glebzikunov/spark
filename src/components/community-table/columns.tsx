"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import Link from "next/link"
import CreateModerator from "../CreateModerator"
import DeleteModerator from "../DeleteModerator"

export type Moderator = {
  id: string
  username: string | null
  communityId: string
  communityName: string
}

export const columns: ColumnDef<Moderator>[] = [
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="dark:bg-[#303030] dark:border-[#ffffff33]"
            align="end"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">
              <CreateModerator
                userId={user.id}
                communityName={user.communityName}
                communityId={user.communityId}
              />
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <DeleteModerator
                userId={user.id}
                communityName={user.communityName}
                communityId={user.communityId}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-[#ffffff33]" />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/u/${user.username}`}>View profile</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    accessorKey: "username",
    header: "Username",
  },
]
