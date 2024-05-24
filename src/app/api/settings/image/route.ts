import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { UserImageValidator } from "@/lib/validators/user"
import { z } from "zod"

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { image } = UserImageValidator.parse(body)

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: image,
      },
    })

    return new Response("OK")
  } catch (error) {
    error

    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 400 })
    }

    return new Response(
      "Could not update user image at this time. Try again later.",
      { status: 500 }
    )
  }
}
