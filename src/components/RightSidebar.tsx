"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"

const RightSidebar = () => {
  const pathname = usePathname()
  return (
    <section
      className={`${
        pathname.includes("/c/") && `hidden`
      } custom-scrollbar rightsidebar`}
    >
      <div className="flex flex-1 flex-col justify-start pr-6">
        <div className="flex flex-col gap-10">
          <div className="overflow-hidden h-fit rounded-lg border border-border">
            <div className="bg-[#EAEDEF] p-3 text-primary-foreground">
              <p className="text-[#0C0A09] font-semibold  flex items-center gap-1.5">
                Home
              </p>
            </div>

            <div className="-my-3 divide-y divide-border px-3 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-[#0C0A09]">
                  Didn't find your favorite community?
                </p>
              </div>

              <Button className="w-full mb-3" asChild>
                <Link href="/c/create">Create Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RightSidebar
