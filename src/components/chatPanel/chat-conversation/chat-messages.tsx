/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatType } from "@/lib/types";
import { useState } from "react";
import ChatInput from "./chat-input";
import ChatConversationHistory from "./chat-conversation-history";
import { socketManager } from "@/lib/socket";
import { getUser } from "@/lib/utils";

interface ChatMessagesProps {
  messages: ChatType[];
  chatId: string;
}

const ChatMessages = ({ messages, chatId }: ChatMessagesProps) => {
  const [message, setMessage] = useState("");
  const user = getUser();

  const sendMessage = (e: any) => {
    e.preventDefault();

    socketManager.emit("send_message", {
      content: message,
      from_user_id: user?.userId,
      user_image: user?.image,
      from_username: user?.username,
      chatId,
    });
    setMessage("");
  };

  return (
    <div className="h-full">
      <div className=" absolute w-full bottom-0 ">
        <div className="w-[90%] mx-auto bg-gradient-to-t to-transparent from-background via-background via-70% pb-4 pt-2">
          <ChatInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      </div>

      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-hidden">
          <ChatConversationHistory messages={messages} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
