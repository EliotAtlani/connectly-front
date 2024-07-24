import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { ModeToggle } from "./components/ui/mode-toggle.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-j8sjd88bmveue6wh.us.auth0.com"
      clientId="Gz0SVHnLPJ6WYSbaH2WKVwCiNvmEyxcc"
      authorizationParams={{
        redirect_uri: window.location.origin + "/callback/login",
        audience: "http://localhost:3000/",
      }}
    >
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <div className="fixed top-4 right-4 z-100000000000000">
          <ModeToggle />
        </div>
      </ThemeProvider>
    </Auth0Provider>
  </React.StrictMode>
);
