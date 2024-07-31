import React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ConversationColumn from "@/components/chatPanel/conversations-column/conversations-column";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const defaultLayout = [30, 48];

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-full max-h-[800px] items-stretch "
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        minSize={30}
        maxSize={40}
        id="left-panel"
      >
        <ConversationColumn />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="right-panel">{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default HomeLayout;
