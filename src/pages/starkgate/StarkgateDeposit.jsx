import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import {
  Box,
  Button,
  Text,
  Input,
  VStack,
  Stack,
} from "@chakra-ui/react";
import { getStarknetAddress } from "../../utils/starknetUtils";
import { useContract } from "../../context/ContractContext";
import { parseEther } from "ethers";
import { toaster } from "../../components/ui/toaster";
import TransactionList from "../../components/TransactionList";

const starkgateSepoliaAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "l2Recipient",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export default function StarkgateDeposit() {
  const { address, chainId } = useAccount();
  const { selectedContract } = useContract();
  const { writeContractAsync } = useWriteContract({
    abi: starkgateSepoliaAbi,
  });
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
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

    if (chainId !== 11155111) {
      toaster.create({
        title: "Network Error",
        description: "Please connect with Ethereum Sepolia Chain.",
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

    const snAddress = await getStarknetAddress(address, selectedContract);

    try {
      const response = await writeContractAsync({
        abi: starkgateSepoliaAbi,
        address: "0x8453fc6cd1bcfe8d4dfc069c400b433054d47bdc",
        functionName: "deposit",
        args: [
          "0x0000000000000000000000000000000000455448", // token address
          parseEther(amount), // amount (in wei)
          snAddress, // L2 recipient
        ],
        value: parseEther(amount) + parseEther("0.01"), // ETH value to send (in wei)
      });
      console.log("Transaction sent:", response);
      setTransactions((prevData) => [...prevData, response]);
    } catch (e) {
      console.error(e);
      toaster.create({
        title: "Transaction Error",
        description: e.message || "Failed to process deposit",
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
          Starkgate Deposit from ETH to Starknet
        </Text>
        <Text fontSize="sm" mb={2}>
          This part uses Starkgate to send ETH from Ethereum to Starknet. After
          successfully sent, you can see your ETH amount in RosettaNet chain in
          your wallet.
        </Text>
        <Text fontSize="sm">
          Wallet needs to be connected to{" "}
          <Text
            as="span"
            bg="blue.50"
            px={2}
            py={1}
            borderRadius="md"
            color="blue.600"
          >
            Ethereum Sepolia
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
        <Button onClick={handleDeposit} loading={loading}>
          {loading ? "Processing Deposit..." : "Deposit ETH"}
        </Button>
      </Stack>

      <TransactionList
        transactions={transactions}
        explorerUrl="https://sepolia.etherscan.io/tx"
        linkColor="blue.500"
        linkText="View on Etherscan →"
      />
    </VStack>
  );
}
