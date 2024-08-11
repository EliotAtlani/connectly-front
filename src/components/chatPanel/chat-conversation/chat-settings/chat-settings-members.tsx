import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { avatarList } from "@/data/avatar-list";
import { apiService } from "@/lib/apiService";
import { ConversationType, Friends } from "@/lib/types";
import { cn, getUser } from "@/lib/utils";
import { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ChatSettingsAddMembers from "./chat-settings-add-member";
import { socketManager } from "@/lib/socket";

interface ChatSettingsMembersProps {
  chatData: ConversationType;
}
const ChatSettingsMembers = ({ chatData }: ChatSettingsMembersProps) => {
  const user = getUser();
  const [members, setMembers] = useState<Friends[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await apiService.get(`/chat-users/${chatData.id}`);

        setMembers(response);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error fetching users",
          description: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [chatData.id]);

  const handleAddMember = async (userAdded: Friends) => {
    try {
      socketManager.emit("add_member", {
        chatId: chatData.id,
        user: user,
        userAdded,
      });
      setMembers((prevMembers) => [...prevMembers, userAdded]);
      toast({
        title: "Member added",
      });
    } catch (error) {
      console.error(`Error in handleAddMember: ${error}`);
      toast({
        title: "Failed to add member",
      });
    }
  };
  return (
    <div className="p-6 w-3/4 mr-4">
      <div className="flex items-center justify-between ">
        <DialogTitle>Members</DialogTitle>
        {chatData.type === "GROUP" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button>Add Member</Button>
            </PopoverTrigger>
            <PopoverContent>
              <ChatSettingsAddMembers
                handleAddMember={handleAddMember}
                chatData={chatData}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
      {loading ? (
        <div>
          <HashLoader color={"#123abc"} size={50} />
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-4 bg-muted w-full rounded-md ">
          {members.map((member, index) => (
            <div
              key={member.userId}
              className={cn(
                "flex items-center justify-between border-b-[1px] border-muted-foreground/20 pb-2",
                index === members.length - 1 && "border-none",
                index === 0 && "pt-2"
              )}
            >
              <div className="flex items-center px-2 gap-2">
                <img
                  src={avatarList[member.avatar]}
                  alt={member.username}
                  className="w-8 h-8 rounded-full"
                />
                <Label className="ml-2">
                  {member.username === user?.username ? "you" : member.username}
                </Label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatSettingsMembers;
