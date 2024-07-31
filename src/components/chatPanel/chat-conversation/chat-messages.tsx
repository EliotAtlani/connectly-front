import { ConversationType } from "@/lib/types";
import { useState } from "react";
import ChatInput from "./chat-input";
import ChatConversationHistory from "./chat-conversation-history";

interface ChatMessagesProps {
  chatData: ConversationType;
}

const ChatMessages = ({ chatData }: ChatMessagesProps) => {
  const [message, setMessage] = useState("");

  return (
    <div className="h-full">
      <div className=" absolute w-full bottom-0 ">
        <div className="w-[90%] mx-auto bg-gradient-to-t to-transparent from-background via-background via-70% pb-4 pt-2">
          <ChatInput
            message={message}
            setMessage={setMessage}
            sendMessage={(e) => {
              e.preventDefault();
              console.log(message);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-hidden">
          <ChatConversationHistory messages={chatData.messages} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
