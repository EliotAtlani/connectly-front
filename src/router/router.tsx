import Chat from "@/screens/Chat";
import Home from "@/screens/Home";
import Login from "@/screens/Login";
import Root from "@/screens/Root";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import LoginCallback from "@/callbacks/login-callback";
import LogoutCallback from "@/callbacks/logout-callback";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/callback/login",
    element: <LoginCallback />,
  },
  {
    path: "/callback/logout",
    element: <LogoutCallback />,
  },
  {
    path: "/home",
    element: <PrivateRoute />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    path: "/chat/:roomId",
    element: <Chat />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
