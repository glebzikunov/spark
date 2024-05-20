import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2024-04-10",
})

export async function hasSubscription() {
  const session = await getAuthSession()

  if (session) {
    const user = await db.user.findFirst({
      where: { email: session.user?.email },
    })

    const subscriptions = await stripe.subscriptions.list({
      customer: String(user?.stripe_customer_id),
    })

    return subscriptions.data.length > 0
  }

  return false
}

export async function createCheckoutLink(customer: string) {
  const checkout = await stripe.checkout.sessions.create({
    success_url: "http://localhost:3000/premium",
    cancel_url: "http://localhost:3000/premium",
    customer: customer,
    line_items: [
      {
        price: "price_1PIbdDEMtqslRwu07p2j0AG6",
        quantity: 1,
      },
    ],
    mode: "subscription",
  })

  return checkout.url
}

export async function generateCustomerPortalLink(customerId: string) {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.NEXTAUTH_URL + "/premium",
    })

    console.log()

    return portalSession.url
  } catch (error) {
    console.log(error)
    return undefined
  }
}

export async function createCustomerIfNull() {
  const session = await getAuthSession()

  if (session) {
    const user = await db.user.findFirst({
      where: { email: session.user?.email },
    })

    if (!user?.stripe_customer_id) {
      const customer = await stripe.customers.create({
        email: String(user?.email),
      })

      await db.user.update({
        where: {
          id: user?.id,
        },
        data: {
          stripe_customer_id: customer.id,
        },
      })
    }
    const user2 = await db.user.findFirst({
      where: { email: session.user?.email },
    })
    return user2?.stripe_customer_id
  }
}
