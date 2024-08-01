import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiService } from "@/lib/apiService";
import { socketManager } from "@/lib/socket";
import { DisplayConversationHistory } from "@/lib/types";
import { getUser } from "@/lib/utils";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import ConversationsRow from "./conversations-row";

const ConversationsHistory = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [conversations, setConversations] = useState<
    DisplayConversationHistory[]
  >([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { isAuthenticated } = useAuth0();
  const user = getUser();

  useEffect(() => {
    const initializeSocketConnection = async () => {
      if (isAuthenticated) {
        try {
          socketManager.connect();
          setIsConnected(true);
        } catch (error) {
          console.error("Error initializing socket:", error);
        }
      }
    };

    initializeSocketConnection();
  }, [isAuthenticated]);

  useEffect(() => {
    async function getChatData() {
      try {
        const response = await apiService.get(
          `/chat-conversations/${user?.userId}`
        );
        console.log("NAIN", response);
        setConversations(response);
      } catch (error) {
        console.error(`Error in getChatData: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    getChatData();
  }, []);

  useEffect(() => {
    if (isConnected) {
      socketManager.on("refresh_conversation", (data) => {
        //find the conversation and update it
        const updatedConversations = conversations.map((conversation) => {
          if (conversation.chatId === data.chatId) {
            return {
              ...conversation,
              lastMessage: data.content,
              lastMessageDate: data.date,
            };
          }
          return conversation;
        });
        //Order by last message date
        updatedConversations.sort((a, b) => {
          return (
            new Date(b.lastMessageDate).getTime() -
            new Date(a.lastMessageDate).getTime()
          );
        });

        setConversations(updatedConversations);
      });
    }

    return () => {
      if (isConnected) {
        socketManager.off("refresh_conversation");
      }
    };
  }, [setIsConnected, isConnected, conversations]);

  return (
    <ScrollArea className="h-screen pr-4 w-full">
      <div className="flex flex-col pt-0 w-full">
        {loading ? (
          <div className="flex items-center justify-center mt-4"></div>
        ) : conversations.length === 0 ? (
          <Label>No conversations for the moment</Label>
        ) : (
          conversations.map((conversation, index) => (
            <ConversationsRow
              nbOfNewMessages={0}
              conversationData={conversation}
              key={index}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default ConversationsHistory;
