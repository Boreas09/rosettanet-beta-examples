import { useState } from "react";
import {
  Box,
  Container,
  Text,
  Heading,
  Button,
  Code,
  Stack,
  Link,
  Separator,
  Card,
  Input,
  VStack,
} from "@chakra-ui/react";
import { CodeBlock, dracula } from "react-code-blocks";
import { connect } from "@starknet-io/get-starknet";
import { toaster } from "../../components/ui/toaster";
import {
  executeRosettanetCallMethods,
  executeStarknetJSCallMethods,
  executeSignMessage,
  executeSendTransaction,
  executeAvnuSwap,
  executeSwitchToRosettanet,
  executeStarknetTransaction,
  executeDeclare,
  executeDeploy,
  executeGetPermissions,
  executeGetEndurWithContractCall,
  executeCreateMemecoin,
  codeExamples,
} from "./starknetHelpers";

const LOADING_STATES = {
  IDLE: "idle",
  CONNECT: "connect",
  ROSETTANET_METHODS: "rosettanet-methods",
  STARKNET_METHODS: "starknet-methods",
  SIGN_MESSAGE: "sign-message",
  SEND_TRANSACTION: "send-transaction",
  AVNU_SWAP: "avnu-swap",
  SWITCH_CHAIN: "switch-chain",
  EXECUTE: "execute",
  DECLARE: "declare",
  DEPLOY: "deploy",
  PERMISSIONS: "permissions",
  ENDUR_CALL: "endur-call",
  CREATE_MEMECOIN: "create-memecoin",
};

export default function StarknetjsTrial() {
  const [walletName, setWalletName] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [executeResult, setExecuteResult] = useState("");
  const [endurResult, setEndurResult] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [contractSalt, setContractSalt] = useState("");
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [callMethodResults, setCallMethodResults] = useState({
    blockNumber: "",
    chainId: "",
    estimateGas: "",
    gasPrice: "",
    getBalance: "",
    getBlockByHash: "",
    getBlockByNumber: "",
    getBlockTransactionCountByHash: "",
    getBlockTransactionCountByNumber: "",
    getCode: "",
    getTransactionHashByBlockHashAndIndex: "",
    getTransactionHashByBlockNumberAndIndex: "",
    getTransactionByHash: "",
    getTransactionCount: "",
    getTransactionReceipt: "",
    permissions: "",
  });

  const [starknetCallMethodResults, setStarknetCallMethodResults] = useState({
    chainId: "",
    blockNumber: "",
    getBlockLatestAccepted: "",
    getSpecVersion: "",
    getNonceForAddress: "",
    getBlockWithTxHashes: "",
    getBlockWithTxs: "",
    getBlockWithReceipts: "",
    getBlockStateUpdate: "",
    getBlockTransactionsTraces: "",
    getBlockTransactionCount: "",
    getTransactionByHash: "",
    getTransactionByBlockIdAndIndex: "",
    getTransactionReceipt: "",
    getTransactionTrace: "",
    getTransactionStatus: "",
    simulateTransaction: "",
    getClassHashAt: "",
    getClass: "",
    getClassAt: "",
    getInvokeEstimateFee: "",
  });

  const showToast = (title, description = "", type = "info") => {
    toaster.create({
      title,
      description,
      type: type,
      duration: 5000,
    });
  };

  const showError = (error) => {
    console.error(error);
    showToast(
      "Error",
      typeof error === "string" ? error : error.message || "An error occurred",
      "error"
    );
  };

  const handleConnect = async () => {
    setLoadingState(LOADING_STATES.CONNECT);
    try {
      const res = await connect({ modalMode: "alwaysAsk" });
      console.log(res);
      setWalletName(res?.name || "");
      setSelectedAccount(res);
      showToast(
        "Wallet Connected",
        `Connected to ${res?.name || "wallet"}`,
        "success"
      );
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const handleRosettanetCallMethods = async () => {
    if (!selectedAccount) {
      showError("Please connect your wallet first");
      return;
    }
    setLoadingState(LOADING_STATES.ROSETTANET_METHODS);
    try {
      await executeRosettanetCallMethods(selectedAccount, setCallMethodResults);
      showToast(
        "Rosettanet Methods",
        "Successfully executed all Rosettanet call methods",
        "success"
      );
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const handleStarknetJSCallMethods = async () => {
    if (!selectedAccount) {
      showError("Please connect your wallet first");
      return;
    }
    setLoadingState(LOADING_STATES.STARKNET_METHODS);
    try {
      await executeStarknetJSCallMethods(
        selectedAccount,
        setStarknetCallMethodResults
      );
      showToast(
        "StarknetJS Methods",
        "Successfully executed all StarknetJS call methods",
        "success"
      );
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const handleSignMessage = async () => {
    if (!selectedAccount) {
      showError("Please connect your wallet first");
      return;
    }
    setLoadingState(LOADING_STATES.SIGN_MESSAGE);
    try {
      const result = await executeSignMessage(selectedAccount);
      setSignatures((prevData) => [...prevData, result]);
      showToast("Message Signed", "Successfully signed the message", "success");
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const handleSendTransaction = async () => {
    if (!selectedAccount) {
      showError("Please connect your wallet first");
      return;
    }
    setLoadingState(LOADING_STATES.SEND_TRANSACTION);
    try {
      const result = await executeSendTransaction(selectedAccount);
      setTransactions((prevData) => [...prevData, result]);
      if (/^0x[a-fA-F0-9]{64}$/.test(result)) {
        showToast("Transaction Sent", "Successfully sent 1 STRK", "success");
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const handleAvnuSwap = async () => {
    if (!selectedAccount) {
      showError("Please connect your wallet first");
      return;
    }
    setLoadingState(LOADING_STATES.AVNU_SWAP);
    try {
      const result = await executeAvnuSwap(selectedAccount);
      setTransactions((prevData) => [...prevData, result]);
      showToast("AVNU Swap", "Successfully executed AVNU swap", "success");
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const handleSwitchToRosettanet = async () => {
    if (!selectedAccount) {
      showError("Please connect your wallet first");
      return;
    }
    setLoadingState(LOADING_STATES.SWITCH_CHAIN);
    try {
      await executeSwitchToRosettanet(selectedAccount);
      showToast(
        "Chain Switched",
        "Successfully switched to Rosettanet",
        "success"
      );
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const handleExecute = async () => {
    if (!selectedAccount) {
      showError("Please connect your wallet first");
      return;
    }
    setLoadingState(LOADING_STATES.EXECUTE);
    try {
      const result = await executeStarknetTransaction(selectedAccount);
      setExecuteResult(result);
      setTransactions((prevData) => [...prevData, result]);
      showToast(
        "Transaction Executed",
        "Successfully executed Starknet transaction",
        "success"
      );
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const handleDeclare = async () => {
    if (!selectedAccount) {
      showError("Please connect your wallet first");
      return;
    }
    setLoadingState(LOADING_STATES.DECLARE);
    try {
      await executeDeclare(selectedAccount);
      showToast(
        "Contract Declared",
        "Successfully declared contract",
        "success"
      );
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const handleDeploy = async () => {
    if (!selectedAccount) {
      showError("Please connect your wallet first");
      return;
    }
    setLoadingState(LOADING_STATES.DEPLOY);
    try {
      await executeDeploy(selectedAccount);
      showToast(
        "Contract Deployed",
        "Successfully deployed contract",
        "success"
      );
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const handleGetPermissions = async () => {
    if (!selectedAccount) {
      showError("Please connect your wallet first");
      return;
    }
    setLoadingState(LOADING_STATES.PERMISSIONS);
    try {
      await executeGetPermissions(selectedAccount);
      showToast(
        "Permissions Retrieved",
        "Successfully retrieved permissions",
        "success"
      );
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const handleGetEndurWithContractCall = async () => {
    if (!selectedAccount) {
      showError("Please connect your wallet first");
      return;
    }
    setLoadingState(LOADING_STATES.ENDUR_CALL);
    try {
      const result = await executeGetEndurWithContractCall(selectedAccount);
      setEndurResult(result);
      showToast(
        "Contract Call Complete",
        "Successfully executed Endur contract call",
        "success"
      );
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const handleCreateMemecoin = async (e) => {
    e.preventDefault();
    if (!selectedAccount) {
      showError("Please connect your wallet first");
      return;
    }
    setLoadingState(LOADING_STATES.CREATE_MEMECOIN);
    try {
      const result = await executeCreateMemecoin(
        selectedAccount,
        tokenName,
        tokenSymbol,
        initialSupply,
        contractSalt
      );
      setExecuteResult(result);
      setTransactions((prevData) => [...prevData, result]);
      showToast("Memecoin Created", "Successfully created memecoin", "success");
    } catch (error) {
      showError(error);
    } finally {
      setLoadingState(LOADING_STATES.IDLE);
    }
  };

  const isLoading = (state) => loadingState === state;

  return (
    <Container maxW="3xl" overflowX="hidden">
      <Heading as="h3" size="lg" my={4}>
        Connect With Starknet.js
      </Heading>

      <Text as="cite" fontSize="sm">
        This part you can connect to Starknet with using Starknet.js and
        get-starknet. It will connect with MetaMask for now. Supports both
        Starknet and Ethereum requests. Both Metamask and Metamask Snaps will be
        in modal. Metamask Normal is the one added.
      </Text>

      <Text as="cite" fontSize="sm" display="block" mt={2}>
        If your wallet is connected before this page, please disconnect it from
        left side. If not there will be an error.
      </Text>

      <Box
        display="grid"
        gridTemplateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        gap={4}
        my={4}
      >
        <Button
          onClick={handleConnect}
          loading={isLoading(LOADING_STATES.CONNECT)}
          size="md"
          variant={"outline"}
        >
          Connect Wallet
        </Button>

        <Button
          onClick={handleSwitchToRosettanet}
          loading={isLoading(LOADING_STATES.SWITCH_CHAIN)}
          size="md"
        >
          Switch to Rosettanet
        </Button>

        <Button
          onClick={handleSignMessage}
          loading={isLoading(LOADING_STATES.SIGN_MESSAGE)}
          size="md"
        >
          Sign Message
        </Button>

        <Button
          onClick={handleRosettanetCallMethods}
          loading={isLoading(LOADING_STATES.ROSETTANET_METHODS)}
          size="md"
        >
          Rosettanet Methods
        </Button>

        <Button
          onClick={handleStarknetJSCallMethods}
          loading={isLoading(LOADING_STATES.STARKNET_METHODS)}
          size="md"
        >
          StarknetJS Methods
        </Button>

        <Button
          onClick={handleGetPermissions}
          loading={isLoading(LOADING_STATES.PERMISSIONS)}
          size="md"
        >
          Get Permissions
        </Button>

        <Button
          onClick={handleSendTransaction}
          loading={isLoading(LOADING_STATES.SEND_TRANSACTION)}
          size="md"
        >
          Send 1 STRK
        </Button>

        <Button
          onClick={handleAvnuSwap}
          loading={isLoading(LOADING_STATES.AVNU_SWAP)}
          size="md"
        >
          AVNU Swap
        </Button>

        <Button
          onClick={handleExecute}
          loading={isLoading(LOADING_STATES.EXECUTE)}
          size="md"
        >
          Execute
        </Button>

        <Button
          onClick={handleDeclare}
          loading={isLoading(LOADING_STATES.DECLARE)}
          size="md"
        >
          Declare
        </Button>

        <Button
          onClick={handleDeploy}
          loading={isLoading(LOADING_STATES.DEPLOY)}
          size="md"
        >
          Deploy
        </Button>

        <Button
          onClick={handleGetEndurWithContractCall}
          loading={isLoading(LOADING_STATES.ENDUR_CALL)}
          size="md"
        >
          Endur Contract Call
        </Button>
      </Box>

      <form onSubmit={handleCreateMemecoin} style={{ marginTop: "1rem" }}>
        <Stack gap={4}>
          <Input
            placeholder="Token Name"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            required
          />

          <Input
            placeholder="Token Symbol"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            required
          />

          <Input
            placeholder="Token Initial Supply"
            type="number"
            min="0"
            value={initialSupply}
            onChange={(e) => setInitialSupply(e.target.value)}
            required
          />

          <Input
            placeholder="Token Contract Address Salt"
            value={contractSalt}
            onChange={(e) => setContractSalt(e.target.value)}
            required
          />

          <Button
            type="submit"
            loading={isLoading(LOADING_STATES.CREATE_MEMECOIN)}
          >
            Create Memecoin
          </Button>
        </Stack>
      </form>

      <Separator my={5} />

      <Text>Wallet Name: {walletName}</Text>

      <Separator my={5} />

      <Text>
        Endur LST Contract Call (read call asset()) Result: {endurResult}
      </Text>

      <Separator my={5} />

      {transactions.length > 0 && (
        <Box my={5}>
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

      {signatures.length > 0 && (
        <Box my={5}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Recent Signatures
          </Text>
          <VStack gap={3}>
            {signatures.map((sig, index) => (
              <Card.Root key={index} size="sm" w="full">
                <Card.Body>
                  <VStack align="start" gap={2}>
                    <Text fontSize="sm" fontWeight="bold">
                      Signature #{index + 1}
                    </Text>
                    <Text fontSize="xs" color="gray.500" wordBreak="break-all">
                      {sig}
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </VStack>
        </Box>
      )}

      <Box>
        <Text fontSize="lg" fontWeight="bold">
          StarknetJS Wallet Account Methods
        </Text>
        <Text mt={3} mb={3}>
          We can use <Code>execute</Code> method same with StarknetJS's wallet
          account. Sending starknet calldata as parameters is enough.
        </Text>

        <Box my={4}>
          <Text fontWeight="bold">Example 1 Execute Method</Text>
          <CodeBlock
            text={codeExamples.executeExample}
            language="javascript"
            showLineNumbers={true}
            startingLineNumber={1}
            theme={dracula}
          />
        </Box>

        <Box my={4}>
          <Text fontWeight="bold">Example 2 Contract Call</Text>
          <CodeBlock
            text={codeExamples.contractCallExample}
            language="javascript"
            showLineNumbers={true}
            startingLineNumber={1}
            theme={dracula}
          />
        </Box>
      </Box>

      <Separator mt={10} mb={10} />

      <Stack
        direction={{ base: "column", md: "row" }}
        gap={4}
        align="flex-start"
      >
        <Box flex="1">
          <Text fontWeight="bold">Rosettanet Call Methods:</Text>
          <Code
            display="block"
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            p={3}
            borderRadius="md"
          >
            {JSON.stringify(callMethodResults, null, 2)}
          </Code>
        </Box>

        <Box flex="1">
          <Text fontWeight="bold">StarknetJS Call Methods:</Text>
          <Code
            display="block"
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            p={3}
            borderRadius="md"
          >
            {JSON.stringify(starknetCallMethodResults, null, 2)}
          </Code>
        </Box>
      </Stack>
    </Container>
  );
}
