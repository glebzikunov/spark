import Link from "next/link"
import AuthForm from "./AuthForm"

const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 ">
        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        <p className="text-sm mx-w-xs mx-auto">
          By continuing, you agree to our User Agreement and acknowledge that
          you understand the Privacy Policy.
        </p>

        <AuthForm />

        <p className="px-8 text-center text-sm">
          Already a spark member?{" "}
          <Link
            className="hover:text-[#F97316] text-sm underline underline-offset-4 "
            href="/sign-in"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
