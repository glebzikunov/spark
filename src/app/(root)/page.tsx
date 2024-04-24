import CustomFeed from "@/components/CustomFeed"
import GeneralFeed from "@/components/GeneralFeed"
import { getAuthSession } from "@/lib/auth"

export default async function Home() {
  const session = await getAuthSession()

  return (
    <>
      {/* TABS 
        Hot (best in every community by votes for the last 24hr)
        Top (best for all time by votes)
        New (all for the last time)
      */}
      <div className="grid grid-cols-1 pb-6">
        {/* @ts-expect-error Server Component */}
        {session ? <CustomFeed /> : <GeneralFeed />}
      </div>
    </>
  )
}
