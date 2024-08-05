/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatType } from "@/lib/types";
import { useState } from "react";
import ChatInput from "./chat-input/chat-input";
import ChatConversationHistory from "./chat-conversation-history";
import { socketManager } from "@/lib/socket";
import { getUser } from "@/lib/utils";

interface ChatMessagesProps {
  messages: ChatType[];
  chatId: string;
  isConnected: boolean;
  lastMessageReadId: string;
  onScroll: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  canScroll: boolean;
  isLoadingMore: boolean;
  firstMessageRef: React.MutableRefObject<HTMLDivElement | null>;
  setMessages: React.Dispatch<React.SetStateAction<ChatType[]>>;
}

const ChatMessages = ({
  messages,
  chatId,
  isConnected,
  lastMessageReadId,
  onScroll,
  scrollRef,
  canScroll,
  isLoadingMore,
  firstMessageRef,
  setMessages,
}: ChatMessagesProps) => {
  const [message, setMessage] = useState("");
  const user = getUser();
  const [file, setFile] = useState<File[]>([]);
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message && file.length === 0) return;

    if (file.length > 0) {
      const fileUploads = file.map(async (f) => {
        setMessages((state) => [
          ...state,
          {
            content: "",
            file: f,
            senderId: user?.userId as string,
            createdAt: new Date().toISOString(),
            type: "LOCAL_IMAGE",
            id: " ",
          },
        ]);

        await socketManager.emit("upload_image", {
          content: message,
          from_user_id: user?.userId,
          user_image: user?.avatar,
          from_username: user?.username,
          chatId,
          file: f,
        });
      });

      await Promise.all(fileUploads);
      setFile([]);
    }

    if (message.trim()) {
      socketManager.emit("send_message", {
        content: message,
        from_user_id: user?.userId,
        user_image: user?.avatar,
        from_username: user?.username,
        chatId,
      });
      setMessage("");
    }
  };

  return (
    <div className="h-full">
      <div className=" absolute w-full bottom-0 ">
        <div className="w-[100%] mx-auto bg-gradient-to-t to-transparent from-background via-backgroundb backdrop-blur-[6px] pb-4 pt-4 ">
          <ChatInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            chatId={chatId}
            isConnected={isConnected}
            file={file}
            setFile={setFile}
          />
        </div>
      </div>

      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-hidden">
          <ChatConversationHistory
            messages={messages}
            lastMessageReadId={lastMessageReadId}
            onScroll={onScroll}
            scrollRef={scrollRef}
            canScroll={canScroll}
            isLoadingMore={isLoadingMore}
            firstMessageRef={firstMessageRef}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
