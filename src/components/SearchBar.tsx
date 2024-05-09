"use client"

import { useQuery } from "@tanstack/react-query"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import { Community, Prisma } from "@prisma/client"
import { usePathname, useRouter } from "next/navigation"
import { UserCircle2Icon } from "lucide-react"
import debounce from "lodash.debounce"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"
import UserAvatar from "./UserAvatar"

const SearchBar = () => {
  const [input, setInput] = useState<string>("")

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []

      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as (Community & { _count: Prisma.CommunityCountOutputType })[]
    },
    queryKey: ["search-query"],
    enabled: false,
  })

  const request = debounce(async () => {
    refetch()
  }, 400)

  const debounceRequest = useCallback(() => {
    request()
  }, [])

  const router = useRouter()
  const commandRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useOnClickOutside(commandRef, () => {
    setInput("")
  })

  useEffect(() => {
    setInput("")
  }, [pathname])

  return (
    <Command
      ref={commandRef}
      className={`relative rounded-lg ${
        input.length > 0 && `rounded-t-lg rounded-b-none`
      } bg-[#eaedef] dark:bg-[#303030] max-w-lg z-50 overflow-visible`}
    >
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
      />

      {input.length > 0 ? (
        <CommandList className="absolute bg-[#eaedef] dark:bg-[#303030] top-full inset-x-0 shadow rounded-b-lg">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((community) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/c/${e}`)
                    router.refresh()
                  }}
                  key={community.id}
                  value={community.name}
                >
                  {community.image ? (
                    <UserAvatar
                      user={{
                        name: community.name || null,
                        image: community.image || null,
                      }}
                      className="mr-2 h-6 w-6"
                    />
                  ) : (
                    <UserCircle2Icon
                      strokeWidth={0.75}
                      className="mr-2 h-6 w-6 stroke-[#F97316]"
                    />
                  )}

                  <a href={`/c/${community.name}`}>c/{community.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  )
}

export default SearchBar
