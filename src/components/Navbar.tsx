import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { getAuthSession } from "@/lib/auth"
import ThemeSwitcher from "./ThemeSwitcher"
import DropdownNav from "./DropdownNav"
import SearchBar from "./SearchBar"

const Navbar = async () => {
  const session = await getAuthSession()

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
          <div className="flex gap-3">
            <ThemeSwitcher />
            <DropdownNav user={session.user} />
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
