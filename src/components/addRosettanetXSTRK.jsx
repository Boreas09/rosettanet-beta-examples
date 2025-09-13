import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { toaster } from "./ui/toaster";

export default function AddRosettanetXSTRK() {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const addToken = async () => {
    if (window.ethereum && address) {
      setLoading(true);
      try {
        const tokenAddress = "0xb401bb848a7514a768e21c9f84cc6372c6629b59"; // Replace with your token's contract address
        const tokenSymbol = "xSTRK"; // Replace with your token's symbol
        const tokenDecimals = 18; // Replace with your token's decimals

        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
            },
          },
        });

        if (wasAdded) {
          toaster.create({
            title: "Success",
            description: "Token successfully added to Wallet.",
            type: "success",
            duration: 9000,
          });
        } else {
          toaster.create({
            title: "Error",
            description: "Token addition declined.",
            type: "error",
            duration: 9000,
          });
        }
      } catch (error) {
        console.error("Error adding token:", error);
        toaster.create({
          title: "Error",
          description: error.message,
          type: "error",
          duration: 9000,
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toaster.create({
        title: "Wallet Error",
        description: "Wallet is not available. Please connect your wallet.",
        type: "error",
        duration: 9000,
      });
    }
  };

  if (loading) {
    return (
      <Button loading minW="100%" variant="ghost">
        Add RosettaNet xSTRK
      </Button>
    );
  }

  return (
    <Button onClick={addToken} minW="100%" variant="ghost">
      Add RosettaNet xSTRK
    </Button>
  );
}
