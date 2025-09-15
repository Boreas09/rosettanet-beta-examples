import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Separator,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router";
import { useState } from "react";
import {
  FiHome,
  FiDollarSign,
  FiSettings,
  FiBarChart,
  FiMenu,
  FiX,
  FiDivide,
  FiLink,
  FiLock,
} from "react-icons/fi";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import ActiveChain from "./activeChain.jsx";
import AddRosettanetChain from "./addRosettanetChain.jsx";
import AddRosettanetETH from "./addRosettanetEth.jsx";
import ChainSwitcher from "./chainSwitcher.jsx";
import AddRosettanetXSTRK from "./addRosettanetXSTRK.jsx";
import {
  safeRequestAccounts,
  resetMetaMaskState,
} from "../utils/safeMetaMask.js";

const navigationItems = [
  { path: "/", label: "Home", icon: FiHome },
  { path: "/starkgate", label: "Starkgate", icon: FiLink },
  { path: "/avnu", label: "Avnu", icon: FiDivide },
  { path: "/unruggable", label: "Unruggable", icon: FiLock },
  { path: "/endur", label: "Endur LST xSTRK", icon: FiDollarSign },
  { path: "/starknetjs", label: "StarknetJS", icon: FiSettings },
  { path: "/ethers", label: "Ethers", icon: FiSettings },
  { path: "/getstarknetv5", label: "Get Starknet V5", icon: FiSettings },
];

const NavItem = ({
  path,
  label,
  icon: Icon,
  isActive,
  isCollapsed,
  onClick,
}) => (
  <Link to={path} style={{ textDecoration: "none", width: "100%" }}>
    <Box
      w="full"
      p="3"
      borderRadius="md"
      bg={isActive ? "bg.subtle" : "transparent"}
      color={isActive ? "fg.emphasized" : "fg"}
      _hover={{ bg: "bg.muted", color: "fg.emphasized" }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={onClick}
      justifyContent={isCollapsed ? "center" : "flex-start"}
      display="flex"
      alignItems="center"
    >
      <HStack gap="3" justifyContent={isCollapsed ? "center" : "flex-start"}>
        <Icon size="18" />
        {!isCollapsed && (
          <Text fontSize="sm" fontWeight={isActive ? "medium" : "normal"}>
            {label}
          </Text>
        )}
      </HStack>
    </Box>
  </Link>
);

export function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const isCollapsed = useBreakpointValue({ base: false, md: true, lg: false });

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const sidebarWidth = isCollapsed && !isMobile ? "80px" : "250px";
  const showSidebar = isMobile ? isOpen : true;

  const { open } = useAppKit();
  const { address } = useAppKitAccount();

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          aria-label="Toggle menu"
          onClick={toggleSidebar}
          position="fixed"
          top="4"
          left="4"
          zIndex={isOpen ? "1" : "1002"}
          size="md"
          variant="ghost"
          bg="bg.emphasized"
          shadow="md"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </IconButton>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <Box
          position="fixed"
          inset="0"
          bg="blackAlpha.600"
          zIndex="1000"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Box
        w={sidebarWidth}
        h="100vh"
        bg="bg"
        borderRight="1px solid"
        borderColor="border"
        position="fixed"
        left={showSidebar ? "0" : `-${sidebarWidth}`}
        top="0"
        zIndex="1001"
        transition="all 0.3s ease-in-out"
        transform={isMobile && !isOpen ? "translateX(-100%)" : "translateX(0)"}
        overflowY="auto"
        overflowX="hidden"
      >
        <VStack
          gap="6"
          align="stretch"
          minH="full"
          p={isCollapsed && !isMobile ? "4" : "6"}
        >
          {/* Logo/Brand */}
          <Box textAlign={isCollapsed && !isMobile ? "center" : "left"}>
            {isCollapsed && !isMobile ? (
              <Text fontSize="lg" fontWeight="bold" color="fg">
                R
              </Text>
            ) : (
              <Text fontSize="xl" fontWeight="bold" color="fg">
                Rosettanet Test Website
              </Text>
            )}
          </Box>

          <Separator />

          {/* Navigation */}
          <VStack gap="2" align="stretch" flex="1">
            {navigationItems.map((item) => (
              <NavItem
                key={item.path}
                path={item.path}
                label={item.label}
                icon={item.icon}
                isActive={location.pathname === item.path}
                isCollapsed={isCollapsed && !isMobile}
                onClick={isMobile ? closeSidebar : undefined}
              />
            ))}
            <Separator />
            {address ? (
              <Button onClick={() => open({ view: "Account" })}>
                {address.slice(0, 9)}
              </Button>
            ) : (
              <Button onClick={open} variant="outline" bg="cyan.muted">
                Connect Wallet
              </Button>
            )}
            <Separator />
            <ActiveChain />
            <Separator />
            <AddRosettanetChain />
            <AddRosettanetETH />
            <AddRosettanetXSTRK />
            <Separator />
            <ChainSwitcher />
            <Separator />
            <Button onClick={safeRequestAccounts} minW="100%" variant="ghost">
              ethRequestAccounts
            </Button>
            <Button onClick={resetMetaMaskState} minW="100%" variant="ghost">
              resetMetaMaskState
            </Button>
          </VStack>
        </VStack>
      </Box>
    </>
  );
}
