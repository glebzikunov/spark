import CustomFeed from "@/components/CustomFeed"
import GeneralFeed from "@/components/GeneralFeed"
import { Button } from "@/components/ui/button"
import { getAuthSession } from "@/lib/auth"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function Home() {
  const session = await getAuthSession()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 pb-6">
        {/* @ts-expect-error Server Component */}
        {session ? <CustomFeed /> : <GeneralFeed />}
        <div className="overflow-hidden h-fit rounded-lg border border-border dark:border-[#ffffff33] order-first md:order-last">
          <div className="bg-[#EAEDEF] dark:bg-[#303030] p-3">
            <p className="font-semibold flex items-center gap-1.5 ">Home</p>
          </div>

          <div className="-my-3 divide-y divide-border px-3 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="">Didn't find your favorite community?</p>
            </div>

            <Button className="w-full mb-3" asChild>
              <Link href="/c/create">Create Community</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
