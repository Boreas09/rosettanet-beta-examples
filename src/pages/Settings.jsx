import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export function Settings() {
  return (
    <Box>
      <VStack gap="4" align="start">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }}>Settings</Heading>
        <Text color="gray.600">
          This is the settings page. You can add configuration options,
          preferences, and other settings controls here.
        </Text>
      </VStack>
    </Box>
  );
}