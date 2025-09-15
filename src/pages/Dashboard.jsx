import { useState } from "react";
import {
  Box,
  Container,
  Text,
  Heading,
  List,
  Link,
  Input,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { LuExternalLink } from "react-icons/lu";
import { getStarknetAddress, CONTRACT_OPTIONS } from "../utils/starknetUtils";
import { toaster } from "../components/ui/toaster";
import { useContract } from "../context/ContractContext";

export function Dashboard() {
  const [ethAddress, setEthAddress] = useState("");
  const [starknetAddress, setStarknetAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { selectedContract, setSelectedContract } = useContract();
  const { resolvedTheme } = useTheme();

  const handleGetStarknetAddress = async () => {
    if (!ethAddress) {
      toaster.create({
        title: "Validation Error",
        description: "Please enter an Ethereum address.",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const starknetAddress = await getStarknetAddress(
        ethAddress,
        selectedContract
      );
      setStarknetAddress(starknetAddress);
      toaster.create({
        title: "Success",
        description: "Starknet address retrieved successfully!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "Error getting Starknet address: " + error.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ethRequestAccounts = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    });
  };

  return (
    <Container maxW="3xl" overflow="hidden">
      <VStack gap="6" align="stretch">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="lg" textAlign={{ base: "center", md: "left" }}>
            RosettaNet BETA Testing Dashboard
          </Heading>
        </HStack>

        <Heading size="md" color="orange.500">
          First Transaction Requests Could Be Slow Due to Backend Provider
          (Render.com)
        </Heading>

        <Box>
          <Box display={"flex"} flexDirection="row" mb={2} gap={6}>
            <Link
              href="https://github.com/Digine-Labs/rosettanet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Heading
                size="md"
                mb={4}
                color="blue.500"
                _hover={{ color: "blue.600" }}
              >
                Github Repository
                <LuExternalLink
                  style={{ display: "inline", marginLeft: "4px" }}
                />
              </Heading>
            </Link>

            <Link
              href="https://docs.rosettanet.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Heading
                size="md"
                mb={4}
                color="blue.500"
                _hover={{ color: "blue.600" }}
              >
                Documentation
                <LuExternalLink
                  style={{ display: "inline", marginLeft: "4px" }}
                />
              </Heading>
            </Link>
          </Box>

          {/* Overview Section */}
          <Heading size="md" mb={4}>
            Overview
          </Heading>
          <Text mb={4}>
            Rosetta is a middleware software that acts like an Ethereum RPC. It
            makes requests to the Starknet network while outputting Ethereum RPC
            outputs. This allows users to interact with Starknet the same as
            they interact with the EVM-compatible chain.
          </Text>

          <Text fontWeight="bold" mb={2}>
            Rosetta
          </Text>
          <List.Root mb={4} pl={4}>
            <List.Item>Rosetta is not a Starknet node itself.</List.Item>
            <List.Item>
              Rosetta needs a working Starknet node to be connected.
            </List.Item>
            <List.Item>
              Rosetta can handle both Starknet and Ethereum RPC requests.
            </List.Item>
          </List.Root>

          <Text fontWeight="bold" mb={2}>
            What does Rosetta benefit to users?
          </Text>
          <List.Root mb={4} pl={4}>
            <List.Item>
              You can connect and interact protocols in Starknet with your
              existing EVM wallet (Metamask, Trust wallet, Hardware wallets,
              etc.)
            </List.Item>
            <List.Item>
              You can use Rosetta on local. There is no sync needed. Simply,
              users can clone the repo and use their local Rosetta node to
              connect to Starknet.
            </List.Item>
            <List.Item>
              You can use L1 interactive protocols by just changing the network
              on your wallet.
            </List.Item>
          </List.Root>

          <Text fontWeight="bold" mb={2}>
            What does Rosetta benefit to devs?
          </Text>
          <List.Root mb={4} pl={4}>
            <List.Item>
              You can use all EVM-compatible libraries. (Ethers, web3js, etc.)
            </List.Item>
            <List.Item>
              If you want to migrate your project from the EVM chain to
              Starknet, all you need to do is develop your smart contracts with
              Cairo. You just need to care about providing the same ABI in both.
              You don't need to make any changes on frontend or backend. Rosetta
              handles all of these.
            </List.Item>
          </List.Root>

          <Text fontStyle="italic" mb={8} color="gray.400">
            Rosetta aims to give EVM experience to users where they won't ever
            notify they are using Starknet.
          </Text>

          <Heading size="md" mb={4}>
            Get Starknet Address from ETH Address
          </Heading>

          <VStack gap={4} align="stretch">
            <Text fontStyle="italic" color="gray.400">
              This selection is not going to effect RPC's contracts. This is for
              ensuring website is working with same contracts with RPC.
            </Text>
            <HStack gap={4} align="center">
              <Box flex={1}>
                <select
                  value={selectedContract}
                  onChange={(e) => setSelectedContract(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: `1px solid ${
                      resolvedTheme === "dark" ? "#4a5568" : "#e2e8f0"
                    }`,
                    backgroundColor:
                      resolvedTheme === "dark" ? "#2d3748" : "#e2e8f0",
                    color: resolvedTheme === "dark" ? "#ffffff" : "#000000",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  {Object.keys(CONTRACT_OPTIONS).map((key) => (
                    <option key={key} value={key}>
                      {key.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </Box>
              <Text
                fontWeight="medium"
                color="fg.muted"
                fontSize="sm"
                minW="fit-content"
              >
                Selected: {selectedContract.replace(/_/g, " ")}
              </Text>
            </HStack>
            {starknetAddress && (
              <Text
                fontWeight="bold"
                p={4}
                bg="gray.emphasized"
                borderRadius="md"
                wordBreak="break-all"
              >
                Starknet Address: {starknetAddress}
              </Text>
            )}
            <HStack gap={4}>
              <Input
                placeholder="Enter ETH Address"
                value={ethAddress}
                onChange={(e) => setEthAddress(e.target.value)}
                flex={1}
              />
              <Button
                onClick={handleGetStarknetAddress}
                colorScheme="blue"
                loading={isLoading}
                disabled={isLoading}
              >
                Get Starknet Address
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
