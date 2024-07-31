import React from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/lib/utils";

import Navbar from "@/components/chatPanel/navbar/navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const user = getUser();

  if (!user) {
    navigate("/");
    return null;
  }
  if (!user.isOnBoarded) {
    navigate("/onboarding");
    return null;
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card className="w-4/5 h-4/5 flex ">
        <div className="w-[60px] h-full">
          <Navbar />
        </div>
        {children}
      </Card>
    </div>
  );
};

export default MainLayout;
