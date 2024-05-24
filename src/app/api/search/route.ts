import { hasSubscription } from "@/helpers/billing"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get("q")

  if (!q) return new Response("Invalid query", { status: 400 })

  const session = await getAuthSession()
  const hasSub = await hasSubscription()

  if (session && hasSub) {
    const results = await db.community.findMany({
      where: {
        name: {
          startsWith: q,
        },
      },
      include: {
        _count: true,
      },
      take: 5,
    })

    return new Response(JSON.stringify(results))
  }

  const results = await db.community.findMany({
    where: {
      name: {
        startsWith: q,
      },
      isPremium: false,
    },
    include: {
      _count: true,
    },
    take: 5,
  })

  return new Response(JSON.stringify(results))
}
