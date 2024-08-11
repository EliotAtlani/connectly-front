import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/apiService";
import { ConversationType, Friends } from "@/lib/types";
import { getUser } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import SearchFriends from "../../search-friends";
import { avatarList } from "@/data/avatar-list";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface ChatSettingsAddMembersProps {
  handleAddMember: (user: Friends) => Promise<void>;
  chatData: ConversationType;
}
const ChatSettingsAddMembers = ({
  handleAddMember,
  chatData,
}: ChatSettingsAddMembersProps) => {
  const { toast } = useToast();

  const [friends, setFriends] = useState<Friends[]>([]);
  const [filterFriends, setFilterFriends] = useState<Friends[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = getUser();
  async function fetchFriendsRequest() {
    try {
      const response = await apiService.get(
        `/users/friends-list/${user?.userId}/chat/${chatData.id}`
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
    <div className="w-full">
      <Label> Friends List</Label>
      <SearchFriends
        setFilterFriends={setFilterFriends}
        friends={friends}
        className="mt-4"
      />
      <div className="flex flex-col mt-4">
        {loading ? (
          <div className="flex items-center justify-center mt-4">
            <HashLoader color="#7c3aed" size={30} />{" "}
          </div>
        ) : filterFriends.length === 0 ? (
          <Label>No friends</Label>
        ) : (
          filterFriends.map((friend, index) => (
            <div
              key={index}
              className="flex gap-8   hover:bg-muted rounded-sm px-2 py-2 w-full items-center justify-between cursor-pointer  "
            >
              <div className="flex gap-4 items-start">
                <img
                  src={avatarList[friend.avatar]}
                  alt="profile"
                  className="rounded-full w-12 h-12"
                />
                <div className="flex flex-col gap-2">
                  <Label className="font-bold"> {friend.username}</Label>
                  <Label className="font-light text-xs">
                    {" "}
                    Friends since {format(friend.createdAt, "dd/MM/yyyy")}
                  </Label>
                </div>
              </div>
              <Button onClick={() => handleAddMember(friend)}>Add</Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ChatSettingsAddMembers;
