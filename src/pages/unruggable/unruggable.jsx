import { useState } from "react";
import {
  Button,
  Container,
  Input,
  Text,
  Stack,
  Card,
  Link,
  VStack,
  Box,
} from "@chakra-ui/react";
import { sendTransaction } from "@wagmi/core";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { getStarknetAddress } from "../../utils/starknetUtils";
import { useContract } from "../../context/ContractContext";
import { cairo } from "starknet";
import { asciiToHex } from "../../utils/asciiToHex";
import { reownConfig } from "../../utils/appkitProvider";
import { prepareMulticallCalldata } from "rosettanet";
import { toaster } from "../../components/ui/toaster";

export default function Unruggable() {
  const { address, chainId } = useAccount();
  const { selectedContract } = useContract();
  const [transactions, setTransactions] = useState([]);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [contractSalt, setContractSalt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();

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

    if (
      tokenName.length > 30 ||
      tokenSymbol.length > 30 ||
      contractSalt.length > 30
    ) {
      toaster.create({
        title: "Validation Error",
        description:
          "Name, Symbol and Salt needs to be felt252. Less than 30 characters",
        type: "error",
        duration: 9000,
      });
      setLoading(false);
      return;
    }

    const initialSupplyUint256 = cairo.uint256(initialSupply);

    if (
      cairo.isTypeUint256([
        BigInt(initialSupplyUint256.low, 16),
        BigInt(initialSupplyUint256.high, 16),
      ])
    ) {
      toaster.create({
        title: "Validation Error",
        description: "initialSupply needs to be Uint256.",
        type: "error",
        duration: 9000,
      });
      setLoading(false);
      return;
    }

    try {
      const snAddress = await getStarknetAddress(address, selectedContract);

      const createMemecoinCalldata = [
        {
          contract_address:
            "0x00494a72a742b7880725a965ee487d937fa6d08a94ba4eb9e29dd0663bc653a2",
          entry_point:
            "0x014b9c006653b96dd1312a62b5921c465d08352de1546550f0ed804fcc0ef9e9",
          calldata: [
            snAddress,
            "0x" + asciiToHex(tokenName),
            "0x" + asciiToHex(tokenSymbol),
            "0x" + initialSupplyUint256.low.toString(16),
            "0x" + initialSupplyUint256.high.toString(16),
            "0x" + asciiToHex(contractSalt),
          ],
        },
      ];

      const response = await sendTransaction(reownConfig, {
        chainId: 1381192787,
        account: address,
        to: "0x0000000000000000000000004645415455524553",
        value: parseEther("0"),
        data: prepareMulticallCalldata(createMemecoinCalldata),
      });

      console.log("Transaction sent:", response);
      setTransactions((prevData) => [...prevData, response]);

      toaster.create({
        title: "Success",
        description:
          "Memecoin created successfully! Check the transaction on Voyager.",
        type: "success",
        duration: 5000,
      });

      // Reset form
      setTokenName("");
      setTokenSymbol("");
      setInitialSupply("");
      setContractSalt("");
    } catch (e) {
      console.error(e);
      toaster.create({
        title: "Error",
        description: `Transaction failed: ${e.message || JSON.stringify(e)}`,
        type: "error",
        duration: 9000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="3xl" overflow={"hidden"}>
      <VStack align="stretch">
        <Text fontSize={"lg"} fontWeight={"bold"}>
          Creating a token with using Unruggable Meme
        </Text>
        <Text as="cite" fontSize={"sm"}>
          This part using Unruggable Meme to create a token with given
          parameters. After successfully sent we can see our token in starknet
          sepolia explorer.
        </Text>
        <Text fontSize="sm">
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

        <Box as="form" onSubmit={handleCreate}>
          <VStack gap={4} align="stretch">
            <Input
              placeholder="Token Name"
              aria-label="Token Name"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              required
            />
            <Input
              placeholder="Token Symbol"
              aria-label="Token Symbol"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              required
            />
            <Input
              placeholder="Token Initial Supply"
              aria-label="Token Initial Supply"
              type="number"
              min="0"
              value={initialSupply}
              onChange={(e) => setInitialSupply(e.target.value)}
              required
            />
            <Input
              placeholder="Token Contract Address Salt"
              aria-label="Token Contract Address Salt"
              value={contractSalt}
              onChange={(e) => setContractSalt(e.target.value)}
              required
            />
            <Button type="submit" loading={loading} disabled={loading}>
              {loading ? "Creating Memecoin..." : "Create Memecoin"}
            </Button>
          </VStack>
        </Box>

        <Text fontSize={"lg"} fontWeight={"bold"} mt={6}>
          Transactions
        </Text>

        <VStack gap={3} align="stretch">
          {transactions.map((tx, index) => (
            <Card.Root key={tx} size={"sm"} borderRadius={"lg"}>
              <Card.Body>
                <Stack gap={2}>
                  <Text fontSize={"sm"} fontWeight={"bold"}>
                    Transaction {index + 1}
                  </Text>
                  <Text fontSize={"sm"} wordBreak="break-all">
                    Transaction Hash: {tx}
                  </Text>
                  <Link
                    fontSize={"sm"}
                    href={`https://sepolia.voyager.online/tx/${tx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.500"
                  >
                    View on Voyager
                  </Link>
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}
