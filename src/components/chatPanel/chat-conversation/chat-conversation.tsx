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
  onScroll: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  canScroll: boolean;
  isLoadingMore: boolean;
  firstMessageRef: React.MutableRefObject<HTMLDivElement | null>;
  getChatData: () => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<ChatType[]>>;
}
const ConversationsChat = ({
  chatData,
  chatId,
  messages,
  lastPing,
  isConnected,
  isTyping,
  onScroll,
  scrollRef,
  canScroll,
  isLoadingMore,
  firstMessageRef,
  getChatData,
  setMessages,
}: ConversationsChatProps) => {
  return (
    <div
      className="h-full w-full flex flex-col relative"
      style={{
        backgroundImage: `url('${import.meta.env.VITE_S3_BUCKET_URL}/${
          chatData.backgroundImage
        }.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        backgroundClip: "content-box",
        width: "100%",
        height: "100%",
        borderTopRightRadius: "10px",
        borderBottomRightRadius: "10px",
      }}
    >
      <ChatHeader
        chatData={chatData}
        lastPing={lastPing}
        isTyping={isTyping}
        getChatData={getChatData}
      />
      <ChatMessages
        messages={messages}
        chatData={chatData}
        chatId={chatId}
        isConnected={isConnected}
        lastMessageReadId={chatData.lastMessageReadId}
        onScroll={onScroll}
        scrollRef={scrollRef}
        canScroll={canScroll}
        isLoadingMore={isLoadingMore}
        firstMessageRef={firstMessageRef}
        setMessages={setMessages}
      />
    </div>
  );
};

export default ConversationsChat;
