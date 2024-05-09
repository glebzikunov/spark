import { Home, Plus, Bell, Bookmark, Users } from "lucide-react"

export const sidebarLinks = [
  {
    icon: <Home strokeWidth={1} className="dark:stroke-white" />,
    route: "/",
    label: "Home",
  },
  {
    icon: <Plus strokeWidth={1} className="dark:stroke-white" />,
    route: "/c/create",
    label: "Create community",
  },
  {
    icon: <Bell strokeWidth={1} className="dark:stroke-white" />,
    route: "/activity",
    label: "Activity",
  },
  {
    icon: <Bookmark strokeWidth={1} className="dark:stroke-white" />,
    route: "/bookmarks",
    label: "Bookmarks",
  },
  {
    icon: <Users strokeWidth={1} className="dark:stroke-white" />,
    route: "/c",
    label: "Communities",
  },
]
