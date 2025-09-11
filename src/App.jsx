import { Box, ClientOnly, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import { Outlet } from "react-router";
import { ColorModeToggle } from "./components/color-mode-toggle";
import { Sidebar } from "./components/sidebar";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const isCollapsed = useBreakpointValue({ base: false, md: true, lg: false });
  
  const mainMarginLeft = isMobile 
    ? "0" 
    : isCollapsed 
    ? "80px" 
    : "250px";

  return (
    <Box display="flex" minH="100vh">
      <Sidebar />
      
      <Box 
        flex="1" 
        ml={mainMarginLeft} 
        bg="bg.subtle"
        transition="margin-left 0.3s ease-in-out"
        w="full"
      >
        <Box pos="absolute" top="4" right="4" zIndex="1001">
          <ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
            <ColorModeToggle />
          </ClientOnly>
        </Box>
        
        <Box p={{ base: "4", md: "6", lg: "8" }}>
          <Outlet />
        </Box>
      </Box>
      
      <Toaster />
    </Box>
  );
}
