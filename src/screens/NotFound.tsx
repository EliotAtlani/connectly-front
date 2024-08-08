import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col gap-4">
      <Label className="text-6xl font-bold text-primary">404</Label>
      <Label>Page not found</Label>
      <Button onClick={() => navigate("home")}> Back to home page</Button>
    </div>
  );
};

export default NotFound;
