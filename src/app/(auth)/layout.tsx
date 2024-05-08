import Navbar from "@/components/Navbar"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"
import "../../styles/globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import Providers from "@/components/Providers"

export const metadata = {
  title: "Spark",
  description: "Spark micro-blog web app built with Next.js and TypeScript.",
}

const inter = Inter({ subsets: ["latin"], display: "swap" })

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {/* @ts-expect-error Server Component */}
            <Navbar />
            {authModal}
            <div className="w-full flex justify-center items-center min-h-screen dark:bg-[#1F1F1F]">
              {children}
            </div>

            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
