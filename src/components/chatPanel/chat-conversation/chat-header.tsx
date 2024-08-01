import { Label } from "@/components/ui/label";
import { avatarList } from "@/data/avatar-list";
import { ConversationData } from "@/lib/types";

interface ChatHeaderProps {
  chatData: ConversationData;
}

const ChatHeader = ({ chatData }: ChatHeaderProps) => {
  return (
    <div className="w-full min-h-[80px] border-b-[1px] px-4 py-2 flex items-center">
      <div className="flex gap-2 items-center">
        <img
          src={avatarList[chatData.avatar]}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col gap-1">
          <Label className="font-bold">{chatData.name}</Label>
          <Label className="text-xs text-muted-foregroun font-light">
            Last active 10:16
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
