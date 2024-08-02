import ConversationsChat from "@/components/chatPanel/chat-conversation/chat-conversation";
import { apiService } from "@/lib/apiService";
import { socketManager } from "@/lib/socket";
import { ChatType, ConversationType } from "@/lib/types";
import { getUser } from "@/lib/utils";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const Chat1 = () => {
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
          `/chat/${chatId}/${user?.userId}`
        );
        setChatData(response);
      } catch (error) {
        console.error(`Error in getChatData: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    getChatData();
  }, [chatId]);

  useEffect(() => {
    if (isConnected) {
      socketManager.emit("join_room", {
        from_user: user?.userId,
        room: chatId,
      });
      socketManager.on("history_messages", (data) => {
        setMessages(data);
      });
      socketManager.on("activity_user", (data) => {
        setLastPing(data);
      });
      socketManager.on("user_typing", () => {
        setIsTyping(true);
      });

      socketManager.on("user_stop_typing", () => {
        setIsTyping(false);
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
    if (!isConnected) {
      return;
    }
    socketManager.on("receive_message", (data) => {
      setMessages((state) => [
        ...state,
        {
          content: data.content,
          senderId: data.senderId,
          createdAt: data.createdAt,
          id: data.id,
        },
      ]);
    });

    // Remove event listener on component unmount
    return () => {
      if (isConnected) {
        socketManager.off("receive_message");
      }
    };
  }, [isConnected, setIsConnected]);

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
    />
  );
};

export default Chat1;
