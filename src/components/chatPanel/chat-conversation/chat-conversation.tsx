import ChatHeader from "./chat-header";
import { ConversationType } from "@/lib/types";
import ChatMessages from "./chat-messages";

interface ConversationsChatProps {
  chatData: ConversationType;
}
const ConversationsChat = ({ chatData }: ConversationsChatProps) => {
  return (
    <div className="h-full w-full flex flex-col relative">
      <ChatHeader chatData={chatData.data} />
      <ChatMessages chatData={chatData} />
    </div>
  );
};

export default ConversationsChat;
