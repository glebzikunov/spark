import Navbar from "@/components/Navbar"
import LeftSidebar from "@/components/LeftSidebar"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import Providers from "@/components/Providers"
import Bottombar from "@/components/Bottombar"
import "@/styles/globals.css"
import "@uploadthing/react/styles.css"
import { ThemeProvider } from "@/components/ThemeProvider"

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

            <main className="flex flex-row">
              <LeftSidebar />

              <section className="main-container">
                <div className="w-full max-w-5xl">{children}</div>
              </section>
            </main>

            <Bottombar />
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
