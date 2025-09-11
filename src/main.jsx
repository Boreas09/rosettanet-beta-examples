import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Analytics } from "./pages/Analytics.jsx";
import { Settings } from "./pages/Settings.jsx";
import Starkgate from "./pages/starkgate/Starkgate.jsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { AppKitProvider } from "./utils/appkitProvider.jsx";
import Avnu from "./pages/avnu/avnu.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/starkgate",
        element: <Starkgate />,
      },
      {
        path: "/avnu",
        element: <Avnu />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppKitProvider>
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <RouterProvider router={router} />
        </ThemeProvider>
      </ChakraProvider>
    </AppKitProvider>
  </StrictMode>
);
