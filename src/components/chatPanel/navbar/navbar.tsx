import { tabs } from "@/data/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useFriendRequest } from "@/lib/providers/friendRequestProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth0();

  const { numberFriendRequest } = useFriendRequest();

  return (
    <div className="w-full h-full flex flex-col items-center justify-between  py-2 pt-5 bg-muted rounded-l-[10px]">
      <div className="flex flex-col items-center gap-4">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => navigate(tab.href)}
                  className={cn(
                    " p-2 rounded-sm cursor-pointer relative hover:bg-muted-foreground/10",
                    location.pathname.startsWith(tab.href) && "bg-primary/80"
                  )}
                >
                  <Icon
                    size={20}
                    className={
                      location.pathname.startsWith(tab.href)
                        ? "text-white"
                        : " text-muted-foreground"
                    }
                  />
                  {tab.title === "Friends" && numberFriendRequest > 0 && (
                    <div
                      className={cn(
                        "absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center",
                        location.pathname.startsWith(tab.href)
                          ? "bg-white text-muted-foreground"
                          : "bg-primary/60 text-white"
                      )}
                    >
                      {numberFriendRequest}
                    </div>
                  )}
                </TooltipTrigger>
                <TooltipContent>{tab.title}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-4 pb-2">
        <ModeToggle />
        <button
          onClick={() =>
            logout({
              logoutParams: {
                returnTo: window.location.origin + "/callback/logout",
              },
            })
          }
        >
          <LogOutIcon size={20} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
