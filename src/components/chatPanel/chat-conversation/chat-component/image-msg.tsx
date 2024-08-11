import React, { useState } from "react";
import SubmitButton from "@/components/buttons/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/apiService";
import { DialogClose } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { ChatType, UserData } from "@/lib/types";
import { format } from "date-fns";

interface ImageMessageProps {
  msg: ChatType;
  user: UserData | null;
  width?: string;
  height?: string;
}
const ImageMessage = ({
  msg,
  user,
  width = "w-44",
  height = "h-44",
}: ImageMessageProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiService.post(`/upload-image/download`, {
        url: msg.content,
      });

      if (response && response.url) {
        // Create a temporary anchor element
        const link = document.createElement("a");
        link.href = response.url;
        link.target = "_blank"; // Open in a new tab
        link.download = "downloaded_image.jpg"; // Suggest a filename

        // Append to the document, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Download initiated",
          description:
            "If the download doesn't start automatically, check your browser settings.",
        });
      } else {
        throw new Error("No URL in response");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error initiating download",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "my-2 flex flex-col  justify-center gap-1",
          msg.senderId === user?.userId ? "items-end" : "items-start"
        )}
      >
        <img
          src={msg.content}
          alt="message"
          className={cn(" object-cover rounded-md", width, height)}
        />
        <span
          className={cn(
            "text-[9px] text-muted-foreground bg-background/50 p-1 rounded-md "
          )}
        >
          {format(new Date(msg.createdAt), "HH:mm")}
        </span>
      </DialogTrigger>
      <DialogContent className="p-0 m-0 bg-transparent border-none w-auto ">
        <DialogTitle>Image</DialogTitle>
        <img src={msg.content} alt="message" className="rounded-md mx-auto" />
        <form
          className="flex justify-between items-center gap-10 mt-2"
          onSubmit={handleDownload}
        >
          <DialogClose className="w-full" type="button">
            <Button className="w-full mx-auto" type="button">
              Close
            </Button>
          </DialogClose>
          <SubmitButton className="w-full mx-auto" loading={loading}>
            Download
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ImageMessage;
