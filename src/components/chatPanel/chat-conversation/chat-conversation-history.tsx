import { Label } from "@/components/ui/label";
import { ChatType, ConversationType } from "@/lib/types";
import { cn, getUser } from "@/lib/utils";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { useCallback, useEffect, useRef } from "react";
import HashLoader from "react-spinners/HashLoader";
import ImageMessage from "./chat-component/image-msg";
import ImageMessageLocal from "./chat-component/image-msg-local";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { CopyIcon, ReplyIcon, SmilePlusIcon } from "lucide-react";
import ReadTag from "./chat-component/read-tag";
import ChatReply from "./chat-component/chat-reply";
import ChatReactionPanel from "./chat-component/chat-reaction-panel";
import ChatReactionDisplay from "./chat-component/chat-reaction-display";
import { avatarList } from "@/data/avatar-list";

interface ChatConversationHistoryProps {
  messages: ChatType[];
  lastMessageReadId: string;
  onScroll: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  canScroll: boolean;
  isLoadingMore: boolean;
  firstMessageRef: React.MutableRefObject<HTMLDivElement | null>;
  setReplyMessage: React.Dispatch<React.SetStateAction<ChatType | null>>;
  replyMessage: ChatType | null;
  msgInputRef: React.RefObject<HTMLInputElement>;
  openReaction: string | null;
  setOpenReaction: React.Dispatch<React.SetStateAction<string | null>>;
  chatData: ConversationType;
}

// Utility function to group messages by date
const groupMessagesByDate = (messages: ChatType[]) => {
  return messages.reduce((groups, message) => {
    const date = format(new Date(message.createdAt), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as { [key: string]: ChatType[] });
};

// Utility function to format the date header
const formatDateHeader = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (differenceInDays(new Date(), date) < 7) {
    return format(date, "EEEE");
  } else {
    return format(date, "MMMM d, yyyy");
  }
};

const ChatConversationHistory = ({
  messages,
  lastMessageReadId,
  onScroll,
  scrollRef,
  canScroll,
  isLoadingMore,
  firstMessageRef,
  setReplyMessage,
  replyMessage,
  msgInputRef,
  openReaction,
  setOpenReaction,
  chatData,
}: ChatConversationHistoryProps) => {
  const user = getUser();
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (scrollRef.current) {
      if (canScroll) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleReply = (msg: ChatType) => {
    setReplyMessage(msg);
    // Use setTimeout to ensure the focus happens after state update
    setTimeout(() => {
      if (msgInputRef.current) {
        msgInputRef.current.focus();
      }
    }, 0);
  };

  const scrollToMessage = useCallback((messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      // messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      scrollRef.current?.scrollTo({
        top: messageElement.offsetTop - 100,
        behavior: "smooth",
      });
    } else {
      //Scroll the 0 top
      scrollRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto px-10 py-4 space-y-2 relative"
      onScroll={onScroll}
    >
      {isLoadingMore && (
        <div className="flex justify-center">
          <HashLoader color="#7c3aed" size={30} />
        </div>
      )}
      {Object.keys(groupedMessages).map((date, dateIndex) => (
        <div key={dateIndex}>
          <div className="text-center text-muted-foreground text-sm my-4">
            <Label className="bg-background/40 px-4 py-2 rounded-md text-foreground">
              {formatDateHeader(date)}
            </Label>
          </div>
          {groupedMessages[date].map((msg, msgIndex) => (
            <div
              key={msgIndex}
              className={cn(
                "flex gap-2 my-1 relative",
                msg?.reactions && msg?.reactions?.length > 0 ? "mb-8" : ""
              )}
              ref={(el) => {
                if (msgIndex === 50) {
                  firstMessageRef.current = el;
                }
                messageRefs.current[msg.id] = el;
              }}
            >
              {openReaction === msg.id && (
                <ChatReactionPanel
                  msg={msg}
                  user={user}
                  setOpenReaction={setOpenReaction}
                />
              )}

              <ContextMenu>
                <div
                  className={cn(
                    msg.senderId === user?.userId
                      ? ""
                      : " flex items-end gap-2",
                    "w-full flex items-end "
                  )}
                >
                  {msg.senderId !== user?.userId &&
                    chatData.type === "GROUP" &&
                    msg.type !== "SYSTEM" && (
                      <img
                        src={avatarList[msg.sender?.avatar]}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                  <div
                    className={cn(
                      msg.senderId === user?.userId ? " ml-auto " : "",
                      msg.type === "SYSTEM" ? "!mx-auto" : "",
                      "flex items-end gap-2 "
                    )}
                  >
                    {chatData.type === "PRIVATE" &&
                      msg.id === lastMessageReadId && <ReadTag />}
                    {msg.type === "IMAGE" && (
                      <ContextMenuTrigger>
                        <ImageMessage msg={msg} user={user} />
                      </ContextMenuTrigger>
                    )}
                    {msg.type === "LOCAL_IMAGE" && (
                      <ContextMenuTrigger>
                        <ImageMessageLocal file={msg.file as File} />
                      </ContextMenuTrigger>
                    )}
                    {msg.type === "TEXT" && (
                      <ContextMenuTrigger
                        className={cn(
                          msg.senderId === user?.userId
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                          "flex  flex-col rounded-lg  px-1 py-1 text-sm relative "
                        )}
                      >
                        {msg?.reactions && msg?.reactions?.length > 0 && (
                          <ChatReactionDisplay msg={msg} user={user} />
                        )}
                        {msg.replyTo && (
                          <ChatReply
                            msg={msg}
                            scrollToMessage={scrollToMessage}
                            user={user}
                          />
                        )}
                        <div className="flex justify-between items-end gap-2 ">
                          <div className="flex flex-col  items-start gap-2 px-2 py-1">
                            {chatData.type === "GROUP" &&
                              msg.senderId !== user?.userId && (
                                <Label className="font-bold">
                                  {" "}
                                  {msg.sender.username}{" "}
                                </Label>
                              )}
                            <span>{msg.content}</span>
                          </div>
                          <span
                            className={cn(
                              "text-[9px] text-muted-foreground pr-2"
                            )}
                          >
                            {format(new Date(msg.createdAt), "HH:mm")}
                          </span>
                        </div>
                      </ContextMenuTrigger>
                    )}
                    {msg.type === "SYSTEM" && (
                      <div className="my-2">
                        <div className="flex flex-col  items-start gap-2 px-4 py-1 bg-muted/50  rounded-md">
                          <span className="text-xs text-center ">
                            {msg.content}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => handleReply(msg)}
                    className="cursor-pointer"
                  >
                    <ReplyIcon size={16} className="mr-2" />
                    Reply
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="cursor-pointer"
                    onClick={() => setOpenReaction(msg.id)}
                  >
                    <SmilePlusIcon size={16} className="mr-2" />
                    React
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => handleCopy(msg.content)}
                    className="cursor-pointer"
                  >
                    <CopyIcon size={16} className="mr-2" />
                    Copy
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          ))}
        </div>
      ))}
      <div className={cn(replyMessage ? "h-[170px]" : "h-[125px]")}></div>
    </div>
  );
};

export default ChatConversationHistory;
