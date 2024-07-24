import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { socketManager } from "@/lib/socket";

const Home: React.FC = () => {
  const [roomName, setRoomName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
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
    console.log("Joining room", roomName);
    if (roomName !== "" && username !== "") {
      socketManager.emit("join_room", { from_user: username, room: roomName });
      navigate(`/chat/${roomName}/${username}`);
    } else {
      console.error("Missing room or username");
    }
    setRoomName("");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Home</CardTitle>
          <CardDescription>
            {user?.email}:
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </CardDescription>
          <LogoutButton />
        </CardHeader>
        <form onSubmit={handleOnSubmit}>
          <CardContent className="flex flex-col gap-4">
            <Input
              placeholder="Enter a username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
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
