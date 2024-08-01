import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/apiService";
import { getUser } from "@/lib/utils";
import { avatarList } from "@/data/avatar-list";
import { FriendRequest } from "@/lib/types";
import { CheckIcon, XIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";

const FriendsRequest = () => {
  const [friendsRequest, setFriendsRequest] = useState<FriendRequest[]>([]);
  const user = getUser();
  const { toast } = useToast();

  async function fetchFriendsRequest() {
    try {
      const response = await apiService.get(
        `/users/friends-request/${user?.userId}`
      );

      setFriendsRequest(response);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching friends request",
        description: "Please try again later",
      });
    }
  }

  useEffect(() => {
    fetchFriendsRequest();
  }, []);

  const handleAccept = async (friend: FriendRequest) => {
    try {
      await apiService.post("/users/accept-friend", {
        userId: user?.userId,
        senderId: friend.senderId,
      });

      toast({
        title: "Friend request accepted",
      });
      fetchFriendsRequest();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error accepting friend request",
      });
    }
  };

  return (
    <div className="flex flex-col mt-4">
      {friendsRequest.length === 0 && <Label>No friends request</Label>}

      {friendsRequest.map((friend, index) => (
        <div
          className="flex gap-2    px-2 py-2 w-full items-center justify-between"
          key={index}
        >
          <div className="flex gap-2">
            <img
              src={avatarList[friend.sender.avatar]}
              alt="profile"
              className="rounded-full w-12 h-12"
            />
            <div className="flex flex-col gap-2">
              <Label className="font-bold"> {friend.sender.username}</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-muted p-1 rounded-full"
              onClick={() => handleAccept(friend)}
            >
              <CheckIcon size={18} />
            </button>
            <button className="bg-muted p-1 rounded-full text-red-500">
              <XIcon size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsRequest;
