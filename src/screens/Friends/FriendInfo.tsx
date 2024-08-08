import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { avatarList } from "@/data/avatar-list";
import { apiService } from "@/lib/apiService";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

interface FriendsInfo {
  avatar: number;
  username: string;
  createdAt: string;
  last_ping: string;
  friendsNumber: number;
}
const FriendInfo = () => {
  const { friendId } = useParams();
  const [friendInfo, setFriendInfo] = useState<FriendsInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFriendInfo = async () => {
      try {
        const response = await apiService.get(`/users/friend-info/${friendId}`);
        setFriendInfo(response);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error fetching friend info",
          description: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFriendInfo();
  }, [friendId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-4">
        <HashLoader color="#7c3aed" size={30} />{" "}
      </div>
    );
  }

  if (!friendInfo) {
    return <Label>Friend not found</Label>;
  }
  return (
    <div className="px-8 py-4 w-full flex flex-col gap-2">
      <div className="flex gap-2   hover:bg-muted rounded-sm px-2 py-2 w-full items-start">
        <img
          src={avatarList[friendInfo.avatar]}
          alt="profile"
          className="rounded-full w-12 h-12"
        />
        <div className="flex flex-col gap-2">
          <Label className="font-bold"> {friendInfo.username}</Label>
          <Label className="font-light text-xs">
            {" "}
            Joined on {format(friendInfo.createdAt, "dd/MM/yyyy")}
          </Label>
        </div>
      </div>

      <Label className="font-bold mt-4 text-xl">Friend Info</Label>
      <div>
        <Label className="text-sm">{friendInfo.friendsNumber} friends</Label>
      </div>
    </div>
  );
};

export default FriendInfo;
