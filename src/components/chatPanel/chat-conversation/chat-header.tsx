import { Label } from "@/components/ui/label";
import { avatarList } from "@/data/avatar-list";
import { ConversationType } from "@/lib/types";
import {
  format,
  isYesterday,
  isToday,
  isThisWeek,
  differenceInDays,
} from "date-fns";
import {
  EllipsisVerticalIcon,
  ImageIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ChatSettings from "./chat-settings/chat-settings";
import { useState } from "react";
import ChatMediasList from "./chat-settings/chat-medias-list";

interface ChatHeaderProps {
  chatData: ConversationType;
  lastPing: {
    isOnline: boolean;
    lastPing: string;
  } | null;
  isTyping: boolean;
  getChatData: () => Promise<void>;
}

const ChatHeader = ({
  chatData,
  lastPing,
  isTyping,
  getChatData,
}: ChatHeaderProps) => {
  const [content, setContent] = useState<string>("settings");
  const formatLastActive = (lastPingDate: string) => {
    const date = new Date(lastPingDate);

    if (isToday(date)) {
      return `Last seen today at ${format(date, "HH:mm")}`;
    } else if (isYesterday(date)) {
      return `Last seen yesterday at ${format(date, "HH:mm")}`;
    } else if (isThisWeek(date)) {
      return `Last seen ${format(date, "EEEE")} at ${format(date, "HH:mm")}`;
    } else if (differenceInDays(new Date(), date) < 365) {
      return `Last seen ${format(date, "d MMMM")} at ${format(date, "HH:mm")}`;
    } else {
      return `Last seen ${format(date, "d MMMM yyyy")} at ${format(
        date,
        "HH:mm"
      )}`;
    }
  };

  return (
    <div className="w-full min-h-[60px] border-b-[1px] border-none px-4 py-2 flex items-center justify-between bg-background/40 backdrop-blur-sm">
      <div className="flex gap-4 items-center">
        <img
          src={avatarList[chatData.data.avatar]}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col gap-1">
          <Label className="font-bold">{chatData.data.name}</Label>
          <Label className="text-xs text-muted-foreground font-light">
            {isTyping ? (
              <span className="text-xs text-muted-foreground italic">
                is typing...
              </span>
            ) : lastPing?.isOnline ? (
              "Online"
            ) : (
              lastPing?.lastPing && formatLastActive(lastPing.lastPing)
            )}
          </Label>
        </div>
      </div>
      <div className="flex items-center">
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVerticalIcon size={24} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Chat settings</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DialogTrigger
                className="w-full cursor-pointer"
                onClick={() => setContent("settings")}
              >
                <DropdownMenuItem className="cursor-pointer">
                  <SettingsIcon size={18} className="mr-2" /> Settings
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger
                className="w-full cursor-pointer"
                onClick={() => setContent("medias")}
              >
                <DropdownMenuItem className="cursor-pointer">
                  <ImageIcon size={18} className="mr-2" />
                  Medias
                </DropdownMenuItem>
              </DialogTrigger>

              <DropdownMenuItem className="cursor-pointer">
                <SearchIcon size={18} className="mr-2" />
                Search
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            {content === "settings" && (
              <ChatSettings chatData={chatData} getChatData={getChatData} />
            )}
            {content === "medias" && <ChatMediasList chatData={chatData} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChatHeader;
