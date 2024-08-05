import React, { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileUpIcon, ImageUpIcon, PlusIcon, SmilePlusIcon } from "lucide-react";

interface ChatInputActionsProps {
  handleFilesSelected: (selectedFile: File[]) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ChatInputActions: React.FC<ChatInputActionsProps> = ({
  handleFilesSelected,
  fileInputRef,
}) => {
  const handleFiles = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files: File[] = Array.from(event.target.files || []);

      handleFilesSelected(files);
    },
    [handleFilesSelected]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full bg-primary w-10 flex items-center justify-center hover:bg-primary/70 transition duration-300 cursor-pointer">
        <PlusIcon size={20} color="white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer"
        >
          <ImageUpIcon size={18} className="mr-2" />
          Photos
        </DropdownMenuItem>
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
  );
};

export default ChatInputActions;
