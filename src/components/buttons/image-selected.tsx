import React from "react";
import { cn } from "@/lib/utils";

const ImageSelected = ({
  selected,
  href,
  alt,
  className,
}: {
  selected: boolean;
  href: string;
  alt: string;
  className?: string;
}) => {
  return (
    <div className="relative w-14 h-14">
      <img
        src={href}
        alt={alt}
        className={cn(
          className,
          "w-full h-full object-cover rounded-full cursor-pointer hover:scale-110 transition-transform",
          selected ? "border-[3px] border-primary" : ""
        )}
      />
    </div>
  );
};

export default ImageSelected;
