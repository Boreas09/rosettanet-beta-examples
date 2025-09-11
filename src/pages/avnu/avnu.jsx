import { useState } from "react";
import {
  Button,
  Text,
  Card,
  Link,
  Container,
  Input,
  VStack,
  Box,
  Stack,
} from "@chakra-ui/react";
import { getStarknetAddress } from "../../utils/starknetUtils";
import { useAccount } from "wagmi";
import { sendTransaction } from "@wagmi/core";
import { parseEther } from "ethers";
import { reownConfig } from "../../utils/appkitProvider";
import { prepareMulticallCalldata } from "rosettanet";
import { toaster } from "../../components/ui/toaster";

// const ethAddress =
//   '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
// const strkAddress =
//   '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';

export default function Avnu() {
  const { address, chainId } = useAccount();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  async function handleClick() {
    setLoading(true);

    if (!address) {
      toaster.create({
        title: "Wallet Error",
        description: "Please Connect Your Wallet.",
        type: "error",
        duration: 9000,
      });
      setLoading(false);
      return;
    }

    if (chainId !== 1381192787) {
      toaster.create({
        title: "Network Error",
        description: "Please connect with RosettaNet Chain.",
        type: "error",
        duration: 9000,
      });
      setLoading(false);
      return;
    }

    if (!value) {
      toaster.create({
        title: "Input Error",
        description: "Please enter an amount to exchange.",
        type: "error",
        duration: 9000,
      });
      setLoading(false);
      return;
    }

    try {
      const snAddress = await getStarknetAddress(address);

      const amount = parseEther(value);
      const amountHex = "0x" + amount.toString(16);

      const getQuotes = await fetch(
        `https://sepolia.api.avnu.fi/swap/v2/quotes?sellTokenAddress=0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d&buyTokenAddress=0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7&sellAmount=${amountHex}&onlyDirect=true&PULSAR_MONEY_FEE_RECIPIENT.value=0`
      );
      const getQuotesResponse = await getQuotes.json();
      const quoteId = getQuotesResponse[0].quoteId;

      const postBody = {
        quoteId: quoteId,
        takerAddress: snAddress,
        slippage: "0.05",
        includeApprove: true,
      };

      const buildSwapData = await fetch(
        "https://sepolia.api.avnu.fi/swap/v2/build",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postBody),
        }
      );

      const buildSwapDataResponse = await buildSwapData.json();

      const calldata = [
        {
          contract_address:
            "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          entry_point:
            "0x219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c",
          calldata: buildSwapDataResponse.calls[0].calldata,
        },
        {
          contract_address:
            "0x2c56e8b00dbe2a71e57472685378fc8988bba947e9a99b26a00fade2b4fe7c2",
          entry_point:
            "0x1171593aa5bdadda4d6b0efde6cc94ee7649c3163d5efeb19da6c16d63a2a63",
          calldata: buildSwapDataResponse.calls[1].calldata,
        },
      ];

      const response = await sendTransaction(reownConfig, {
        chainId: 1381192787,
        account: address,
        to: "0x0000000000000000000000004645415455524553",
        value: parseEther("0"),
        data: prepareMulticallCalldata(calldata),
      });

      console.log("Transaction sent:", response);
      setTransactions((prevData) => [...prevData, response]);
    } catch (e) {
      console.error(e);
      toaster.create({
        title: "Exchange Error",
        description: e.message || "Failed to process exchange",
        type: "error",
        duration: 9000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxW="3xl" overflow="hidden">
      <VStack gap="6" align="stretch">
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Avnu Exchange STRK to ETH
          </Text>
          <Text fontSize="sm" color="gray.600" mb={2}>
            This part uses Avnu to exchange STRK to ETH. After successful
            exchange, you can see your increased ETH amount in your wallet.
          </Text>
          <Text fontSize="sm" color="gray.600">
            Wallet needs to be connected to{" "}
            <Text as="span" bg="orange.50" px={2} py={1} borderRadius="md" color="orange.600">
              RosettaNet
            </Text>{" "}
            Chain.
          </Text>
        </Box>

        <Stack 
          direction={{ base: "column", md: "row" }} 
          gap={4} 
          align="stretch"
        >
          <Input
            placeholder="Enter STRK amount to exchange"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="number"
            step="1"
            flex={1}
            size={{ base: "lg", md: "md" }}
          />
          <Button
            onClick={handleClick}
            loading={loading}
            colorScheme="orange"
            size="lg"
          >
            {loading ? "Processing Exchange..." : "Exchange STRK → ETH"}
          </Button>
        </Stack>

        {transactions.length > 0 && (
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Recent Transactions
            </Text>
            <VStack gap={3}>
              {transactions.map((tx, index) => (
                <Card.Root key={tx} size="sm" w="full">
                  <Card.Body>
                    <VStack align="start" gap={2}>
                      <Text fontSize="sm" fontWeight="bold">
                        Exchange #{index + 1}
                      </Text>
                      <Text fontSize="xs" color="gray.500" wordBreak="break-all">
                        {tx}
                      </Text>
                      <Link
                        fontSize="sm"
                        href={`https://sepolia.voyager.online/tx/${tx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="orange.500"
                      >
                        View on Voyager →
                      </Link>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
}
