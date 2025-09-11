import { IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

export function ColorModeToggle() {
  const { theme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <IconButton
      aria-label="toggle color mode"
      onClick={toggleColorMode}
      bg="bg.emphasized"
      colorPalette={theme === "light" ? "yellow" : "blue"}
    >
      {theme === "light" ? <LuMoon /> : <LuSun />}
    </IconButton>
  );
}
