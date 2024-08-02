import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { socketManager } from "@/lib/socket";

const Home: React.FC = () => {
  const [roomName, setRoomName] = useState<string>("");
  const navigate = useNavigate();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

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

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomName !== "" && user?.sub !== "") {
      navigate(`/chat/${roomName}`);
    } else {
      console.error("Missing room or username");
    }
    setRoomName("");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="absolute top-4 left-4">
        <LogoutButton />
      </div>
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Home</CardTitle>
        </CardHeader>
        <form onSubmit={handleOnSubmit}>
          <CardContent className="flex flex-col gap-4">
            <Input
              placeholder="Enter a room name"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Join</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Home;
