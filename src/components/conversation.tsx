import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { Avatar, AvatarImage } from "./ui/avatar";
import defaultAvatar from "@/assets/avatar.png";
interface ConversationProps {
  messages: Message[];
  username: string;
}

const Conversation = ({ messages, username }: ConversationProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="h-[500px] overflow-y-auto relative space-y-2 px-2 scrollbar-hide"
    >
      <div className="sticky top-0 w-full bg-gradient-to-b from-background to-transparent h-4" />

      {messages?.map((msg, index) => (
        <div key={index} className="flex gap-2">
          {msg.from_user !== username && (
            <Avatar>
              {msg.user_image ? (
                <AvatarImage src={msg.user_image} className="w-32" />
              ) : (
                <AvatarImage src={defaultAvatar} />
              )}
            </Avatar>
          )}
          <div
            className={cn(
              msg.from_user === "System"
                ? "text-xs text-center w-[200px] rounded-md p-1 bg-black/20 mx-auto"
                : msg.from_user === username
                ? "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm my-1 ml-auto bg-primary text-primary-foreground"
                : "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm my-1 bg-muted"
            )}
          >
            {msg.content}
          </div>
        </div>
      ))}

      <div className="h-[60px]" />
    </div>
  );
};

export default Conversation;
