import { useState } from "react";
import { useAccount } from "wagmi";
import { sendTransaction } from "@wagmi/core";
import {
  Box,
  Button,
  Text,
  Input,
  Card,
  Link,
  VStack,
  Stack,
} from "@chakra-ui/react";
import { parseEther } from "ethers";
import { useAppKitAccount } from "@reown/appkit/react";
import { cairo } from "starknet";
import { reownConfig } from "../../utils/appkitProvider";
import { prepareMulticallCalldata } from "rosettanet";
import { toaster } from "../../components/ui/toaster";

export default function StarkgateWithdraw() {
  const { chainId } = useAccount();
  const { address } = useAppKitAccount();
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
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

    if (!amount) {
      toaster.create({
        title: "Input Error",
        description: "Please enter amount.",
        type: "error",
        duration: 9000,
      });
      setLoading(false);
      return;
    }

    try {
      const starkAmount = cairo.uint256(parseEther(amount));

      const withdrawCalldata = [
        {
          contract_address:
            "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          entry_point:
            "0x0083afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e",
          calldata: [
            "0x7D33254052409C04510C3652BC5BE5656F1EFF1B131C7C031592E3FA73F1F70",
            "0x" + new BigInt(starkAmount.low).toString(16),
            "0x" + new BigInt(starkAmount.high).toString(16),
          ],
        },
        {
          contract_address:
            "0x04c5772d1914fe6ce891b64eb35bf3522aeae1315647314aac58b01137607f3f",
          entry_point:
            "0x00e5b455a836c7a254df57ed39d023d46b641b331162c6c0b369647056655409",
          calldata: [
            "455448",
            address,
            "0x" + new BigInt(starkAmount.low).toString(16),
            "0x" + new BigInt(starkAmount.high).toString(16),
          ],
        },
      ];
      const response = await sendTransaction(reownConfig, {
        chainId: 1381192787,
        account: address,
        to: "0x0000000000000000000000004645415455524553",
        value: parseEther("0"),
        data: prepareMulticallCalldata(withdrawCalldata),
        gasLimit: 90000,
        type: "eip1559",
      });
      console.log("Transaction sent:", response);
      setTransactions((prevData) => [...prevData, response]);
    } catch (e) {
      console.error(e);
      toaster.create({
        title: "Transaction Error",
        description: e.message || "Failed to process withdrawal",
        type: "error",
        duration: 9000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack gap="6" align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Starkgate Withdraw from Starknet to ETH
        </Text>
        <Text fontSize="sm" mb={2}>
          This part uses Starkgate to send ETH from Starknet to Ethereum. After
          successfully sent, you can see your ETH amount in Ethereum Sepolia
          chain in your wallet.
        </Text>
        <Text fontSize="sm" mt={2}>
          Wallet needs to be connected to{" "}
          <Text
            as="span"
            bg="orange.50"
            px={2}
            py={1}
            borderRadius="md"
            color="orange.600"
          >
            RosettaNet
          </Text>{" "}
          Chain.
        </Text>
      </Box>

      <Stack direction={{ base: "column", md: "row" }} gap={4} align="stretch">
        <Input
          placeholder="Enter Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          step="1"
        />
        <Button onClick={handleWithdraw} loading={loading}>
          {loading ? "Processing Withdrawal..." : "Withdraw ETH"}
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
                      Transaction #{index + 1}
                    </Text>
                    <Text fontSize="xs" color="gray.500" wordBreak="break-all">
                      {tx}
                    </Text>
                    <Link
                      fontSize="sm"
                      href={`https://sepolia.voyager.online/tx/${tx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="purple.500"
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
  );
}
