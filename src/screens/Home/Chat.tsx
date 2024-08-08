import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import HashLoader from "react-spinners/HashLoader";
import ConversationsChat from "@/components/chatPanel/chat-conversation/chat-conversation";
import { apiService } from "@/lib/apiService";
import { socketManager } from "@/lib/socket";
import { ChatType, ConversationType } from "@/lib/types";
import { getUser } from "@/lib/utils";

const Chat = () => {
  const { chatId } = useParams();
  const [chatData, setChatData] = useState<ConversationType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatType[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastPing, setLastPing] = useState<{
    isOnline: boolean;
    lastPing: string;
  } | null>(null);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const { isAuthenticated } = useAuth0();
  const user = getUser();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const firstMessageRef = useRef<HTMLDivElement | null>(null);

  const fetchMessages = useCallback(async () => {
    if (isLoadingMore) return;
    if (page <= 1) return;
    try {
      setCanScroll(false);
      setIsLoadingMore(true);

      const scrollHeight = scrollRef.current?.scrollHeight;

      if (page > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const response = await apiService.get(
        `/chat-messages/${chatId}/messages?page=${page}&pageSize=100`
      );

      setMessages((prevMessages) => [...response.messages, ...prevMessages]);
      setHasMore(page < response.totalPages);

      // scrollRef.current?.scrollTo(0, scrollHeight);

      setTimeout(() => {
        setCanScroll(true);

        if (page > 1) {
          const newScrollHeight = scrollRef.current?.scrollHeight;
          if (scrollHeight && newScrollHeight) {
            scrollRef.current?.scrollTo(0, newScrollHeight - scrollHeight);
          }
        }
      }, 10);
    } catch (error) {
      console.error(`Error in fetchMessages: ${error}`);
    } finally {
      setIsLoadingMore(false);
    }
  }, [chatId, page, isLoadingMore]);

  const fetchOriginalMessages = useCallback(async () => {
    try {
      const response = await apiService.get(
        `/chat-messages/${chatId}/messages?page=1&pageSize=100`
      );

      setMessages(response.messages);
      setHasMore(1 < response.totalPages);
    } catch (error) {
      console.error(`Error in fetchMessages: ${error}`);
    } finally {
      setIsLoadingMore(false);
    }
  }, [chatId, page, isLoadingMore]);

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

  async function getChatData() {
    try {
      const response = await apiService.get(`/chat/${chatId}/${user?.userId}`);
      setChatData(response);
    } catch (error) {
      console.error(`Error in getChatData: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getChatData();
  }, [chatId]);

  useEffect(() => {
    if (isConnected) {
      socketManager.emit("join_room", {
        from_user: user?.userId,
        room: chatId,
      });
      // socketManager.on("history_messages", (data) => {
      //   setMessages(data.messages);
      // });
      socketManager.on("activity_user", (data) => {
        setLastPing(data);
      });
      socketManager.on("user_typing", () => {
        setIsTyping(true);
      });
      socketManager.on("user_stop_typing", () => {
        setIsTyping(false);
      });
      socketManager.on("receive_reaction", (data) => {
        setMessages((state) => {
          if (!state) return state;
          return state.map((message) => {
            if (message.id === data.messageId) {
              const existingReactionIndex = message.reactions?.findIndex(
                (reaction) => reaction.userId === data.userId // Assuming each reaction has a userId
              );

              let updatedReactions;
              if (
                existingReactionIndex !== undefined &&
                existingReactionIndex !== -1
              ) {
                // Replace the existing reaction
                updatedReactions = [...(message.reactions || [])];
                updatedReactions[existingReactionIndex] = data;
              } else {
                // Add the new reaction
                updatedReactions = message.reactions
                  ? [...message.reactions, data]
                  : [data];
              }

              return {
                ...message,
                reactions: updatedReactions,
              };
            }
            return message;
          });
        });
      });

      socketManager.on("delete_reaction", (data) => {
        setMessages((state) => {
          if (!state) return state;
          return state.map((message) => {
            if (message.id === data.messageId) {
              const existingReactionIndex = message.reactions?.findIndex(
                (reaction) => reaction.userId === data.userId
              );

              if (
                existingReactionIndex !== undefined &&
                existingReactionIndex !== -1
              ) {
                const updatedReactions = [...(message.reactions || [])];
                updatedReactions.splice(existingReactionIndex, 1);

                return {
                  ...message,
                  reactions: updatedReactions,
                };
              }
            }
            return message;
          });
        });
      });

      socketManager.on("mark_as_read", (data) => {
        if (data.userId !== user?.userId) return;
        setChatData((state) => {
          if (!state) return state;
          return {
            ...state,
            lastMessageReadId: data.message_id,
          };
        });
      });
    }

    return () => {
      if (isConnected) {
        socketManager.off("history_messages");
        socketManager.off("activity_user");
        socketManager.off("user_typing");
        socketManager.off("user_stop_typing");
        socketManager.emit("leave_room", {
          from_user: user?.userId,
          room: chatId,
        });
      }
    };
  }, [chatId, setIsConnected, isConnected]);

  useEffect(() => {
    if (isConnected) {
      socketManager.on("receive_message", (data) => {
        setMessages((state) => [
          ...state,
          {
            content: data.content,
            senderId: data.senderId,
            senderName: data.senderName,
            createdAt: data.createdAt,
            replyToId: data.replyToId,
            replyTo: data.replyTo,
            type: data.type,
            id: data.id,
          },
        ]);
      });

      return () => {
        if (isConnected) {
          socketManager.off("receive_message");
        }
      };
    }
  }, [isConnected, setIsConnected]);

  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0 && hasMore) {
      fetchMessages();
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchOriginalMessages();
    setPage(2);
  }, [chatId]);

  if (!chatId) return null;

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <HashLoader color="#7c3aed" />
      </div>
    );
  }

  if (!chatData) {
    return <div>Chat not found</div>;
  }

  return (
    <ConversationsChat
      chatData={chatData}
      messages={messages}
      chatId={chatId}
      lastPing={lastPing}
      isConnected={isConnected}
      isTyping={isTyping}
      onScroll={handleScroll}
      scrollRef={scrollRef}
      canScroll={canScroll}
      isLoadingMore={isLoadingMore}
      firstMessageRef={firstMessageRef}
      getChatData={getChatData}
      setMessages={setMessages}
    />
  );
};

export default Chat;
