import React from "react";
import {
  Box,
  Button,
  Text,
  Input,
  Card,
  Stack,
  Link,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { getStarknetAddress } from "../../utils/starknetUtils";
import { useContract } from "../../context/ContractContext";
import { parseEther } from "ethers";
import { sendTransaction } from "@wagmi/core";
import { cairo } from "starknet";
import { reownConfig } from "../../utils/appkitProvider";
import { prepareMulticallCalldata } from "rosettanet";
import { toaster } from "../../components/ui/toaster";

export default function EndurLstUnstake() {
  const { address, chainId } = useAccount();
  const { selectedContract } = useContract();
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUnstake = async () => {
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

    try {
      const snAddress = (
        await getStarknetAddress(address, selectedContract)
      ).toString(16);

      const starkAmount = cairo.uint256(parseEther(amount));
      const calldata = [
        {
          contract_address:
            "0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb",
          entry_point:
            "0x15511cc3694f64379908437d6d64458dc76d02482052bfb8a5b33a72c054c77",
          calldata: [
            "0x" + BigInt(starkAmount.low).toString(16),
            "0x" + BigInt(starkAmount.high).toString(16),
            snAddress,
            snAddress,
          ],
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

      toaster.create({
        title: "Success",
        description:
          "Unstake transaction sent successfully! Unstaking can take ~21 days.",
        type: "success",
        duration: 8000,
      });
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
    <Box>
      <Text fontSize={"lg"} fontWeight={"bold"}>
        Endur LST Unstaking
      </Text>
      <Text as="cite" fontSize={"sm"}>
        This part using Endur LST to unstake xSTRK and get STRK. After
        transaction successfully sent we can see our STRK amount in Rosettanet
        chain in Wallet. Unstaking STRK can take a long time ~21 days.
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

      <Stack
        direction={{ base: "column", md: "row" }}
        gap={4}
        align="stretch"
        my={5}
      >
        <Input
          placeholder="Enter xSTRK Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={handleUnstake} loading={loading} disabled={loading}>
          {loading ? "Unstaking xSTRK..." : "Unstake xSTRK"}
        </Button>
      </Stack>

      <Text mt={2} fontSize={"lg"} fontWeight={"bold"}>
        Transactions
      </Text>

      <VStack gap={3} align="stretch" mt={4}>
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
    </Box>
  );
}
