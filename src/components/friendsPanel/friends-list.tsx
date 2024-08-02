import { useNavigate } from "react-router-dom";
import { Label } from "../ui/label";
import { Friends } from "@/lib/types";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import { apiService } from "@/lib/apiService";
import { avatarList } from "@/data/avatar-list";
import HashLoader from "react-spinners/HashLoader";
import { format } from "date-fns";

const FriendsList = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friends[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = getUser();
  const { toast } = useToast();

  async function fetchFriendsList() {
    try {
      const response = await apiService.get(
        `/users/friends-list/${user?.userId}`
      );

      setFriends(response);
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
    fetchFriendsList();
  }, []);

  console.log(friends);

  return (
    <div className="flex flex-col mt-4">
      {loading ? (
        <div className="flex items-center justify-center mt-4">
          <HashLoader color="#7c3aed" size={30} />{" "}
        </div>
      ) : friends.length === 0 ? (
        <Label>No friends</Label>
      ) : (
        friends.map((friend, index) => (
          <div
            key={index}
            className="flex gap-2   hover:bg-muted rounded-sm px-2 py-2 w-full items-start"
            onClick={() => navigate(`/friends/${friend.userId}`)}
          >
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
        ))
      )}
    </div>
  );
};

export default FriendsList;
