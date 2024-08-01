import React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ConversationColumn from "@/components/chatPanel/conversations-column/conversations-column";
import { socketManager } from "@/lib/socket";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const defaultLayout = [30, 48];

  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const initializeSocketConnection = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          socketManager.setToken(token);
          socketManager.connect();
        } catch (error) {
          console.error("Error initializing socket:", error);
        }
      }
    };

    initializeSocketConnection();
  }, [isAuthenticated, getAccessTokenSilently]);

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
      <ResizablePanel defaultSize={defaultLayout[0]} minSize={30} maxSize={40}>
        <ConversationColumn />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default HomeLayout;
