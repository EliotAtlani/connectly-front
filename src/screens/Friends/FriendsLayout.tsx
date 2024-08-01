import FriendsColumn from "@/components/friendsPanel/friends-column";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const FriendsLayout = ({ children }: { children: React.ReactNode }) => {
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
        defaultSize={40}
        minSize={30}
        maxSize={50}
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
