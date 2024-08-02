import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/apiService";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

const FriendInfo = () => {
  const { friendId } = useParams();
  const [friendInfo, setFriendInfo] = useState([]);
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
      }
    };

    fetchFriendInfo();
  }, [friendId]);

  console.log(friendInfo);
  return (
    <div className="px-8 py-4 w-full">
      <div className="flex flex-col gap-2">
        <Label className="text-xl font-bold">Add a friend </Label>
        <Label className="font-light text-muted-foreground ">
          Type your friend's username to add him
        </Label>
      </div>
    </div>
  );
};

export default FriendInfo;
