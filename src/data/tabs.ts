import { Tabs } from "@/lib/types";
import { CogIcon, MessageCircleIcon, UserIcon } from "lucide-react";

export const tabs: Tabs[] = [
  {
    icon: MessageCircleIcon,
    title: "Chat",
    href: "/home",
  },
  {
    icon: UserIcon,
    title: "Friends",
    href: "/friends",
  },
  {
    icon: CogIcon,
    title: "Settings",
    href: "/settings",
  },
];
