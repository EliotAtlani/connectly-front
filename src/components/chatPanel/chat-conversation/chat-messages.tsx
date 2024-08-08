/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatType, ConversationType } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./chat-input/chat-input";
import ChatConversationHistory from "./chat-conversation-history";
import { socketManager } from "@/lib/socket";
import { getUser } from "@/lib/utils";
import { ArrowDownCircleIcon } from "lucide-react";

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
  chatData: ConversationType;
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
  chatData,
}: ChatMessagesProps) => {
  const [message, setMessage] = useState("");
  const user = getUser();
  const [file, setFile] = useState<File[]>([]);
  const [replyMessage, setReplyMessage] = useState<ChatType | null>(null);
  const msgInputRef = useRef<HTMLInputElement>(null);
  const [openReaction, setOpenReaction] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setReplyMessage(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollTop = scrollRef.current.scrollTop;
        const scrollHeight = scrollRef.current.scrollHeight;
        const clientHeight = scrollRef.current.clientHeight;

        // Show the button if the user scrolls up more than 100 pixels from the bottom
        if (scrollHeight - scrollTop - clientHeight > 100) {
          setShowScrollToBottom(true);
        } else {
          setShowScrollToBottom(false);
        }
      }
    };

    scrollRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      scrollRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
            senderName: user?.username as string,
            createdAt: new Date().toISOString(),
            type: "LOCAL_IMAGE",
            id: Math.random().toString(),
          },
        ]);

        socketManager.emit("upload_image", {
          content: message,
          from_user_id: user?.userId,
          user_image: user?.avatar,
          from_username: user?.username,
          chatId,
          file: f,
          replyMessageId: replyMessage?.id,
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
        replyMessageId: replyMessage?.id,
        replyTo: replyMessage,
      });
      setMessage("");
      setReplyMessage(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openReaction) {
        const reactionPanel = document.getElementById(
          `reaction-panel-${openReaction}`
        );
        if (reactionPanel && !reactionPanel.contains(event.target as Node)) {
          setOpenReaction(null);
        }
      }
    };

    overlayRef.current?.addEventListener("click", handleClickOutside);

    return () => {
      overlayRef.current?.removeEventListener("click", handleClickOutside);
    };
  }, [openReaction]);

  const handleScrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="h-full">
      {openReaction && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-black/30 z-40"
          ref={overlayRef}
        />
      )}

      <div className=" absolute w-full bottom-0 z-30">
        <div className="w-[100%] mx-auto bg-gradient-to-t to-transparent from-background via-backgroundb backdrop-blur-[6px] pb-4 pt-4 ">
          <ChatInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            chatId={chatId}
            isConnected={isConnected}
            file={file}
            setFile={setFile}
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
            chatData={chatData}
            msgInputRef={msgInputRef}
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
            setReplyMessage={setReplyMessage}
            replyMessage={replyMessage}
            msgInputRef={msgInputRef}
            openReaction={openReaction}
            setOpenReaction={setOpenReaction}
          />
        </div>
      </div>
      {showScrollToBottom && (
        <button
          onClick={handleScrollToBottom}
          className="absolute bottom-20 left-0 flex w-full justify-center z-100"
        >
          <ArrowDownCircleIcon size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatMessages;
