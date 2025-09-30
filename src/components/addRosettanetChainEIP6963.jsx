/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useChainId, useAccount } from "wagmi";
import { toaster } from "./ui/toaster";
import { useWalletProvider } from "../utils/useWalletProvider";

const rosettanetRender = "https://rosettanet.onrender.com/";
const rosettanetLocal = "http://localhost:3000/";

export default function AddRosettanetChainEIP6963() {
  const chainId = useChainId();
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const walletProvider = useWalletProvider();

  async function addRosettanet() {
    if (walletProvider && address) {
      setLoading(true);
      try {
        const wasAdded = await walletProvider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x52535453",
              blockExplorerUrls: ["https://sepolia.voyager.online"],
              chainName: "RosettaNet",
              nativeCurrency: {
                decimals: 18,
                name: "STRK",
                symbol: "STRK",
              },
              rpcUrls: [rosettanetRender],
            },
          ],
        });

        if (wasAdded === null) {
          toaster.create({
            title: "Success",
            description:
              "RosettaNet successfully added to Wallet or changed to RosettaNet Chain.",
            type: "success",
            duration: 9000,
          });
        } else {
          if (chainId === 1381192787) {
            toaster.create({
              title: "Success",
              description:
                "RosettaNet already added, changed to RosettaNet Chain.",
              type: "success",
              duration: 9000,
            });
          } else {
            toaster.create({
              title: "Error",
              description: "RosettaNet addition declined.",
              type: "error",
              duration: 9000,
            });
          }
        }
      } catch (err) {
        toaster.create({
          title: "Error",
          description: err.message,
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
  }

  if (loading) {
    return (
      <Button loading minW="100%" variant="ghost">
        Adding RosettaNet Chain
      </Button>
    );
  }

  return (
    <Button onClick={addRosettanet} minW="100%" variant="ghost">
      Add RosettaNet Chain
    </Button>
  );
}