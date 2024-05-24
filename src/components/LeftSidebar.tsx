"use client"

import { sidebarLinks } from "@/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Leftsidebar = () => {
  const pathname = usePathname()

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-1 px-6">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.route

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar-link transition-colors hover:bg-[#eaedef] dark:hover:bg-[#303030] ${
                isActive && `bg-[#eaedef] dark:bg-[#303030]`
              }`}
            >
              {link.icon}
              <p className="text-sm max-lg:hidden">{link.label}</p>
            </Link>
          )
        })}
      </div>
      <div className="px-6">
        <p className="text-[10px] p-4 max-lg:hidden dark:text-[#838383]">
          Spark, Inc. © 2024. All rights reserved.
        </p>
      </div>
    </section>
  )
}

export default Leftsidebar
