import { apiService } from "@/lib/apiService";
import { useEffect } from "react";

const LogoutCallback = () => {
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    apiService.setToken("");
    window.location.href = "/";
  }, []);
  return (
    <div className="w-full h-screen">
      <div className="w-full h-full flex items-center justify-center">
        Logging out...
      </div>
    </div>
  );
};

export default LogoutCallback;
