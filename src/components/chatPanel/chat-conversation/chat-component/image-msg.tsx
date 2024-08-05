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

const ImageMessage = ({ content }: { content: string }) => {
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
      <DialogTrigger className="w-44 h-44 my-2 flex items-center justify-center">
        <img
          src={content}
          alt="message"
          className="max-w-44 max-h-44 object-cover rounded-md"
        />
      </DialogTrigger>
      <DialogContent className="p-0 m-0 bg-transparent border-none">
        <DialogTitle>Image</DialogTitle>
        <img src={content} alt="message" className="rounded-md" />
        <form
          className="flex justify-between items-center gap-10 mt-2"
          onSubmit={handleDownload}
        >
          <DialogClose className="w-full">
            <Button className="w-full mx-auto">Close</Button>
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
