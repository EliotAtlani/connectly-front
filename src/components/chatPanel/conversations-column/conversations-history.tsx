/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiService } from "@/lib/apiService";
import { socketManager } from "@/lib/socket";
import { DisplayConversationHistory } from "@/lib/types";
import { getUser } from "@/lib/utils";
import { useAuth0 } from "@auth0/auth0-react";
import ConversationsRow from "./conversations-row";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PinIcon, PinOffIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ConversationsHistory: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [conversations, setConversations] = useState<
    DisplayConversationHistory[]
  >([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { isAuthenticated } = useAuth0();
  const user = getUser();

  const updateConversation = useCallback(
    (data: any) => {
      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) => {
          if (conversation.chatId === data.chatId) {
            return {
              ...conversation,
              name: data.name ?? conversation.name,
              avatar: data.avatar ?? conversation.avatar,
              lastMessage: data.content,
              lastMessageDate: data.date,
              unreadMessageCount:
                !data.is_other_in_room && data.from_user_id !== user?.userId
                  ? conversation.unreadMessageCount + 1
                  : 0,
            };
          }
          return conversation;
        });

        // Sort conversations by pinned status and last message date
        updatedConversations.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return (
            new Date(b.lastMessageDate).getTime() -
            new Date(a.lastMessageDate).getTime()
          );
        });

        return updatedConversations;
      });
    },
    [user?.userId]
  );

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
        setConversations(response);
      } catch (error) {
        console.error(`Error in getChatData: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    getChatData();
  }, [user?.userId]);

  useEffect(() => {
    if (isConnected) {
      socketManager.on("refresh_conversation", updateConversation);
      socketManager.on("add_conversation", (data) => {
        setConversations((prevConversations) => [
          {
            chatId: data.chatId,
            name: data.name,
            avatar: data.avatar,
            type: data.type,
            lastMessage: data.content,
            lastMessageDate: data.date,
            unreadMessageCount: 0,
            isTyping: [],
            pinned: data.isPinned || false, // Handle pinned status if available
            isPinned: data.isPinned || false, // Handle pinned status if available
          },
          ...prevConversations,
        ]);
      });

      socketManager.on("user_typing_conv", (data) => {
        if (data.userId === user?.userId) return;
        setConversations((prevConversations) =>
          prevConversations.map((conversation) =>
            conversation.chatId === data.chatId
              ? {
                  ...conversation,
                  isTyping: !conversation.isTyping.includes(data.username)
                    ? [...conversation.isTyping, data.username]
                    : conversation.isTyping,
                }
              : conversation
          )
        );
      });

      socketManager.on("user_stop_typing_conv", (data) => {
        if (data.userId === user?.userId) return;
        setConversations((prevConversations) =>
          prevConversations.map((conversation) =>
            conversation.chatId === data.chatId
              ? {
                  ...conversation,
                  isTyping: conversation.isTyping.filter(
                    (username) => username !== data.username
                  ),
                }
              : conversation
          )
        );
      });
    }

    return () => {
      if (isConnected) {
        socketManager.off("refresh_conversation", updateConversation);
        socketManager.off("user_typing_conv");
        socketManager.off("user_stop_typing_conv");
      }
    };
  }, [isConnected, updateConversation, user?.userId]);

  const handlePinConversation = (chatId: string, pinned: boolean) => {
    try {
      if (pinned) {
        apiService.post(`/chat-conversations/unpin/${user?.userId}/${chatId}`);

        //Sort
        setConversations((prevConversations) => {
          const updatedConversations = prevConversations.map((conversation) => {
            if (conversation.chatId === chatId) {
              return {
                ...conversation,
                pinned: !conversation.pinned,
              };
            }
            return conversation;
          });

          // Sort conversations by pinned status and last message date
          updatedConversations.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return (
              new Date(b.lastMessageDate).getTime() -
              new Date(a.lastMessageDate).getTime()
            );
          });

          return updatedConversations;
        });

        toast({
          title: "Conversation unpinned",
        });
      } else {
        apiService.post(`/chat-conversations/pin/${user?.userId}/${chatId}`);

        //Sort
        setConversations((prevConversations) => {
          const updatedConversations = prevConversations.map((conversation) => {
            if (conversation.chatId === chatId) {
              return {
                ...conversation,
                pinned: !conversation.pinned,
              };
            }
            return conversation;
          });

          // Sort conversations by pinned status and last message date
          updatedConversations.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return (
              new Date(b.lastMessageDate).getTime() -
              new Date(a.lastMessageDate).getTime()
            );
          });

          return updatedConversations;
        });

        toast({
          title: "Conversation pinned",
        });
      }
    } catch (error) {
      console.error(`Error in handlePinConversation: ${error}`);
    }
  };

  console.log(conversations);
  return (
    <ScrollArea className="h-screen w-full">
      <div className="flex flex-col pt-0 w-full">
        {loading ? (
          <div className="flex items-center justify-center mt-4"></div>
        ) : conversations.length === 0 ? (
          <Label>No conversations for the moment</Label>
        ) : (
          conversations.map((conversation) => (
            <ContextMenu key={conversation.chatId}>
              <ContextMenuTrigger className="mr-2">
                <ConversationsRow conversationData={conversation} />
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() =>
                    handlePinConversation(
                      conversation.chatId,
                      conversation.pinned
                    )
                  }
                >
                  {!conversation.pinned ? (
                    <>
                      <PinIcon size={18} className="mr-2" /> Pin
                    </>
                  ) : (
                    <>
                      <PinOffIcon size={18} className="mr-2" /> Unpin
                    </>
                  )}
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default ConversationsHistory;
