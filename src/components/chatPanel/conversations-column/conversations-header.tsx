import { Label } from "@/components/ui/label";

import { SquarePenIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ConversationsHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-start pr-4">
      <div className="flex flex-col gap-2">
        <Label className="text-xl font-bold">Chats</Label>
        <Label className="text-muted-foreground font-light">Recent chats</Label>
      </div>
      <button className="mt-1" onClick={() => navigate("/home/new-chat")}>
        <SquarePenIcon size={22} className="text-muted-foreground" />
      </button>
    </div>
  );
};

export default ConversationsHeader;
