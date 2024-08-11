import { useToast } from "@/components/ui/use-toast";
import { socketManager } from "@/lib/socket";
import { ConversationType } from "@/lib/types";
import { cn, getUser } from "@/lib/utils";
import React, { useState } from "react";
import DefaultUserGroup from "@/assets/default-group-image.png";
import { avatarList } from "@/data/avatar-list";
import { UploadIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ChatBasicSettingsProps {
  chatData: ConversationType;
  getChatData: () => Promise<void>;
}
const ChatBasicSettings = ({
  chatData,
  getChatData,
}: ChatBasicSettingsProps) => {
  const user = getUser();

  const [groupName, setGroupName] = useState<string>(chatData.name ?? "");
  const { toast } = useToast();
  const [newImage, setNewImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      socketManager.emit("changeGroupImage", {
        chatId: chatData.id,
        image: file,
        user,
      });
      toast({
        title: "Group image updated",
        description: "Group image has been updated successfully",
      });
      getChatData();
    }
  };

  const handleChangeName = async () => {
    if (groupName.trim() === "") {
      toast({
        title: "Group name cannot be empty",
        description: "Please enter a group name",
      });
      return;
    }
    try {
      socketManager.emit("changeGroupName", {
        chatId: chatData.id,
        name: groupName,
        user,
      });

      toast({
        title: "Group name updated",
        description: "Group name has been updated successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error updating chat settings",
        description: "Please try again later",
      });
    }
  };
  return (
    <div className="w-3/4 flex justify-center flex-col items-center">
      <div className="relative group">
        <img
          src={
            chatData.type === "GROUP"
              ? newImage
                ? URL.createObjectURL(newImage)
                : chatData.image ?? DefaultUserGroup
              : avatarList[chatData.data.avatar]
          }
          alt="avatar"
          className={cn(
            "w-44 h-44 rounded-full object-cover",
            chatData.type === "GROUP" && !chatData.image && "bg-white p-1"
          )}
        />
        {chatData.type === "GROUP" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cur">
            <label
              htmlFor="file-upload"
              className="w-full  h-full flex items-center justify-center cursor-pointer text-white py-2 px-4 rounded"
            >
              <UploadIcon size={24} />
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden "
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        )}
      </div>
      {chatData.type === "GROUP" ? (
        <div className="mt-4 flex gap-4">
          <Input
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Button
            disabled={groupName.trim() === ""}
            onClick={handleChangeName}
            type="button"
          >
            Save
          </Button>
        </div>
      ) : (
        <Label className="font-bold mt-4 text-2xl ">{chatData.data.name}</Label>
      )}
    </div>
  );
};

export default ChatBasicSettings;
