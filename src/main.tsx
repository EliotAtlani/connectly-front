import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

import { Toaster } from "./components/ui/toaster.tsx";
import { FriendRequestProvider } from "./lib/providers/friendRequestProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin + "/callback/login",
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
      cacheLocation="localstorage"
    >
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <FriendRequestProvider>
          <RouterProvider router={router} />
          <Toaster />
        </FriendRequestProvider>
      </ThemeProvider>
    </Auth0Provider>
  </React.StrictMode>
);
