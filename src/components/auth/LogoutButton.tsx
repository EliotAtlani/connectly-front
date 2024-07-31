import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "link"
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost";
}
const LogoutButton = ({ variant = "default" }: LogoutButtonProps) => {
  const { logout } = useAuth0();

  return (
    <Button
      onClick={() =>
        logout({
          logoutParams: {
            returnTo: window.location.origin + "/callback/logout",
          },
        })
      }
      variant={variant}
      type="button"
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
