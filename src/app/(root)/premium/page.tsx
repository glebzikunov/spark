import { Button } from "@/components/ui/button"
import {
  createCheckoutLink,
  createCustomerIfNull,
  generateCustomerPortalLink,
  hasSubscription,
} from "@/helpers/billing"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Gem } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Stripe from "stripe"

export const metadata = {
  title: "Spark Premium",
  description: "Manage your account premium subscription.",
}

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2024-04-10",
})

const page = async () => {
  const session = await getAuthSession()
  const user = await db.user.findFirst({ where: { id: session?.user.id } })

  await createCustomerIfNull()

  const manage_link = await generateCustomerPortalLink(
    "" + user?.stripe_customer_id
  )

  const hasSub = await hasSubscription()

  const checkout_link = await createCheckoutLink("" + user?.stripe_customer_id)

  return (
    <>
      {hasSub ? (
        <div className="flex flex-col gap-5">
          <h1 className="text-center font-bold text-2xl md:text-3xl">
            You are a premium user 🎉
          </h1>
          <div className="flex items-center justify-center">
            <Button variant="secondary" className="w-[250px]" asChild>
              <Link href={"" + manage_link}>Manage subscription</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <h1 className="text-center font-bold text-2xl md:text-3xl">
            Join Spark Premium Today
          </h1>
          <div className="flex max-md:flex-col justify-between gap-4">
            <div className="flex flex-col items-center justify-center gap-2.5 bg-[#f9fafa] dark:bg-[#262626] border border-border dark:border-[#ffffff33] rounded-[16px] p-5">
              <Image
                src="/assets/ad-free.svg"
                alt="Add free icon"
                width={68}
                height={68}
              />
              <h3 className="text-sm font-semibold">Ad-free Browsing</h3>
              <p className="text-[#576F76] dark:text-[#838383] text-[12px] text-center">
                Enjoy sparkling without interruptions from ads
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2.5 bg-[#f9fafa] dark:bg-[#262626] border border-border dark:border-[#ffffff33] rounded-[16px] p-5">
              <Image
                src="/assets/members-lounge.svg"
                alt="Add free icon"
                width={68}
                height={68}
              />
              <h3 className="text-sm font-semibold">Members Lounge</h3>
              <p className="text-[#576F76] dark:text-[#838383] text-[12px] text-center">
                Discover all the illuminati secrets in your private lounge
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2.5 bg-[#f9fafa] dark:bg-[#262626] border border-border dark:border-[#ffffff33] rounded-[16px] p-5">
              <Gem strokeWidth={1} size={68} className="stroke-[#38b1e7]" />
              <h3 className="text-sm font-semibold">Avatar Badge</h3>
              <p className="text-[#576F76] dark:text-[#838383] text-[12px] text-center">
                Outfit your avatar with the best looking badge
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Button variant="secondary" className="w-[250px]" asChild>
              <Link href={"" + checkout_link}>Upgrade for $5/Month</Link>
            </Button>
          </div>
          <p className="text-center text-[12px] text-[#576F76] dark:text-[#838383]">
            *Subscriptions automatically renew
          </p>
        </div>
      )}
    </>
  )
}

export default page
