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

interface ImageShowProps {
  content: string;
  width?: string;
  height?: string;
}
const ImageShow = ({
  content,
  width = "max-w-44",
  height = "max-w-44",
}: ImageShowProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiService.post(`/upload-image/download`, {
        url: content,
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
      <DialogTrigger className={cn("my-2 flex flex-col  justify-center gap-1")}>
        <img
          src={content}
          alt="message"
          className={cn(" object-cover rounded-md", width, height)}
        />
      </DialogTrigger>
      <DialogContent className="p-0 m-0 bg-transparent border-none w-auto ">
        <DialogTitle>Image</DialogTitle>
        <img src={content} alt="message" className="rounded-md mx-auto" />
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

export default ImageShow;
