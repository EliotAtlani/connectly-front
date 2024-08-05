import { SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useRef, useState } from "react";
import { socketManager } from "@/lib/socket";
import { getUser } from "@/lib/utils";
import ChatInputActions from "./chat-input-actions";
import { useToast } from "@/components/ui/use-toast";
import ImageWithOverlay from "@/components/ui/image-delete-overlay";

interface ChatInputProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  sendMessage: (e: React.FormEvent) => void;
  chatId: string;
  isConnected: boolean;
  file: File[];
  setFile: React.Dispatch<React.SetStateAction<File[]>>;
}

const ChatInput = ({
  setMessage,
  message,
  sendMessage,
  chatId,
  isConnected,
  file,
  setFile,
}: ChatInputProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = getUser();
  const { toast } = useToast();

  const handleFilesSelected = useCallback(
    (selectedFiles: File[]) => {
      const maxSize = 1 * 1024 * 1024; // 1MB in bytes

      const validFiles = selectedFiles.filter((file) => {
        if (file.size > maxSize) {
          console.log("File is too large");
          toast({
            description: `File ${file.name} is larger than 10MB and won't be uploaded.`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });
      console.log(validFiles);
      setFile((prevFiles) => [...prevFiles, ...validFiles]);
    },
    [toast]
  );

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
    <form
      className="w-[90%]  mx-auto flex gap-2 relative"
      onSubmit={sendMessage}
    >
      <ChatInputActions
        handleFilesSelected={handleFilesSelected}
        fileInputRef={fileInputRef}
        setMessage={setMessage}
      />
      {file.length > 0 && <ImageWithOverlay files={file} setFile={setFile} />}
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="w-full"
      />

      <Button
        type="submit"
        disabled={message.trim() === "" && file.length === 0}
      >
        <SendIcon size={16} />
      </Button>
    </form>
  );
};

export default ChatInput;
