import FriendsHeader from "@/components/friendsPanel/friends-header";
import { Label } from "@/components/ui/label";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useNavigate } from "react-router-dom";
const FriendsLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
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
        defaultSize={30}
        minSize={30}
        maxSize={40}
        id="left-panel"
      >
        <div className="p-4 w-full h-full">
          <FriendsHeader />
          <div className="flex flex-col mt-4">
            <div
              className="flex gap-2   hover:bg-muted rounded-sm px-2 py-2 w-full items-start"
              onClick={() => navigate("/friends/1")}
            >
              <img
                src="https://via.placeholder.com/150"
                alt="profile"
                className="rounded-full w-12 h-12"
              />
              <div className="flex flex-col gap-2">
                <Label className="font-bold"> Name user</Label>
                <Label className="font-light text-xs"> Friends since</Label>
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="right-panel">{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default FriendsLayout;
