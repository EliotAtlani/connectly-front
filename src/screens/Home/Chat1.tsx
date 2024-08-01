import ConversationsChat from "@/components/chatPanel/chat-conversation/chat-conversation";
import { apiService } from "@/lib/apiService";
import { socketManager } from "@/lib/socket";
import { ChatType, ConversationType } from "@/lib/types";
import { getUser } from "@/lib/utils";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Chat1 = () => {
  const { chatId } = useParams();
  const [chatData, setChatData] = useState<ConversationType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatType[]>([]);
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
        console.log("NAIN", data);
        setMessages(data);
      });
    }

    return () => {
      if (isConnected) {
        socketManager.off("history_messages");
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
    return <div>Loading...</div>;
  }

  if (!chatData) {
    return <div>Chat not found</div>;
  }

  console.log("chatData", messages);
  return (
    <ConversationsChat
      chatData={chatData}
      messages={messages}
      chatId={chatId}
    />
  );
};

export default Chat1;
