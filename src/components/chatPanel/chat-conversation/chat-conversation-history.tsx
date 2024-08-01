import { ChatType } from "@/lib/types";
import { cn, getUser } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface ChatConversationHistoryProps {
  messages: ChatType[];
}

const ChatConversationHistory = ({
  messages,
}: ChatConversationHistoryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = getUser();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto px-10 py-4 space-y-4"
    >
      {messages?.map((msg, index) => (
        <div key={index} className="flex gap-2">
          {/* {msg.from_user_id !== user?.userId && (
            <img
              src={avatarList[parseInt(msg.from_user_image)]}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          )} */}
          <div
            className={cn(
              msg.senderId === "System"
                ? "text-xs text-center w-[200px] rounded-md p-1 bg-black/20 mx-auto"
                : msg.senderId === user?.userId
                ? "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm my-1 ml-auto bg-primary text-primary-foreground"
                : "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm my-1 bg-muted"
            )}
          >
            {msg.content}
          </div>
        </div>
      ))}
      <div className="h-[110px]"></div>
    </div>
  );
};

export default ChatConversationHistory;
