import NewChatFriendsList from "@/components/chatPanel/chat-conversation/new-chat-friends-list";
import NewChatGroup from "@/components/chatPanel/chat-conversation/new-chat-group";
import SearchFriends from "@/components/chatPanel/search-friends";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/apiService";
import { socketManager } from "@/lib/socket";
import { Friends } from "@/lib/types";
import { getUser } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NewChat = () => {
  const [friends, setFriends] = useState<Friends[]>([]);
  const [filterFriends, setFilterFriends] = useState<Friends[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [tab, setTab] = useState<string>("private");
  const [userSelected, setUserSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = getUser();
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const handleSwitchChatType = () => {
    setTab(tab === "private" ? "group" : "private");
  };

  const handleCreateChat = async (userId: string) => {
    try {
      const data = {
        usersId: [userId, user?.userId],
        type: "private",
      };
      socketManager.emit("create_chat", data);
    } catch (error) {
      console.error(`Error in handleCreateChat: ${error}`);
      toast({
        title: "Failed to create chat",
        description: "Please try again later",
      });
    }
  };

  const handleCreateChatGroup = async () => {
    if (groupName.trim() === "") {
      toast({
        title: "Group name is required",
      });
      return;
    }
    try {
      const data = {
        usersId: [user?.userId, ...userSelected],
        type: "group",
        groupName,
        creator: user,
      };
      socketManager.emit("create_chat", data);
    } catch (error) {
      console.error(`Error in handleCreateChat: ${error}`);
      toast({
        title: "Failed to create chat",
        description: "Please try again later",
      });
    }
  };

  useEffect(() => {
    socketManager.on("chat_created", (data) => {
      navigate(`/home/chat/${data.id}`);
    });

    return () => {
      socketManager.off("chat_created");
    };
  }, []);

  return (
    <div className="p-4 relative">
      <div className="flex justify-between items-center">
        <Label className="font-bold text-xl">
          New {tab === "private" ? "chat" : "group"}
        </Label>
        {tab === "private" ? (
          <Button onClick={handleSwitchChatType}>+ New Group</Button>
        ) : (
          <div className="flex justify-between gap-4">
            <Button variant={"secondary"} onClick={handleSwitchChatType}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateChatGroup}
              disabled={userSelected.length === 0}
            >
              Create group
            </Button>
          </div>
        )}
      </div>
      {tab === "group" && (
        <Input
          placeholder="Group's name"
          className="!mt-2"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      )}
      <SearchFriends
        setFilterFriends={setFilterFriends}
        friends={friends}
        className="mt-4"
      />
      {tab === "private" && (
        <NewChatFriendsList
          friends={filterFriends}
          loading={loading}
          handleCreateChat={handleCreateChat}
        />
      )}
      {tab === "group" && (
        <NewChatGroup
          friends={filterFriends}
          loading={loading}
          userSelected={userSelected}
          setUserSelected={setUserSelected}
        />
      )}
    </div>
  );
};

export default NewChat;
