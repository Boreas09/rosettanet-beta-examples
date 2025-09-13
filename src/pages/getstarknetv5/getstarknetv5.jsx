import { Container, Heading, Text, VStack } from "@chakra-ui/react";

export default function GetStarknetV5() {
  return (
    <Container maxW="3xl" overflow="hidden">
      <VStack gap="6" align="stretch">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }}>
          Get Starknet V5
        </Heading>
        
        <Text fontSize="md" color="fg.muted">
          This page is for Get Starknet V5 functionality.
        </Text>
      </VStack>
    </Container>
  );
}