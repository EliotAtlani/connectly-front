import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const RegisterButton = ({ className }: { className?: string }) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      onClick={() =>
        loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })
      }
      className={cn(className, "")}
      variant="outline"
    >
      Sign up
    </Button>
  );
};

export default RegisterButton;
