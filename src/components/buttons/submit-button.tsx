import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import HashLoader from "react-spinners/HashLoader";

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  loading: boolean;
}
const SubmitButton = ({ className, children, loading }: SubmitButtonProps) => {
  return (
    <Button className={cn(className, "")}>
      {loading ? <HashLoader color="white" size={10} /> : children}
    </Button>
  );
};

export default SubmitButton;
