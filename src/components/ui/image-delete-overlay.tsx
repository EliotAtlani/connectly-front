import React, { useState } from "react";
import { XCircleIcon } from "lucide-react";

interface ImageWithOverlayProps {
  files: File[];
  setFile: React.Dispatch<React.SetStateAction<File[]>>;
}

const ImageWithOverlay: React.FC<ImageWithOverlayProps> = ({
  files,
  setFile,
}) => {
  const [isHovering, setIsHovering] = useState<number | null>(null);

  return (
    <div className="absolute bottom-12 rounded-md flex gap-2">
      {files.map((file, index) => (
        <div
          className="relative  w-14 h-14"
          key={index}
          onMouseEnter={() => setIsHovering(index)}
          onMouseLeave={() => setIsHovering(null)}
        >
          {isHovering === index && (
            <div className="absolute top-0 right-0 w-full h-full bg-black/50 rounded-md flex items-center justify-center">
              <XCircleIcon
                size={20}
                className="text-white cursor-pointer"
                onClick={() =>
                  setFile((prev) => prev.filter((_, i) => i !== index))
                }
              />
            </div>
          )}
          <img
            src={URL.createObjectURL(file)}
            alt="file"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageWithOverlay;
