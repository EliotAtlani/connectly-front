import { useEffect, useState } from "react";

import Logo from "@/assets/logo.png";
import LoginButton from "@/components/auth/LoginButton";
import RegisterButton from "@/components/auth/RegisterButton";
import { GlobeDemo } from "@/components/globe-home";
import { useTheme } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Root = () => {
  const { theme } = useTheme();
  const [globeKey, setGlobeKey] = useState(0);
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    setGlobeKey((prevKey) => prevKey + 1);
  }, [theme]);

  if (isAuthenticated) {
    navigate("/home");
    return;
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center pt-10">
      <img src={Logo} alt="logo" className="w-44" />
      <div className="w-full overflow-hidden flex items-center flex-col">
        <div className="flex items-center justify-center gap-10">
          <LoginButton className="w-32 mx-auto mt-2" />
          <RegisterButton className="w-32 mx-auto mt-2" />
        </div>
        <GlobeDemo key={globeKey} />
      </div>
    </div>
  );
};

export default Root;
