import SignUp from "@/components/SignUp"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const page = () => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <Button className="self-start -mt-20" variant={"link"} asChild>
          <Link href="/">Home</Link>
        </Button>

        <SignUp />
      </div>
    </div>
  )
}

export default page
