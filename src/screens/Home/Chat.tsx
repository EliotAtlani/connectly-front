/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";

import Conversation from "../../components/conversation";
import { Message } from "../../lib/types";
import InputMessage from "../../components/input-message";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { socketManager } from "@/lib/socket";
import { useAuth0 } from "@auth0/auth0-react";
import BackButton from "@/components/buttons/back-button";

export default function Chat() {
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userTyping, setUserTyping] = useState<string>("");
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const initializeSocketConnection = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          socketManager.setToken(token);
          socketManager.connect();
          setIsConnected(true);
        } catch (error) {
          console.error("Error initializing socket:", error);
        }
      }
    };

    initializeSocketConnection();
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (isConnected) {
      socketManager.emit("join_room", {
        from_user: user?.sub,
        room: chatId,
      });
      socketManager.on("history_messages", (data) => {
        setMessages(data);
      });

      socketManager.on("user_typing", (data) => {
        setUserTyping(data.username);
        setIsTyping(true);
      });

      socketManager.on("user_stop_typing", () => {
        setIsTyping(false);
        setUserTyping("");
      });
    }

    return () => {
      if (isConnected) {
        socketManager.off("history_messages");
        socketManager.off("user_typing");
        socketManager.off("user_stop_typing");
      }
    };
  }, [chatId, user?.sub, setIsConnected, isConnected]);
  // Runs whenever a socketManager event is recieved from the server
  useEffect(() => {
    if (!isConnected) {
      return;
    }
    socketManager.on("receive_message", (data) => {
      setMessages((state) => [
        ...state,
        {
          id: data.id,
          content: data.content,
          from_user: data.from_user,
          user_image: data.user_image,
          __createdtime__: data.__createdtime__,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessage = (e: any) => {
    e.preventDefault();
    if (!isConnected) return;
    socketManager.emit("send_message", {
      content: message,
      from_user: user?.sub,
      user_image: user?.picture,
      room: chatId,
    });
    setMessage("");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-[300px] md:w-[500px] h-[400px] md:h-[600px] flex flex-col relative">
        <div className="absolute left-4 top-4">
          <BackButton />{" "}
        </div>
        <CardHeader>
          <CardTitle className="text-right">Discussion</CardTitle>
          <CardDescription className="text-right">
            Chat avec tes amis ici !
          </CardDescription>
        </CardHeader>
        <CardContent className="grow py-0">
          <Conversation messages={messages} username={user?.sub as string} />
        </CardContent>

        <div className="absolute bottom-0 w-full px-6  z-1000 ">
          <div className=" w-[95%] mx-auto pb-2">
            {isTyping && (
              <div className="text-sm text-gray-500 italic">
                {userTyping} is typing...
              </div>
            )}
          </div>
          <div className="w-[100%] mx-auto bg-gradient-to-t to-transparent from-background via-background via-70% pb-4 pt-2">
            <InputMessage
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              room={chatId as string}
              username={user?.nickname as string}
              isConnected={isConnected}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
