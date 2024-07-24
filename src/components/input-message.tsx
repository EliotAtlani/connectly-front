import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";
import { socketManager } from "@/lib/socket";

interface InputMessageProps {
  setMessage: (message: string) => void;
  message: string;
  sendMessage: (e: React.FormEvent) => void;
  room: string;
  username: string;
  isConnected: boolean;
}

const InputMessage = ({
  setMessage,
  message,
  sendMessage,
  room,
  username,
  isConnected,
}: InputMessageProps) => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let typingTimer: NodeJS.Timeout;

    const handleTyping = () => {
      if (!isConnected) return;
      if (!isTyping) {
        setIsTyping(true);
        socketManager.emit("typing", { room, username });
      }

      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        setIsTyping(false);
        if (!isConnected) return;

        socketManager.emit("stop_typing", { room, username });
      }, 1000);
    };

    if (message && message.trim() !== "") {
      handleTyping();
    } else {
      if (!isConnected) return;

      setIsTyping(false);
      socketManager.emit("stop_typing", { room, username });
    }

    return () => {
      clearTimeout(typingTimer);
    };
  }, [message, isTyping, room, username]);

  return (
    <form className="w-full flex gap-2" onSubmit={sendMessage}>
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

export default InputMessage;
