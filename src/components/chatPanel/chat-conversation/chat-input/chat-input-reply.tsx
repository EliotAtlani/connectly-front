import { Label } from "@/components/ui/label";
import { ChatType } from "@/lib/types";
import { getUser } from "@/lib/utils";
import { CameraIcon, XIcon } from "lucide-react";

interface ChatInputReplyProps {
  replyMessage: ChatType;
  setReplyMessage: React.Dispatch<React.SetStateAction<ChatType | null>>;
}

const ChatInputReply = ({
  replyMessage,
  setReplyMessage,
}: ChatInputReplyProps) => {
  const user = getUser();
  return (
    <div className="absolute bottom-11 w-full bg-muted/80  px-4 py-3 rounded-md flex justify-between ">
      <div className="flex  w-full items-center gap-2">
        <div
          className="w-1 bg-primary rounded-full"
          style={{ height: "100%" }}
        ></div>
        <div className="flex gap-2 flex-col overflow-hidden">
          <div className="flex items-center">
            <Label>
              {replyMessage.sender.username === user?.username
                ? "You"
                : replyMessage.sender.username}
            </Label>
          </div>
          <div className="flex items-center overflow-hidden">
            <Label className="text-muted-foreground text-xs whitespace-nowrap ">
              {replyMessage.type === "TEXT" ? (
                replyMessage.content
              ) : (
                <div className="flex gap-2">
                  <CameraIcon size={16} />
                  Photo
                </div>
              )}
            </Label>
          </div>
        </div>
      </div>
      <div className="flex items-center pl-2 gap-4">
        {replyMessage.type === "IMAGE" && (
          <img
            src={replyMessage.content}
            alt="reply"
            className="w-12 h-12 object-cover rounded-md"
          />
        )}{" "}
        {replyMessage.type === "LOCAL_IMAGE" && (
          <img
            src={URL.createObjectURL(replyMessage.file as File)}
            alt="reply"
            className="w-12 h-12 object-cover rounded-md"
          />
        )}
        <XIcon
          size={24}
          className="cursor-pointer bg-muted rounded-full p-1"
          onClick={() => setReplyMessage(null)}
        />
      </div>
    </div>
  );
};

export default ChatInputReply;
