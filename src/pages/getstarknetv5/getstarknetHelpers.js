import { getStarknetAddress } from "../../utils/starknetUtils";
import { cairo } from "starknet";
import { parseEther } from "ethers";
import { EvmWalletsWithStarknetFeatures } from "rosettanet";

// Get available wallets
export const getAvailableWallets = async () => {
  try {
    const availableWallets = await EvmWalletsWithStarknetFeatures();
    return availableWallets;
  } catch (error) {
    console.error("Error getting available wallets:", error);
    throw error;
  }
};

// Connect wallet
export const connectWallet = async (wallet) => {
  try {
    await wallet.features["standard:connect"].connect();
    return { success: true, message: `Connected to ${wallet.injected.name}` };
  } catch (error) {
    console.error("Connect error:", error);
    throw new Error(`Failed to connect to ${wallet.injected.name}: ${error.message}`);
  }
};

// Disconnect wallet
export const disconnectWallet = async (wallet) => {
  try {
    await wallet.features["standard:disconnect"].disconnect();
    return {
      success: true,
      message: "Disconnecting can be tricky because we have a lot of wallet libraries but once you disconnect with get-starknet v5 you cannot send any requests with it."
    };
  } catch (error) {
    console.error("Disconnect error:", error);
    throw new Error(`Failed to disconnect from ${wallet.injected.name}: ${error.message}`);
  }
};

// AVNU swap function
export const executeAvnuSwapV5 = async (wallet) => {
  if (!wallet.accounts[0]) {
    throw new Error("Please Connect Your Wallet With Get-Starknet V5.");
  }

  const address = wallet.accounts[0].address;
  const snAddress = await getStarknetAddress(address);

  const getQuotes = await fetch(
    "https://sepolia.api.avnu.fi/swap/v2/quotes?sellTokenAddress=0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d&buyTokenAddress=0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7&sellAmount=0xDE0B6B3A7640000&onlyDirect=true&PULSAR_MONEY_FEE_RECIPIENT.value=0"
  );
  const getQuotesResponse = await getQuotes.json();
  const quoteId = getQuotesResponse[0].quoteId;

  const postBody = {
    quoteId: quoteId,
    takerAddress: snAddress,
    slippage: "0.05",
    includeApprove: true,
  };

  const buildSwapData = await fetch(
    "https://sepolia.api.avnu.fi/swap/v2/build",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    }
  );

  const buildSwapDataResponse = await buildSwapData.json();

  const calldata = [
    {
      contractAddress:
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      entrypoint: "approve",
      calldata: buildSwapDataResponse.calls[0].calldata,
    },
    {
      contractAddress:
        "0x2c56e8b00dbe2a71e57472685378fc8988bba947e9a99b26a00fade2b4fe7c2",
      entrypoint: "multi_route_swap",
      calldata: buildSwapDataResponse.calls[1].calldata,
    },
  ];

  const response = await wallet.features["starknet:walletApi"].request({
    type: "wallet_addInvokeTransaction",
    params: calldata,
  });

  console.log("AVNU transaction sent:", response);
  return response;
};

// Endur LST stake function
export const executeEndurLstStake = async (wallet) => {
  if (!wallet.accounts[0]) {
    throw new Error("Please Connect Your Wallet With Get-Starknet V5.");
  }

  const address = wallet.accounts[0].address;
  const snAddress = await getStarknetAddress(address);
  const starkAmount = cairo.uint256(parseEther("1"));

  const calldata = [
    {
      contractAddress:
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      entrypoint:
        "0x0219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c",
      calldata: [
        "0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb",
        "0x" + BigInt(starkAmount.low).toString(16),
        "0x" + BigInt(starkAmount.high).toString(16),
      ],
    },
    {
      contractAddress:
        "0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb",
      entrypoint:
        "0x00c73f681176fc7b3f9693986fd7b14581e8d540519e27400e88b8713932be01",
      calldata: [
        "0x" + BigInt(starkAmount.low).toString(16),
        "0x" + BigInt(starkAmount.high).toString(16),
        snAddress,
      ],
    },
  ];

  const response = await wallet.features["starknet:walletApi"].request({
    type: "wallet_addInvokeTransaction",
    params: calldata,
  });

  console.log("Endur LST stake transaction sent:", response);
  return response;
};

// Send STRK function
export const executeSendSTRK = async (wallet, recipient) => {
  if (!wallet.accounts[0]) {
    throw new Error("Please Connect Your Wallet With Get-Starknet V5.");
  }

  if (!recipient) {
    throw new Error("Please Enter Recipient.");
  }

  const address = wallet.accounts[0].address;
  const snAddress = await getStarknetAddress(address);
  const starkAmount = cairo.uint256(parseEther("1"));

  const calldata = [
    {
      contractAddress:
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      entrypoint:
        "0x0219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c",
      calldata: [
        snAddress,
        "0x" + BigInt(starkAmount.low).toString(16),
        "0x" + BigInt(starkAmount.high).toString(16),
      ],
    },
    {
      contractAddress:
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      entrypoint:
        "0x0083afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e",
      calldata: [
        recipient,
        "0x" + BigInt(starkAmount.low).toString(16),
        "0x" + BigInt(starkAmount.high).toString(16),
      ],
    },
  ];

  const response = await wallet.features["starknet:walletApi"].request({
    type: "wallet_addInvokeTransaction",
    params: calldata,
  });

  console.log("Send STRK transaction sent:", response);
  return response;
};

// Sign message function
export const executeSignMessageV5 = async (wallet) => {
  if (!wallet.accounts[0]) {
    throw new Error("Please Connect Your Wallet With Get-Starknet V5.");
  }

  const snMSG = {
    domain: {
      name: "DappLand",
      chainId: 1381192787,
      version: "1.0.2",
    },
    message: {
      name: "MonKeyCollection",
      value: 2312,
    },
    primaryType: "Simple",
    types: {
      Simple: [
        {
          name: "name",
          type: "shortstring",
        },
        {
          name: "value",
          type: "u128",
        },
      ],
      StarknetDomain: [
        {
          name: "name",
          type: "shortstring",
        },
        {
          name: "chainId",
          type: "shortstring",
        },
        {
          name: "version",
          type: "shortstring",
        },
      ],
    },
  };

  const response = await wallet.features["starknet:walletApi"].request({
    type: "wallet_signTypedData",
    params: JSON.stringify(snMSG),
  });

  console.log("Message signed:", response);
  return response;
};

// Watch asset function
export const executeWatchAsset = async (wallet) => {
  if (!wallet.accounts[0]) {
    throw new Error("Please Connect Your Wallet With Get-Starknet V5.");
  }

  const tokenAddress = "0xb5e1278663de249f8580ec51b6b61739bd906215";
  const tokenSymbol = "ETH";
  const tokenDecimals = 18;

  const asset = {
    type: "ERC20",
    options: {
      address: tokenAddress,
      symbol: tokenSymbol,
      decimals: tokenDecimals,
    },
  };

  const response = await wallet.features["starknet:walletApi"].request({
    type: "wallet_watchAsset",
    params: asset,
  });

  console.log("Asset watched:", response);
  return response;
};