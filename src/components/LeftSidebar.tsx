"use client"

import { sidebarLinks } from "@/constants"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

const Leftsidebar = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-1 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar-link transition-colors hover:bg-[#eaedef] ${
                isActive && `bg-[#eaedef]`
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
              />
              <p className="text-sm max-lg:hidden">{link.label}</p>
            </Link>
          )
        })}
      </div>
      <div className="px-6">
        <p className="text-[10px] p-4 max-lg:hidden">
          Spark, Inc. © 2024. All rights reserved.
        </p>
      </div>
    </section>
  )
}

export default Leftsidebar
