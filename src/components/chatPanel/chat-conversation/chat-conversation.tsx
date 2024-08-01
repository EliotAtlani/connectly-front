import ChatHeader from "./chat-header";
import { ChatType, ConversationType } from "@/lib/types";
import ChatMessages from "./chat-messages";

interface ConversationsChatProps {
  chatData: ConversationType;
  messages: ChatType[];
  chatId: string;
}
const ConversationsChat = ({
  chatData,
  chatId,
  messages,
}: ConversationsChatProps) => {
  return (
    <div className="h-full w-full flex flex-col relative">
      <ChatHeader chatData={chatData.data} />
      <ChatMessages messages={messages} chatId={chatId} />
    </div>
  );
};

export default ConversationsChat;
