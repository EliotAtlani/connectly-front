import { ChatType, UserData } from "@/lib/types";
import { cn, mapReaction } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { avatarList } from "@/data/avatar-list";
import { socketManager } from "@/lib/socket";

interface ChatReactionDisplayProps {
  msg: ChatType;
  user: UserData | null;
}

const ChatReactionDisplay = ({ msg, user }: ChatReactionDisplayProps) => {
  if (!msg?.reactions) return null;

  const handleRemoveReaction = (reaction: string, message: ChatType) => {
    try {
      socketManager.emit("remove_reaction", {
        userId: user?.userId,
        messageId: message.id,
        type: reaction,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "flex gap-1 absolute min-h-[10px] min-w-[30px] bottom-[-22px] z-20 bg-white/60 rounded-full px-2 py-1 justify-center",
          user?.userId === msg.senderId ? "right-0" : "left-0"
        )}
      >
        {msg?.reactions.map((reaction, index) => (
          <div key={index} className="flex items-center ">
            <span className="text-sm">{mapReaction(reaction.type)}</span>
          </div>
        ))}
      </PopoverTrigger>

      <PopoverContent className="bg-background/90 p-1 !min-w-[180px]">
        {msg?.reactions.map((reaction, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between gap-1 px-2 py-1",
              reaction.user.userId === user?.userId && "cursor-pointer"
            )}
          >
            <div className="flex items-center gap-2">
              <img
                src={avatarList[reaction.user.avatar]}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col items-start">
                <Label className="text-[14px]">{reaction.user.username}</Label>
                {reaction.user.userId === user?.userId && (
                  <button
                    onClick={() => handleRemoveReaction(reaction.type, msg)}
                    className="text-xs text-muted-foreground"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <Label
              className={cn(
                "text-lg",
                reaction.user.userId === user?.userId && "cursor-pointer"
              )}
            >
              {mapReaction(reaction.type)}
            </Label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default ChatReactionDisplay;
