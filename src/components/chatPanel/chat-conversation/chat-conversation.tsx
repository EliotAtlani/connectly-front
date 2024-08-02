import ChatHeader from "./chat-header";
import { ChatType, ConversationType } from "@/lib/types";
import ChatMessages from "./chat-messages";

interface ConversationsChatProps {
  chatData: ConversationType;
  messages: ChatType[];
  chatId: string;
  lastPing: {
    isOnline: boolean;
    lastPing: string;
  } | null;
  isConnected: boolean;
  isTyping: boolean;
}
const ConversationsChat = ({
  chatData,
  chatId,
  messages,
  lastPing,
  isConnected,
  isTyping,
}: ConversationsChatProps) => {
  return (
    <div className="h-full w-full flex flex-col relative">
      <ChatHeader
        chatData={chatData.data}
        lastPing={lastPing}
        isTyping={isTyping}
      />
      <ChatMessages
        messages={messages}
        chatId={chatId}
        isConnected={isConnected}
        lastMessageReadId={chatData.lastMessageReadId}
      />
    </div>
  );
};

export default ConversationsChat;
