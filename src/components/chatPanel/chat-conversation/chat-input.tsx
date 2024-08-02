import { PlusIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { socketManager } from "@/lib/socket";
import { getUser } from "@/lib/utils";

interface ChatInputProps {
  setMessage: (message: string) => void;
  message: string;
  sendMessage: (e: React.FormEvent) => void;
  chatId: string;
  isConnected: boolean;
}

const ChatInput = ({
  setMessage,
  message,
  sendMessage,
  chatId,
  isConnected,
}: ChatInputProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const user = getUser();

  useEffect(() => {
    let typingTimer: NodeJS.Timeout;

    const handleTyping = () => {
      if (!isConnected) return;
      if (!isTyping) {
        setIsTyping(true);
        socketManager.emit("typing", {
          chatId,
          username: user?.username,
          userId: user?.userId,
        });
      }

      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        setIsTyping(false);
        if (!isConnected) return;

        socketManager.emit("stop_typing", { chatId, userId: user?.userId });
      }, 1000);
    };

    if (message && message.trim() !== "") {
      handleTyping();
    } else {
      if (!isConnected) return;

      setIsTyping(false);
      socketManager.emit("stop_typing", { chatId, username: user?.username });
    }

    return () => {
      clearTimeout(typingTimer);
    };
  }, [message, isTyping, chatId, user?.username]);

  return (
    <form className="w-full flex gap-2" onSubmit={sendMessage}>
      <div className="rounded-full bg-primary w-10 flex items-center justify-center hover:bg-primary/70 transition duration-300 cursor-pointer">
        <PlusIcon size={20} color="white" />
      </div>
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="w-full"
      />
      <Button type="submit" disabled={message.trim() === ""}>
        <SendIcon size={16} />
      </Button>
    </form>
  );
};

export default ChatInput;
