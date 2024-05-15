import Editor from "@/components/Editor"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import Link from "next/link"
import { notFound } from "next/navigation"
import React from "react"

interface PageProps {
  params: {
    slug: string
  }
}

const Page = async ({ params }: PageProps) => {
  const community = await db.community.findFirst({
    where: {
      name: params.slug,
    },
  })

  if (!community) return notFound()

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="w-full border-b border-border dark:border-[#313131] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold leading-6">Create post</h2>
          <div className="flex items-center gap-2 xl:hidden bg-[#EAEDEF] dark:bg-[#303030] px-4 py-2 rounded-full">
            <div className="flex items-center justify-center w-[24px] h-[24px] rounded-full bg-black dark:bg-[#464646] text-white dark:text-[#838383]">
              c/
            </div>
            <p className="truncate text-sm font-semibold">c/{params.slug}</p>
          </div>
        </div>
      </div>
      <Editor communityId={community.id} />
      <div className="w-full flex justify-end gap-3">
        <Button variant="secondary" asChild>
          <Link href={`/c/${params.slug}`}>Cancel</Link>
        </Button>
        <Button
          className="border-[#F97316] hover:bg-[#F97316] text-[#F97316] hover:text-white"
          variant="outline"
          type="submit"
          form="community-post-form"
        >
          Post
        </Button>
      </div>
    </div>
  )
}

export default Page
