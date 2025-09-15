import {
  Box,
  Button,
  Text,
  Input,
  Stack,
  VStack,
  Container,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { getStarknetAddress } from "../../utils/starknetUtils";
import { useContract } from "../../context/ContractContext";
import { sendTransaction } from "@wagmi/core";
import { cairo } from "starknet";
import { reownConfig } from "../../utils/appkitProvider";
import { prepareMulticallCalldata } from "rosettanet";
import { parseEther } from "ethers";
import { toaster } from "../../components/ui/toaster";
import TransactionList from "../../components/TransactionList";

export default function EndurLstStake() {
  const { address, chainId } = useAccount();
  const { selectedContract } = useContract();
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleStake = async () => {
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
      const snAddress = await getStarknetAddress(address, selectedContract);

      const starkAmount = cairo.uint256(parseEther(amount));
      const calldata = [
        {
          contract_address:
            "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          entry_point:
            "0x0219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c",
          calldata: [
            "0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb",
            "0x" + BigInt(starkAmount.low).toString(16),
            "0x" + BigInt(starkAmount.high).toString(16),
          ],
        },
        {
          contract_address:
            "0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb",
          entry_point:
            "0x00c73f681176fc7b3f9693986fd7b14581e8d540519e27400e88b8713932be01",
          calldata: [
            "0x" + BigInt(starkAmount.low).toString(16),
            "0x" + BigInt(starkAmount.high).toString(16),
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
        description: "Transaction sent successfully!",
        type: "success",
        duration: 5000,
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
    <VStack gap="6" align="stretch">
      <Box>
        <Text fontSize={"lg"} fontWeight={"bold"}>
          Endur LST Staking
        </Text>
        <Text as="cite" fontSize={"sm"}>
          This part using Endur LST to stake STRK and get xSTRK. After
          transaction successfully sent we can see our xSTRK amount in
          Rosettanet chain in Wallet.
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
            placeholder="Enter STRK Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button onClick={handleStake} loading={loading} disabled={loading}>
            {loading ? "Staking STRK..." : "Stake STRK"}
          </Button>
        </Stack>

        <TransactionList transactions={transactions} />
      </Box>
    </VStack>
  );
}
