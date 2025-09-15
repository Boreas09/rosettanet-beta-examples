import { useState, useEffect } from "react";
import {
  Button,
  Text,
  Card,
  Link,
  Container,
  Input,
  VStack,
  Box,
  Separator,
  Heading,
} from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster";
import {
  getAvailableWallets,
  connectWallet,
  disconnectWallet,
  executeAvnuSwapV5,
  executeEndurLstStake,
  executeSendSTRK,
  executeSignMessageV5,
  executeWatchAsset,
} from "./getstarknetHelpers";
import TransactionList from "../../components/TransactionList";

// Loading states for each wallet and action
const LOADING_ACTIONS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  AVNU: "avnu",
  ENDUR: "endur",
  SEND_STRK: "send-strk",
  SIGN: "sign",
  WATCH_ASSET: "watch-asset",
};

export default function GetStarknetV5() {
  const [transactions, setTransactions] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [loadingStates, setLoadingStates] = useState({}); // { walletName: { action: boolean } }

  useEffect(() => {
    async function getWallets() {
      try {
        const availableWallets = await getAvailableWallets();
        setWallets(availableWallets);
      } catch (error) {
        showError("Failed to get available wallets", error);
      }
    }
    getWallets();
  }, []);

  const showToast = (title, description = "", type = "info") => {
    toaster.create({
      title,
      description,
      type: type,
      duration: 5000,
    });
  };

  const showError = (title, error) => {
    console.error(error);
    showToast(
      title,
      typeof error === "string" ? error : error.message || "An error occurred",
      "error"
    );
  };

  const setWalletLoading = (walletName, action, loading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [walletName]: {
        ...prev[walletName],
        [action]: loading,
      },
    }));
  };

  const isWalletLoading = (walletName, action) => {
    return loadingStates[walletName]?.[action] || false;
  };

  const handleConnect = async (wallet) => {
    const walletName = wallet.injected.name;
    setWalletLoading(walletName, LOADING_ACTIONS.CONNECT, true);
    try {
      const result = await connectWallet(wallet);
      showToast("Wallet Connected", result.message, "success");
    } catch (error) {
      showError("Connection Failed", error);
    } finally {
      setWalletLoading(walletName, LOADING_ACTIONS.CONNECT, false);
    }
  };

  const handleDisconnect = async (wallet) => {
    const walletName = wallet.injected.name;
    setWalletLoading(walletName, LOADING_ACTIONS.DISCONNECT, true);
    try {
      const result = await disconnectWallet(wallet);
      showToast("Wallet Disconnected", result.message, "warning");
    } catch (error) {
      showError("Disconnection Failed", error);
    } finally {
      setWalletLoading(walletName, LOADING_ACTIONS.DISCONNECT, false);
    }
  };

  const handleAvnu = async (wallet) => {
    const walletName = wallet.injected.name;
    setWalletLoading(walletName, LOADING_ACTIONS.AVNU, true);
    try {
      const response = await executeAvnuSwapV5(wallet);
      setTransactions((prevData) => [...prevData, response]);
      showToast("AVNU Swap", "Successfully executed AVNU swap", "success");
    } catch (error) {
      showError("AVNU Swap Failed", error);
    } finally {
      setWalletLoading(walletName, LOADING_ACTIONS.AVNU, false);
    }
  };

  const handleEndurLstStake = async (wallet) => {
    const walletName = wallet.injected.name;
    setWalletLoading(walletName, LOADING_ACTIONS.ENDUR, true);
    try {
      const response = await executeEndurLstStake(wallet);
      setTransactions((prevData) => [...prevData, response]);
      showToast("Endur LST Stake", "Successfully staked 1 STRK", "success");
    } catch (error) {
      showError("Endur LST Stake Failed", error);
    } finally {
      setWalletLoading(walletName, LOADING_ACTIONS.ENDUR, false);
    }
  };

  const handleSendSTRK = async (wallet) => {
    const walletName = wallet.injected.name;
    setWalletLoading(walletName, LOADING_ACTIONS.SEND_STRK, true);
    try {
      const response = await executeSendSTRK(wallet, recipient);
      setTransactions((prevData) => [...prevData, response]);
      showToast("STRK Sent", "Successfully sent 1 STRK", "success");
    } catch (error) {
      showError("Send STRK Failed", error);
    } finally {
      setWalletLoading(walletName, LOADING_ACTIONS.SEND_STRK, false);
    }
  };

  const handleSignMessage = async (wallet) => {
    const walletName = wallet.injected.name;
    setWalletLoading(walletName, LOADING_ACTIONS.SIGN, true);
    try {
      const response = await executeSignMessageV5(wallet);
      setSignatures((prevData) => [...prevData, response]);
      showToast("Message Signed", "Successfully signed the message", "success");
    } catch (error) {
      showError("Sign Message Failed", error);
    } finally {
      setWalletLoading(walletName, LOADING_ACTIONS.SIGN, false);
    }
  };

  const handleWatchAsset = async (wallet) => {
    const walletName = wallet.injected.name;
    setWalletLoading(walletName, LOADING_ACTIONS.WATCH_ASSET, true);
    try {
      await executeWatchAsset(wallet);
      showToast(
        "Asset Watched",
        "Successfully added asset to watch list",
        "success"
      );
    } catch (error) {
      showError("Watch Asset Failed", error);
    } finally {
      setWalletLoading(walletName, LOADING_ACTIONS.WATCH_ASSET, false);
    }
  };

  return (
    <Container maxW="3xl" overflowX="hidden">
      <VStack gap={3} align="stretch">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }}>
          Get Starknet V5 Examples
        </Heading>

        <Text fontSize="sm">
          This part using get-starknet V5 library to interact with the Starknet
          through Rosettanet.
        </Text>

        <Box>
          <Text fontSize="sm" mb={2}>
            Features:
          </Text>
          <VStack align="start" gap={1} pl={4} fontSize="sm">
            <Text>• Avnu button swaps 1 STRK to 1 ETH via Avnu</Text>
            <Text>
              • Endur LST button stakes 1 STRK and returns xSTRK via Endur
            </Text>
            <Text>• Send 1 STRK button sends 1 STRK to Recipient Address</Text>
          </VStack>
        </Box>

        <Input
          placeholder="Enter Recipient Starknet Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          size="md"
        />

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

        <Box>
          <Text mb={4} fontSize="lg" fontWeight="bold">
            Available Wallets
          </Text>

          <VStack gap={4}>
            {wallets.map((wallet) => (
              <Card.Root key={wallet.injected.name} size="sm" w="full">
                <Card.Body>
                  <VStack align="stretch" gap={4}>
                    <Text fontSize="sm" fontWeight="bold">
                      {wallet.injected.name}
                    </Text>

                    <Box
                      display="grid"
                      gridTemplateColumns={{
                        base: "repeat(2, 1fr)",
                        sm: "repeat(3, 1fr)",
                        md: "repeat(4, 1fr)",
                        lg: "repeat(7, 1fr)",
                      }}
                      gap={2}
                    >
                      <Button
                        onClick={() => handleConnect(wallet)}
                        loading={isWalletLoading(
                          wallet.injected.name,
                          LOADING_ACTIONS.CONNECT
                        )}
                        size="sm"
                        variant="outline"
                      >
                        Connect
                      </Button>

                      <Button
                        onClick={() => handleDisconnect(wallet)}
                        loading={isWalletLoading(
                          wallet.injected.name,
                          LOADING_ACTIONS.DISCONNECT
                        )}
                        size="sm"
                        variant="outline"
                      >
                        Disconnect
                      </Button>

                      <Button
                        onClick={() => handleAvnu(wallet)}
                        loading={isWalletLoading(
                          wallet.injected.name,
                          LOADING_ACTIONS.AVNU
                        )}
                        size="sm"
                      >
                        Avnu
                      </Button>

                      <Button
                        onClick={() => handleEndurLstStake(wallet)}
                        loading={isWalletLoading(
                          wallet.injected.name,
                          LOADING_ACTIONS.ENDUR
                        )}
                        size="sm"
                      >
                        Endur LST
                      </Button>

                      <Button
                        onClick={() => handleSendSTRK(wallet)}
                        loading={isWalletLoading(
                          wallet.injected.name,
                          LOADING_ACTIONS.SEND_STRK
                        )}
                        size="sm"
                      >
                        Send STRK
                      </Button>

                      <Button
                        onClick={() => handleSignMessage(wallet)}
                        loading={isWalletLoading(
                          wallet.injected.name,
                          LOADING_ACTIONS.SIGN
                        )}
                        size="sm"
                      >
                        Sign
                      </Button>

                      <Button
                        onClick={() => handleWatchAsset(wallet)}
                        loading={isWalletLoading(
                          wallet.injected.name,
                          LOADING_ACTIONS.WATCH_ASSET
                        )}
                        size="sm"
                      >
                        Watch Asset
                      </Button>
                    </Box>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </VStack>
        </Box>

        {transactions.length > 0 && (
          <>
            <Separator />
            <TransactionList transactions={transactions} />
          </>
        )}

        {signatures.length > 0 && (
          <>
            <Separator />
            <Box>
              <Text mb={4} fontSize="lg" fontWeight="bold">
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
                        <Text
                          fontSize="xs"
                          color="gray.500"
                          wordBreak="break-all"
                        >
                          {typeof sig === "string" ? sig : JSON.stringify(sig)}
                        </Text>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                ))}
              </VStack>
            </Box>
          </>
        )}
      </VStack>
    </Container>
  );
}
