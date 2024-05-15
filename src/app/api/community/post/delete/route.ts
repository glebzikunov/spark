import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { DeletePostValidator } from "@/lib/validators/post"
import { z } from "zod"

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { postId } = DeletePostValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    await db.post.delete({
      where: {
        id: postId,
      },
    })

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 })
    }

    return new Response("Could not register your vote. Try again later.", {
      status: 500,
    })
  }
}
