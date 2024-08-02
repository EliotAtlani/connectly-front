import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/lib/utils";

import Navbar from "@/components/chatPanel/navbar/navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (!user.isOnBoarded) {
      navigate("/onboarding");
    }
  }, [user, navigate]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card className="w-4/5 h-[95%] md:h-4/5 flex md:flex-row flex-col">
        <div className="md:w-[60px]  w-full md:h-full h-[60px]">
          <Navbar />
        </div>
        {children}
      </Card>
    </div>
  );
};

export default MainLayout;
