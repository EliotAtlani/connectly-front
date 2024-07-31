import { PlusIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  setMessage: (message: string) => void;
  message: string;
  sendMessage: (e: React.FormEvent) => void;
}

const ChatInput = ({ setMessage, message, sendMessage }: ChatInputProps) => {
  //   const [isTyping, setIsTyping] = useState(false);

  //   useEffect(() => {
  //     let typingTimer: NodeJS.Timeout;

  //     const handleTyping = () => {
  //       if (!isConnected) return;
  //       if (!isTyping) {
  //         setIsTyping(true);
  //         socketManager.emit("typing", { room, username });
  //       }

  //       clearTimeout(typingTimer);
  //       typingTimer = setTimeout(() => {
  //         setIsTyping(false);
  //         if (!isConnected) return;

  //         socketManager.emit("stop_typing", { room, username });
  //       }, 1000);
  //     };

  //     if (message && message.trim() !== "") {
  //       handleTyping();
  //     } else {
  //       if (!isConnected) return;

  //       setIsTyping(false);
  //       socketManager.emit("stop_typing", { room, username });
  //     }

  //     return () => {
  //       clearTimeout(typingTimer);
  //     };
  //   }, [message, isTyping, room, username]);

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
