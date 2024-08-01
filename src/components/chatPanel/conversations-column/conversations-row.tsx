import { Label } from "@/components/ui/label";
import { avatarList } from "@/data/avatar-list";
import { DisplayConversationHistory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
interface ConversationRowProps {
  nbOfNewMessages: number;
  conversationData: DisplayConversationHistory;
}

const ConversationsRow = ({
  nbOfNewMessages,
  conversationData,
}: ConversationRowProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex gap-2 hover:bg-muted rounded-sm px-2 py-2 w-full items-start"
      onClick={() => navigate(`/home/chat/${conversationData.chatId}`)}
    >
      <img
        src={avatarList[conversationData.avatar]}
        alt="avatar"
        className="w-12 h-12 rounded-full"
      />

      <div className="flex flex-col gap-2 w-full min-w-0 h-full">
        <div className="flex justify-between gap-2">
          <Label className="font-bold">{conversationData.name}</Label>
          <Label
            className={cn(
              "font-light text-muted-foreground text-xs shrink-0",
              nbOfNewMessages > 0 ? "text-primary font-medium" : ""
            )}
          >
            {format(new Date(conversationData.lastMessageDate), "HH:mm")}
          </Label>
        </div>

        <div className="flex items-center justify-between gap-2 w-full">
          <Label
            className={`font-light  text-ellipsis whitespace-nowrap max-w-[200px]`}
          >
            {conversationData.lastMessage}
          </Label>

          {nbOfNewMessages > 0 && (
            <div className="rounded-full bg-primary text-primary-foreground w-4 h-4 flex justify-center items-center shrink-0">
              <span className="text-[9px]">{nbOfNewMessages}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsRow;
