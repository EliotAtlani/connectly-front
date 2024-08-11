import { Label } from "@/components/ui/label";
import { avatarList } from "@/data/avatar-list";
import { DisplayConversationHistory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import DefaultUserGroup from "@/assets/default-group-image.png";
import { PinIcon } from "lucide-react";

interface ConversationRowProps {
  conversationData: DisplayConversationHistory;
}

const ConversationsRow = ({ conversationData }: ConversationRowProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    conversationData.unreadMessageCount = 0;
    navigate(`/home/chat/${conversationData.chatId}`);
  };

  return (
    <div
      className="flex gap-4 hover:bg-muted rounded-sm px-2 py-2 w-full items-start"
      onClick={handleNavigate}
    >
      <img
        src={
          conversationData?.type === "PRIVATE"
            ? avatarList[conversationData.avatar as number]
            : (conversationData.avatar as string) ?? DefaultUserGroup
        }
        alt="avatar"
        className={cn(
          "w-12 h-12 rounded-full object-cover",
          !conversationData.avatar && "bg-white p-1"
        )}
      />

      <div className="flex flex-col gap-2 w-full min-w-0 h-full">
        <div className="flex justify-between gap-2">
          <Label className="font-bold">{conversationData.name}</Label>
          <Label
            className={cn(
              "font-light text-muted-foreground text-xs shrink-0",
              conversationData.unreadMessageCount > 0
                ? "text-primary font-medium"
                : ""
            )}
          >
            {conversationData.lastMessageDate &&
              format(new Date(conversationData.lastMessageDate), "HH:mm")}
          </Label>
        </div>

        <div className="flex items-center justify-between gap-2 w-full">
          <Label
            className={`font-light  text-ellipsis whitespace-nowrap max-w-[200px] overflow-hidden pb-1`}
          >
            {conversationData.isTyping?.length > 0 ? (
              <span className="text-xs text-muted-foreground italic">
                {conversationData.type === "GROUP"
                  ? conversationData.isTyping[0] + " is typing..."
                  : "is typing..."}
              </span>
            ) : (
              <>
                <span className="text-xs text-muted-foreground font-bold">
                  {conversationData.type === "GROUP" &&
                    conversationData.lastMessage?.type !== "SYSTEM" &&
                    conversationData.lastMessage?.sender?.username + ": "}
                </span>
                {["TEXT", "SYSTEM"].includes(conversationData.lastMessage?.type)
                  ? conversationData.lastMessage.content
                  : "Send an image"}
              </>
            )}
          </Label>

          {conversationData.unreadMessageCount > 0 && (
            <div className="rounded-full bg-primary text-primary-foreground w-4 h-4 flex justify-center items-center shrink-0">
              <span className="text-[9px]">
                {conversationData.unreadMessageCount}
              </span>
            </div>
          )}
          {conversationData.pinned && (
            <span className="text-muted-foreground">
              <PinIcon size={16} className="mr-2" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsRow;
