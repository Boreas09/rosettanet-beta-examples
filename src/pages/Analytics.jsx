import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export function Analytics() {
  return (
    <Box>
      <VStack gap="4" align="start">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }}>Analytics</Heading>
        <Text color="gray.600">
          This is the analytics page. You can add charts, graphs, and data
          visualizations here to show analytics and metrics.
        </Text>
      </VStack>
    </Box>
  );
}