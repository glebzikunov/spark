import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"

const Navbar = () => {
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
      <div className="flex items-center gap-1">
        {/* Search bar */}
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
