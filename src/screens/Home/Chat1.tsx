import ConversationsChat from "@/components/chatPanel/chat-conversation/chat-conversation";
import { mockConversation } from "@/data/mockConversation";
import { useParams } from "react-router-dom";

const Chat1 = () => {
  const { chatId } = useParams();
  if (!chatId) return null;
  const chatData = mockConversation[parseInt(chatId) - 1];
  return <ConversationsChat chatData={chatData} />;
};

export default Chat1;
