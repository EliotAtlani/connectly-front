import React, { useState, useEffect } from "react";
import FriendsColumn from "@/components/friendsPanel/friends-column";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const FriendsLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640); // Adjust this value as needed
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <ResizablePanelGroup
      direction={isSmallScreen ? "vertical" : "horizontal"}
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-full max-h-[800px] items-stretch"
    >
      <ResizablePanel
        defaultSize={40}
        minSize={isSmallScreen ? 20 : 30}
        maxSize={isSmallScreen ? 60 : 50}
        id="left-panel"
      >
        <FriendsColumn />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="right-panel">{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default FriendsLayout;
