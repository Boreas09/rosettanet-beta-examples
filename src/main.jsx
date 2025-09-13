import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import Starkgate from "./pages/starkgate/Starkgate.jsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { AppKitProvider } from "./utils/appkitProvider.jsx";
import { ContractProvider } from "./context/ContractContext.jsx";
import Avnu from "./pages/avnu/avnu.jsx";
import Endur from "./pages/endur/endur.jsx";
import Ethers from "./pages/ethers/ethers.jsx";
import GetStarknetV5 from "./pages/getstarknetv5/getstarknetv5.jsx";
import Starknetjs from "./pages/starknetjs/starknetjs.jsx";
import Unruggable from "./pages/unruggable/unruggable.jsx";

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
        path: "/starkgate",
        element: <Starkgate />,
      },
      {
        path: "/avnu",
        element: <Avnu />,
      },
      {
        path: "/endur",
        element: <Endur />,
      },
      {
        path: "/ethers",
        element: <Ethers />,
      },
      {
        path: "/getstarknetv5",
        element: <GetStarknetV5 />,
      },
      {
        path: "/starknetjs",
        element: <Starknetjs />,
      },
      {
        path: "/unruggable",
        element: <Unruggable />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppKitProvider>
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <ContractProvider>
            <RouterProvider router={router} />
          </ContractProvider>
        </ThemeProvider>
      </ChakraProvider>
    </AppKitProvider>
  </StrictMode>
);
