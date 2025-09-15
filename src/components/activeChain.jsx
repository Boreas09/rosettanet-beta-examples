import React from "react";
import { useChainId } from "wagmi";
import { Text, VStack } from "@chakra-ui/react";
import { useAppKitAccount } from "@reown/appkit/react";

export default function ActiveChain() {
  const chainId = useChainId();
  const [chain, setChain] = React.useState("");
  const { address } = useAppKitAccount();

  React.useEffect(() => {
    if (address) {
      if (chainId === 1) {
        setChain("Ethereum");
      } else if (chainId === 11155111) {
        setChain("Sepolia");
      } else if (chainId === 1381192787) {
        setChain("RosettaNet");
      } else {
        setChain("Unknown");
      }
    } else {
      setChain("None");
    }
  }, [chainId, address]);

  return (
    <VStack minW={"100%"} my={2}>
      <Text my={2}>
        Active Chain:{" "}
        <Text
          as={"mark"}
          bg="cyan.muted"
          color={"bg.inverted"}
          px={2}
          py={1}
          borderRadius={"0.25rem"}
          fontSize={"sm"}
        >
          {chain}
        </Text>
      </Text>
    </VStack>
  );
}
