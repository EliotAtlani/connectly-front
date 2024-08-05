import { Label } from "@/components/ui/label";
import { ChatType } from "@/lib/types";
import { cn, getUser } from "@/lib/utils";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { useEffect } from "react";
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

interface ChatConversationHistoryProps {
  messages: ChatType[];
  lastMessageReadId: string;
  onScroll: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  canScroll: boolean;
  isLoadingMore: boolean;
  firstMessageRef: React.MutableRefObject<HTMLDivElement | null>;
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
}: ChatConversationHistoryProps) => {
  const user = getUser();

  useEffect(() => {
    if (scrollRef.current) {
      if (canScroll) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto px-10 py-4 space-y-2"
      onScroll={onScroll}
    >
      {isLoadingMore && (
        <div className="flex justify-center">
          <HashLoader color="#7c3aed" size={30} />
        </div>
      )}
      {Object.keys(groupedMessages).map((date, dateIndex) => (
        <div key={dateIndex}>
          <div className="text-center text-muted-foreground text-sm my-2">
            <Label className="bg-background/40 px-4 py-2 rounded-md text-foreground">
              {formatDateHeader(date)}
            </Label>
          </div>
          {groupedMessages[date].map((msg, msgIndex) => (
            <div
              key={msgIndex}
              className="flex gap-2 my-1"
              ref={msgIndex == 50 ? firstMessageRef : null}
            >
              <ContextMenu>
                <div
                  className={cn(
                    msg.senderId === user?.userId ? "" : " flex items-end",
                    "w-full flex items-end"
                  )}
                >
                  <div
                    className={cn(
                      msg.senderId === user?.userId ? " ml-auto " : "",
                      "flex items-end gap-2 "
                    )}
                  >
                    {msg.id === lastMessageReadId && (
                      <span className="text-muted-foreground text-[9px] mb-2">
                        Read
                      </span>
                    )}
                    {msg.type === "IMAGE" && (
                      <ContextMenuTrigger>
                        <ImageMessage content={msg.content} />
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
                            ? "flex  flex-col gap-2 rounded-lg px-3 py-2 text-sm   bg-primary text-primary-foreground"
                            : "flex  flex-col gap-2 rounded-lg px-3 py-2 text-sm  bg-muted"
                        )}
                      >
                        <div className="flex justify-between items-end gap-2">
                          <span>{msg.content}</span>
                        </div>
                      </ContextMenuTrigger>
                    )}
                  </div>

                  <span
                    className={cn(
                      "text-[9px] text-muted-foreground  py-1 ml-2 bg-background/30 rounded-md px-1"
                    )}
                  >
                    {format(new Date(msg.createdAt), "HH:mm")}
                  </span>
                </div>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <ReplyIcon size={16} className="mr-2" />
                    Reply
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <SmilePlusIcon size={16} className="mr-2" />
                    React
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <CopyIcon size={16} className="mr-2" />
                    Copy
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          ))}
        </div>
      ))}
      <div className="h-[125px]"></div>
    </div>
  );
};

export default ChatConversationHistory;
