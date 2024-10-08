import SubmitButton from "@/components/buttons/submit-button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/apiService";
import { ConversationType } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";

interface ChatBackgroundImagesProps {
  chatData: ConversationType;
  getChatData: () => Promise<void>;
}
const ChatBackgroundImages = ({
  chatData,
  getChatData,
}: ChatBackgroundImagesProps) => {
  const [select, setSelect] = useState<number>(chatData.backgroundImage);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.patch(`/chat-settings/${chatData.id}`, {
        backgroundImage: select,
      });

      toast({
        title: "Chat settings updated",
        description: "Chat settings have been updated successfully",
      });
      //Refresh the page
      getChatData();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error updating chat settings",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 p-6 w-3/4" onSubmit={handleSubmit}>
      <DialogTitle> Background images</DialogTitle>
      <div className="grid grid-cols-4 gap-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div
            key={item}
            className={cn(
              "w-28 h-28 bg-background border-[2px]  rounded-md flex items-center justify-center cursor-pointer relative",
              select === item ? "border-primary" : "border-muted "
            )}
            onClick={() => setSelect(item)}
            style={{
              backgroundImage: `url('${
                import.meta.env.VITE_S3_BUCKET_URL
              }/${item}.jpg')`,
              backgroundSize: "cover",
            }}
          >
            {select === item && (
              <div className="absolute bg-black/50 w-full h-full overflow-hidden rounded-md flex items-center justify-center ">
                <Label>Selected</Label>
              </div>
            )}
            {item === 0 && (
              <Label className="text-xs text-muted-foreground">Default</Label>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex w-full justify-end">
        <SubmitButton loading={loading}>Confirm</SubmitButton>
      </div>
    </form>
  );
};

export default ChatBackgroundImages;
