import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import MainLoader from "@/components/main-loader";
import { apiService } from "@/lib/apiService";

const LoginCallback = () => {
  const { isAuthenticated, user, isLoading, getAccessTokenSilently, logout } =
    useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogin = async () => {
      if (isLoading) return;

      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          if (accessToken) {
            localStorage.setItem("token", accessToken);
            apiService.setToken(accessToken);

            if (!user?.sub) {
              navigate("/");
              logout({
                logoutParams: {
                  returnTo: window.location.origin + "/callback/logout",
                },
              });
              return;
            }

            const response = await apiService.post("create-user", {
              id: user?.sub,
              username: user.nickname,
            });
            console.log("User created successfully:", response);

            navigate("/home");
          } else {
            navigate("/");
            logout({
              logoutParams: {
                returnTo: window.location.origin + "/callback/logout",
              },
            });
          }
        } catch (error) {
          console.error("Error fetching access token:", error);
          navigate("/");
          logout({
            logoutParams: {
              returnTo: window.location.origin + "/callback/logout",
            },
          });
        }
      } else {
        navigate("/");
        logout({
          logoutParams: {
            returnTo: window.location.origin + "/callback/logout",
          },
        });
      }
    };

    handleLogin();
  }, [isAuthenticated, isLoading, getAccessTokenSilently, navigate]);

  if (isLoading) return <MainLoader />;

  // You can return null here as the redirection is handled in useEffect
  return null;
};

export default LoginCallback;
