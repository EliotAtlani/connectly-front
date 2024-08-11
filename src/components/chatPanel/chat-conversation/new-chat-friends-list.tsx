import { Friends } from "@/lib/types";

import { avatarList } from "@/data/avatar-list";
import HashLoader from "react-spinners/HashLoader";
import { Label } from "@/components/ui/label";
import { ArrowRightIcon } from "lucide-react";
import { format } from "date-fns";

interface NewChatFriendsListProps {
  friends: Friends[];
  loading: boolean;
  handleCreateChat: (userId: string) => Promise<void>;
}

const NewChatFriendsList = ({
  friends,
  loading,
  handleCreateChat,
}: NewChatFriendsListProps) => {
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
            className="flex gap-2   hover:bg-muted rounded-sm px-2 py-2 w-full items-center justify-between cursor-pointer "
            onClick={() => handleCreateChat(friend.userId)}
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
            <button className="mr-4">
              <ArrowRightIcon size={22} className="text-muted-foreground" />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NewChatFriendsList;
