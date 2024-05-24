import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { getAuthSession } from "@/lib/auth"
import ThemeSwitcher from "./ThemeSwitcher"
import DropdownNav from "./DropdownNav"
import SearchBar from "./SearchBar"
import { Gem } from "lucide-react"
import { hasSubscription } from "@/helpers/billing"

const Navbar = async () => {
  const session = await getAuthSession()
  const hasSub = await hasSubscription()

  return (
    <nav className="navbar">
      <Link href="/" className="flex gap-2 items-center">
        <Image
          src="/assets/spark.svg"
          alt="Logo"
          width={34}
          height={34}
        ></Image>
        <p className="hidden text-2xl font-bold md:block">spark</p>
      </Link>
      <SearchBar />
      <div className="flex items-center gap-1">
        {session?.user ? (
          <div className="relative flex gap-3">
            <ThemeSwitcher />
            <DropdownNav
              user={session.user}
              username={session.user.username || ""}
            />
            {hasSub ? (
              <Gem
                strokeWidth={2}
                size={14}
                fill="#38b1e7"
                className="absolute right-0 bottom-0 z-[100] stroke-[#299acc]"
              />
            ) : null}
          </div>
        ) : (
          <div className="flex gap-3">
            <ThemeSwitcher />
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
