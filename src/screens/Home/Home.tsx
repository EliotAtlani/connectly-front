import { Label } from "@/components/ui/label";
import { socketManager } from "@/lib/socket";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const Home = () => {
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
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Label className="text-2xl">Hello 👋</Label>
        <Label className="text-muted-foreground font-light">
          {" "}
          Select a conversation to start
        </Label>
      </div>
    </div>
  );
};

export default Home;
