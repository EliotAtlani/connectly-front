import { UserPlusIcon } from "lucide-react";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";

const FriendsHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-start pr-4">
      <div className="flex flex-col gap-2">
        <Label className="text-xl font-bold">Friends</Label>
        <Label className="text-muted-foreground font-light">
          Here's the list of your friends
        </Label>
      </div>
      <button className="mt-1" onClick={() => navigate("/friends/add")}>
        <UserPlusIcon size={22} className="text-muted-foreground" />
      </button>
    </div>
  );
};

export default FriendsHeader;
