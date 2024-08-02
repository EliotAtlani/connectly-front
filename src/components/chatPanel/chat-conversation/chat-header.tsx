import { Label } from "@/components/ui/label";
import { avatarList } from "@/data/avatar-list";
import { ConversationData } from "@/lib/types";
import {
  format,
  isYesterday,
  isToday,
  isThisWeek,
  differenceInDays,
} from "date-fns";

interface ChatHeaderProps {
  chatData: ConversationData;
  lastPing: {
    isOnline: boolean;
    lastPing: string;
  } | null;
  isTyping: boolean;
}

const ChatHeader = ({ chatData, lastPing, isTyping }: ChatHeaderProps) => {
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
    <div className="w-full min-h-[80px] border-b-[1px] px-4 py-2 flex items-center">
      <div className="flex gap-4 items-center">
        <img
          src={avatarList[chatData.avatar]}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col gap-1">
          <Label className="font-bold">{chatData.name}</Label>
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
    </div>
  );
};

export default ChatHeader;
