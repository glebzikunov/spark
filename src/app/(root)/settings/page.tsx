import UserImageForm from "@/components/UserImageForm"
import UserNameForm from "@/components/UserNameForm"
import { authOptions, getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

const page = async () => {
  const session = await getAuthSession()

  if (!session) redirect(authOptions.pages?.signIn || "/sign-in")

  return (
    <>
      <div className="grid items-start gap-4">
        <h1 className="font-bold text-2xl md:text-3xl">Settings</h1>
        <div className="grid gap-5">
          <UserNameForm
            user={{
              id: session.user.id,
              username: session.user.username || "",
            }}
          />
          <UserImageForm
            user={{
              id: session.user.id,
              image: session.user.image || "",
            }}
          />
        </div>
      </div>
    </>
  )
}

export default page
