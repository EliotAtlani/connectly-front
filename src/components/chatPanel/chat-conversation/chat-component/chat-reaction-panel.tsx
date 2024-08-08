import { reactionList } from "@/data/react-list";
import { socketManager } from "@/lib/socket";
import { ChatType, UserData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatReactionPanelProps {
  msg: ChatType;
  user: UserData | null;
  setOpenReaction: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatReactionPanel = ({
  msg,
  user,
  setOpenReaction,
}: ChatReactionPanelProps) => {
  const handleReactToMessage = async (reaction: string, message: ChatType) => {
    try {
      socketManager.emit("react_message", {
        userId: user?.userId,
        messageId: message.id,
        type: reaction,
      });

      setOpenReaction(null);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      id={`reaction-panel-${msg.id}`}
      className={cn(
        "flex gap-2 absolute top-[-24px] px-2 py-1 rounded-md bg-muted z-50",
        user?.userId === msg.senderId ? "right-0" : "left-0"
      )}
    >
      <div className="flex items-center gap-2">
        {reactionList.map((reaction, index) => (
          <button
            key={index}
            onClick={() => handleReactToMessage(reaction.value, msg)}
            className="text-xl"
          >
            {reaction.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatReactionPanel;
