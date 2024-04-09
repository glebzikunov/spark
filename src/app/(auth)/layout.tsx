import Navbar from "@/components/Navbar"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"
import "../../styles/globals.css"

export const metadata = {
  title: "Spark",
  description: "Spark micro-blog web app built with Next.js and TypeScript.",
}

const inter = Inter({ subsets: ["latin"], display: "swap" })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="w-full flex justify-center items-center min-h-screen">
          {children}
        </div>

        <Toaster />
      </body>
    </html>
  )
}
