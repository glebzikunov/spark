import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { UserCircle2Icon } from "lucide-react"

interface MiniCommunityCardProps {
  id: string
  communityName: string
  communityDescription: string | null
  imgUrl: string | null
  subscribers: {
    user: {
      id: string
      image: string | null
    }
  }[]
}

const MiniCommunityCard = ({
  id,
  communityName,
  communityDescription,
  imgUrl,
  subscribers,
}: MiniCommunityCardProps) => {
  return (
    <article className="communityCard">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/c/${communityName}`} className="relative h-12 w-12">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt="Community logo"
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <UserCircle2Icon
              strokeWidth={0.75}
              className="h-12 w-12 stroke-[#F97316]"
            />
          )}
        </Link>

        <div>
          <Link href={`/c/${communityName}`}>
            <h4 className="font-semibold">c/{communityName}</h4>
          </Link>
        </div>
      </div>

      <p className="mt-2 text-[14px] text-[#576f76] dark:text-[#838383]">
        {communityDescription || `${communityName} community`}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/c/${communityName}`}>
          <Button size="sm">View</Button>
        </Link>

        {subscribers.length > 0 && (
          <div className="flex items-center">
            {subscribers.map(({ user }, index) => (
              <Image
                key={user.id}
                src={user.image || ""}
                alt="subscriber image"
                width={28}
                height={28}
                className={`${
                  index !== 0 && "-ml-2"
                } rounded-full object-cover aspect-square`}
              />
            ))}
            {subscribers.length > 3 && (
              <p className="ml-1 text-[14px] text-[#576f76] dark:text-[#838383]">
                {subscribers.length}+ Users
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default MiniCommunityCard
