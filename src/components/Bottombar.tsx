"use client"

import { sidebarLinks } from "@/constants"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

function Bottombar() {
  const pathname = usePathname()

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link transition-colors hover:bg-[#eaedef] dark:hover:bg-[#303030] ${
                isActive && `bg-[#eaedef] dark:bg-[#303030]`
              }`}
            >
              {link.icon}
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default Bottombar
