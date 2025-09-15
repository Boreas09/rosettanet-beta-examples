import { useState } from "react";
import {
  Button,
  Text,
  Stack,
  Container,
  Input,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { toaster } from "../../components/ui/toaster";
import TransactionList from "../../components/TransactionList";

export default function Ethers() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [ethSigner, setEthSigner] = useState(null);

  async function handleEthersConnection() {
    if (!window.ethereum) {
      toaster.create({
        title: "Wallet Error",
        description: "Ethereum wallet not found.",
        type: "error",
        duration: 9000,
      });
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    try {
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      toaster.create({
        title: "Success",
        description: "Connected to wallet successfully!",
        type: "success",
        duration: 3000,
      });
      setEthSigner(signer);
      return signer;
    } catch (e) {
      console.error(e);
      toaster.create({
        title: "Error",
        description: `Connection failed: ${e.message || JSON.stringify(e)}`,
        type: "error",
        duration: 9000,
      });
      return null;
    }
  }

  async function send(signer) {
    setLoading(true);

    if (!recipient) {
      setLoading(false);
      toaster.create({
        title: "Input Error",
        description: "Please Enter Recipient.",
        type: "error",
        duration: 9000,
      });
      return;
    }

    const tx = {
      chainId: 1381192787,
      to: recipient,
      value: ethers.parseEther("1"),
    };

    try {
      const txResponse = await signer.sendTransaction(tx);
      setLoading(false);
      setTransactions((prevData) => [...prevData, txResponse.hash]);

      toaster.create({
        title: "Success",
        description: "1 STRK sent successfully!",
        type: "success",
        duration: 5000,
      });

      // Clear recipient field after successful transaction
      setRecipient("");
    } catch (e) {
      setLoading(false);
      console.error(e);
      toaster.create({
        title: "Transaction Error",
        description: `Transaction failed: ${e.message || JSON.stringify(e)}`,
        type: "error",
        duration: 9000,
      });
    }
  }

  async function switchToRosettanet() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x52535453" }],
      });
    } catch (e) {
      console.error(e);
      toaster.create({
        title: "Network Error",
        description: "Please add RosettaNet Chain from left menu.",
        type: "error",
        duration: 9000,
      });
    }
  }

  async function handleFundTransfer() {
    await switchToRosettanet();
    if (!ethSigner) {
      toaster.create({
        title: "Error",
        description:
          "Please connect to wallet with Ethers. If you connected with another method, please disconnect and connect again with Ethers.",
        type: "error",
        duration: 9000,
      });

      return;
    }

    await send(ethSigner);
  }

  return (
    <Container maxW="3xl" overflow={"hidden"}>
      <VStack gap="3" align="stretch">
        <Text fontSize={"lg"} fontWeight={"bold"}>
          Ethers Library Examples
        </Text>
        <Text as="cite" fontSize={"sm"}>
          This part using Ethers.js library to interact with the Starknet
          through Rosettanet.
        </Text>
        <Text fontSize="sm">
          Wallet needs to be connected to
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

        <VStack gap={4} align="stretch">
          <Input
            placeholder="Enter Recipient ETH Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />

          <HStack gap={4}>
            <Button onClick={handleEthersConnection} variant="outline">
              Connect With Ethers
            </Button>
            <Button
              onClick={handleFundTransfer}
              loading={loading}
              disabled={loading}
              colorScheme="blue"
            >
              {loading ? "Sending 1 STRK..." : "Send 1 STRK"}
            </Button>
          </HStack>
        </VStack>

        <TransactionList
          transactions={transactions}
          title="Transactions"
          linkText="View on Voyager"
        />
      </VStack>
    </Container>
  );
}
