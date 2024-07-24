import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const LoginButton = ({ className }: { className?: string }) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button onClick={() => loginWithRedirect()} className={cn(className, "")}>
      Log In
    </Button>
  );
};

export default LoginButton;
