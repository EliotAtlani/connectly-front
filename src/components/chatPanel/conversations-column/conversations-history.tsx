import { ScrollArea } from "@/components/ui/scroll-area";
import ConversationsRow from "./conversations-row";
import { mockConversation } from "@/data/mockConversation";

const ConversationsHistory = () => {
  return (
    <ScrollArea className="h-screen pr-4 w-full">
      <div className="flex flex-col pt-0 w-full">
        {mockConversation?.map((conversation, index) => (
          <ConversationsRow
            nbOfNewMessages={conversation.messages.length}
            conversationData={conversation}
            key={index}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ConversationsHistory;
