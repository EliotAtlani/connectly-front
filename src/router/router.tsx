import Root from "@/screens/Root";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import LoginCallback from "@/callbacks/login-callback";
import LogoutCallback from "@/callbacks/logout-callback";
import OnBoarding from "@/screens/OnBoarding";
import HomeLayout from "@/screens/Home/HomeLayout";
import Home from "@/screens/Home/Home";
import MainLayout from "@/screens/MainLayout";
import Settings from "@/screens/settings/Settings";
import FriendsLayout from "@/screens/Friends/FriendsLayout";
import AddFriend from "@/screens/Friends/AddFriend";
import Friends from "@/screens/Friends/Friends";
import NewChat from "@/screens/Home/NewChat";
import FriendInfo from "@/screens/Friends/FriendInfo";
import Chat from "@/screens/Home/Chat";
import NotFound from "@/screens/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
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
    path: "/onboarding",
    element: <PrivateRoute />,
    children: [
      {
        path: "/onboarding",
        element: <OnBoarding />,
      },
    ],
  },
  {
    path: "/home",
    element: <PrivateRoute />,
    children: [
      {
        path: "/home",
        element: (
          <MainLayout>
            <HomeLayout>
              <Home />
            </HomeLayout>
          </MainLayout>
        ),
      },
    ],
  },
  {
    path: "/home/chat/:chatId",
    element: <PrivateRoute />,
    children: [
      {
        path: "/home/chat/:chatId",
        element: (
          <MainLayout>
            <HomeLayout>
              <Chat />
            </HomeLayout>
          </MainLayout>
        ),
      },
    ],
  },
  {
    path: "/home/new-chat",
    element: <PrivateRoute />,
    children: [
      {
        path: "/home/new-chat",
        element: (
          <MainLayout>
            <HomeLayout>
              <NewChat />
            </HomeLayout>
          </MainLayout>
        ),
      },
    ],
  },
  {
    path: "/settings",
    element: <PrivateRoute />,
    children: [
      {
        path: "/settings",
        element: (
          <MainLayout>
            <Settings />
          </MainLayout>
        ),
      },
    ],
  },
  {
    path: "/friends",
    element: <PrivateRoute />,
    children: [
      {
        path: "/friends",
        element: (
          <MainLayout>
            <FriendsLayout>
              <Friends />
            </FriendsLayout>
          </MainLayout>
        ),
      },
    ],
  },
  {
    path: "/friends/:friendId",
    element: <PrivateRoute />,
    children: [
      {
        path: "/friends/:friendId",
        element: (
          <MainLayout>
            <FriendsLayout>
              <FriendInfo />
            </FriendsLayout>
          </MainLayout>
        ),
      },
    ],
  },
  {
    path: "/friends/add",
    element: <PrivateRoute />,
    children: [
      {
        path: "/friends/add",
        element: (
          <MainLayout>
            <FriendsLayout>
              <AddFriend />
            </FriendsLayout>
          </MainLayout>
        ),
      },
    ],
  },
]);
