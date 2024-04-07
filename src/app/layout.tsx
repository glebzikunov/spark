import LeftSidebar from "@/components/LeftSidebar"
import RightSidebar from "@/components/RightSidebar"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { Inter } from "next/font/google"

export const metadata = {
  title: "Spark",
  description: "Spark micro-blog web app built with Next.js and TypeScript.",
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />

        <main className="flex flex-row">
          <LeftSidebar />

          <section className="main-container">
            <div className="w-full max-w-3xl">{children}</div>
          </section>

          <RightSidebar />
        </main>
      </body>
    </html>
  )
}
