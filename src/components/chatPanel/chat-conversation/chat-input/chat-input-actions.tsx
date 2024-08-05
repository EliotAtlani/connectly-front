import React, { useCallback, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileUpIcon, ImageUpIcon, PlusIcon, SmilePlusIcon } from "lucide-react";
import Webcam from "react-webcam";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ChatInputActionsProps {
  handleFilesSelected: (selectedFile: File[]) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ChatInputActions: React.FC<ChatInputActionsProps> = ({
  handleFilesSelected,
  fileInputRef,
}) => {
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleFiles = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files: File[] = Array.from(event.target.files || []);

      handleFilesSelected(files);
    },
    [handleFilesSelected]
  );

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "webcam-photo.jpg", {
            type: "image/jpeg",
          });
          handleFilesSelected([file]);
          setShowWebcam(false); // Hide webcam after capturing
        });
    }
  }, [handleFilesSelected]);

  return (
    <>
      <Dialog open={showWebcam}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className=" rounded-md "
            />
            <div className="h-[10px]" />
            <div className="flex justify-evenly mt-8 gap-8">
              <Button onClick={() => setShowWebcam(false)} className="w-full">
                Cancel
              </Button>
              <Button onClick={handleCapture} className="w-full">
                Capture
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full bg-primary w-10 flex items-center justify-center hover:bg-primary/70 transition duration-300 cursor-pointer">
            <PlusIcon size={20} color="white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ImageUpIcon size={18} className="mr-2" />
                Photos
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer"
                  >
                    From computer
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowWebcam(true)}
                    className="cursor-pointer"
                  >
                    From webcam
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem>
              <FileUpIcon size={18} className="mr-2" />
              File
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SmilePlusIcon size={18} className="mr-2" />
              Emojis
            </DropdownMenuItem>
          </DropdownMenuContent>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFiles}
            accept="image/*"
            multiple
          />
        </DropdownMenu>
      </Dialog>
    </>
  );
};

export default ChatInputActions;
