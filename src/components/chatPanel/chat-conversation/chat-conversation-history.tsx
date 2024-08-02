import { ChatType } from "@/lib/types";
import { cn, getUser } from "@/lib/utils";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { useEffect, useRef } from "react";

interface ChatConversationHistoryProps {
  messages: ChatType[];
  lastMessageReadId: string;
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
}: ChatConversationHistoryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = getUser();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto px-10 py-4 space-y-2"
    >
      {Object.keys(groupedMessages).map((date, dateIndex) => (
        <div key={dateIndex}>
          <div className="text-center text-muted-foreground text-sm my-2">
            {formatDateHeader(date)}
          </div>
          {groupedMessages[date].map((msg, msgIndex) => (
            <div key={msgIndex} className="flex gap-2">
              <div
                className={cn(
                  msg.senderId === user?.userId ? "" : " flex items-end",
                  "w-full flex items-end"
                )}
              >
                <div
                  className={cn(
                    msg.senderId === user?.userId ? " ml-auto " : "",
                    "flex items-end gap-2"
                  )}
                >
                  {msg.id === lastMessageReadId && (
                    <span className="text-muted-foreground text-[9px] mb-2">
                      Read
                    </span>
                  )}
                  <div
                    className={cn(
                      msg.senderId === user?.userId
                        ? "flex  flex-col gap-2 rounded-lg px-3 py-2 text-sm my-1  bg-primary text-primary-foreground"
                        : "flex  flex-col gap-2 rounded-lg px-3 py-2 text-sm my-1 bg-muted"
                    )}
                  >
                    <div className="flex justify-between items-end gap-2">
                      <span>{msg.content}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={cn("text-[9px] text-muted-foreground  pb-2 ml-2")}
                >
                  {format(new Date(msg.createdAt), "HH:mm")}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className="h-[125px]"></div>
    </div>
  );
};

export default ChatConversationHistory;
