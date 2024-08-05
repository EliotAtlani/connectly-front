import React, { useState } from "react";
import SubmitButton from "@/components/buttons/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

const ImageMessage = ({ file }: { file: File }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    //Download file from client directly
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "downloaded_image.jpg";
    link.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger className="w-44 h-44 my-2 flex items-center justify-center">
        <img
          src={URL.createObjectURL(file)}
          alt="message"
          className="max-w-44 max-h-44 object-cover rounded-md"
        />
      </DialogTrigger>
      <DialogContent className="p-0 m-0 bg-transparent border-none w-auto ">
        <DialogTitle>Image</DialogTitle>
        <img
          src={URL.createObjectURL(file)}
          alt="message"
          className="rounded-md mx-auto"
        />
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
