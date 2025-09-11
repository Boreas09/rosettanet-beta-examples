import { useSwitchChain } from "wagmi";
import { VStack, Text, Button } from "@chakra-ui/react";

export default function ChainSwitcher() {
  const { chains, switchChain } = useSwitchChain();

  return (
    <VStack minW={"100%"} my={2}>
      <Text>Chain Switcher</Text>
      {chains.map((chain) => (
        <Button
          key={chain.id}
          onClick={() => switchChain({ chainId: chain.id })}
          minW="100%"
          variant="ghost"
        >
          {chain.name}
        </Button>
      ))}
    </VStack>
  );
}
