import { Container, Heading, Text, VStack } from "@chakra-ui/react";

export default function Starknetjs() {
  return (
    <Container maxW="3xl" overflow="hidden">
      <VStack gap="6" align="stretch">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }}>
          Starknetjs
        </Heading>

        <Text fontSize="md" color="fg.muted">
          This page is for Starknetjs functionality.
        </Text>
      </VStack>
    </Container>
  );
}
