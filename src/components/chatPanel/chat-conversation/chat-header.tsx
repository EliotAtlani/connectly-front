import { Label } from "@/components/ui/label";
import { avatarList } from "@/data/avatar-list";
import { ConversationData } from "@/lib/types";
import { format } from "date-fns";

interface ChatHeaderProps {
  chatData: ConversationData;
  lastPing: {
    isOnline: boolean;
    lastPing: string;
  } | null;
  isTyping: boolean;
}

const ChatHeader = ({ chatData, lastPing, isTyping }: ChatHeaderProps) => {
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
          <Label className="text-xs text-muted-foregroun font-light">
            {isTyping ? (
              <span className="text-xs text-muted-foreground italic">
                is typing...
              </span>
            ) : lastPing?.isOnline ? (
              `Active now`
            ) : (
              lastPing?.lastPing &&
              `Last active at ${format(new Date(lastPing?.lastPing), "HH:mm")}`
            )}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
