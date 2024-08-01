import NewChatFriendsList from "@/components/chatPanel/chat-conversation/new-chat-friends-list";

import { Label } from "@/components/ui/label";

const NewChat = () => {
  return (
    <div className="p-4">
      <Label className="font-bold text-xl">New chat</Label>
      <NewChatFriendsList />
    </div>
  );
};

export default NewChat;
