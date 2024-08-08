import NewChatFriendsList from "@/components/chatPanel/chat-conversation/new-chat-friends-list";
import SearchFriends from "@/components/chatPanel/search-friends";

import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/apiService";
import { Friends } from "@/lib/types";
import { getUser } from "@/lib/utils";
import { useEffect, useState } from "react";

const NewChat = () => {
  const [friends, setFriends] = useState<Friends[]>([]);
  const [filterFriends, setFilterFriends] = useState<Friends[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = getUser();
  const { toast } = useToast();

  async function fetchFriendsRequest() {
    try {
      const response = await apiService.get(
        `/users/friends-list/${user?.userId}`
      );

      setFriends(response);
      setFilterFriends(response);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching friends request",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFriendsRequest();
  }, []);

  return (
    <div className="p-4">
      <Label className="font-bold text-xl">New chat</Label>
      <SearchFriends
        setFilterFriends={setFilterFriends}
        friends={friends}
        className="mt-4"
      />
      <NewChatFriendsList friends={filterFriends} loading={loading} />
    </div>
  );
};

export default NewChat;
