import ConversationsHeader from "./conversations-header";
import ConversationsHistory from "./conversations-history";

const ConversationColumn = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 pl-4 pt-4">
        <ConversationsHeader />
      </div>

      <div className="flex-grow overflow-y-auto pl-4 pb-4 mt-4">
        <ConversationsHistory />
      </div>
    </div>
  );
};

export default ConversationColumn;
