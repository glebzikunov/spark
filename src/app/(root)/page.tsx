import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <>
      {/* TABS 
        Hot (best in every community by votes for the last 24hr)
        Top (best for all time by votes)
        New (all for the last time)

        Create (post or community)
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x4 py-6">
        {/* feed */}

        {/* community info */}
        <div className="overflow-hidden h-fit rounded-lg border border-border order-first md:order-last">
          <div className="bg-[#EAEDEF] px-6 py-4 text-primary-foreground">
            <p className="text-[#0C0A09] font-semibold py-3 flex items-center gap-1.5">
              Home
            </p>
          </div>

          <div className="-my-3 divide-y divide-border px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-[#0C0A09]">
                Didn't find your favorite community?
              </p>
            </div>

            <Button className="w-full mt-4 mb-4" asChild>
              <Link href="/c/create">Create Community</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
