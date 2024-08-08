import { Label } from "@/components/ui/label";
import { ChatType, UserData } from "@/lib/types";

interface ChatReplyProps {
  msg: ChatType;
  scrollToMessage: (id: string) => void;
  user: UserData | null;
}
const ChatReply = ({ msg, scrollToMessage, user }: ChatReplyProps) => {
  if (!msg.replyTo) return null;
  return (
    <div
      className="flex flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-background/70"
      onClick={() => scrollToMessage(msg.replyTo!.id)}
    >
      <div className="flex justify-between items-end gap-2">
        <Label className="text-muted-foreground">
          {msg.replyTo.senderId === user?.userId
            ? "You"
            : msg.replyTo.senderName}
        </Label>
      </div>

      <div className="flex items-center gap-2 ">
        {msg.replyTo.type === "TEXT" && (
          <Label className="font-light text-sm">{msg.replyTo.content}</Label>
        )}

        {msg.replyTo.type === "IMAGE" && (
          <>
            <img
              src={msg.replyTo.content}
              alt="reply"
              className="w-20 h-20 object-cover rounded-md"
            />
          </>
        )}
        {msg.replyTo.type === "LOCAL_IMAGE" && (
          <img
            src={URL.createObjectURL(msg.replyTo.file as File)}
            alt="reply"
            className="w-20 h-20 object-cover rounded-md"
          />
        )}
      </div>
    </div>
  );
};

export default ChatReply;
