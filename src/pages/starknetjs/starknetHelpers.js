import { Contract, WalletAccount, cairo } from "starknet";
import { getStarknetAddress } from "../../utils/starknetUtils";
import { asciiToHex } from "../../utils/asciiToHex";
import { prepareMulticallCalldata, RosettanetAccount } from "rosettanet";
import { ENDURLST_ABI } from "./endurLSTABI.js";

const node = "https://rosettanet.onrender.com/";
const nodeStrk =
  "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/Ml3s1yVYyyuskNoJAAkuAUDSWv7eH51C";

// Shared transaction data
export const snTx = {
  type: "INVOKE_FUNCTION",
  contractAddress:
    "0x0239d830fcff445b380b53473e8907cb32bfd8fe68579a76a4014382f931e2b1",
  calldata: [
    "0x2",
    "0xaa79a8e98e1c8fac6fe4dd0e677d01bf1ca5f419",
    "0x1",
    "0x98af802404e21",
    "0x98af802404e21",
    "0x0",
    "0x5208",
    "0xde0b6b3a7640000",
    "0x0",
    "0x0",
  ],
  version: "0x3",
  signature: [
    "0x88552c4d654b9f2270d022ed565f4ada",
    "0x3d481d75612b44edf05122ea41e019bf",
    "0x159b964f5040b54abd479f852b185bf3",
    "0x41ee1fa020cde5ade8cb8e394603c0ce",
    "0x1b",
    "0xde0b6b3a7640000",
    "0x0",
  ],
  nonce: "0xb",
  max_fee: "0x0",
  resourceBounds: {
    l1_gas: {
      max_amount: "0x5280",
      max_price_per_unit: "0x5280",
    },
    l2_gas: {
      max_amount: "0x0",
      max_price_per_unit: "0x0",
    },
  },
  tip: "0x0",
  paymasterData: [],
  accountDeploymentData: [],
  nonceDataAvailabilityMode: "L1",
  feeDataAvailabilityMode: "L1",
};

// Helper function to connect account
export const connectAccount = async (selectedAccount) => {
  if (!selectedAccount) {
    throw new Error("No selected account");
  }

  return typeof selectedAccount.sendAsync === "function" &&
    typeof selectedAccount.send === "function"
    ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
    : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount);
};

// Connect account for Rosettanet-specific calls
export const connectRosettanetAccount = async (selectedAccount) => {
  if (!selectedAccount) {
    throw new Error("No selected account");
  }

  return typeof selectedAccount.sendAsync === "function" &&
    typeof selectedAccount.send === "function"
    ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
    : WalletAccount.connect({ nodeUrl: node }, selectedAccount);
};

// Get Starknet address helper
export const getStarknetAddressForAccount = async (selectedAccount, rAccount) => {
  return typeof selectedAccount.sendAsync === "function" &&
    typeof selectedAccount.send === "function"
    ? getStarknetAddress(rAccount.address)
    : rAccount.address;
};

// Rosettanet call methods
export const executeRosettanetCallMethods = async (selectedAccount, setCallMethodResults) => {
  const rAccount = await connectRosettanetAccount(selectedAccount);

  const tx = {
    from: rAccount.address,
    to: rAccount.address,
    value: "0x9184e72a",
  };

  const methods = [
    { method: "blockNumberRosettanet", key: "blockNumber", transform: (res) => parseInt(res, 16) },
    { method: "chainIdRosettanet", key: "chainId" },
    { method: "estimateGasRosettanet", key: "estimateGas", params: [tx] },
    { method: "gasPriceRosettanet", key: "gasPrice" },
    { method: "getBalanceRosettanet", key: "getBalance", params: [rAccount.address] },
    { method: "getBlockByHashRosettanet", key: "getBlockByHash", params: ["0x44e35afdc050293af1263eda16c324ed53efdb4de9f1ef9cf3b5732171631e7"] },
    { method: "getBlockByNumberRosettanet", key: "getBlockByNumber", params: ["0x123"] },
    { method: "getBlockTransactionCountByHashRosettanet", key: "getBlockTransactionCountByHash", params: ["0x44e35afdc050293af1263eda16c324ed53efdb4de9f1ef9cf3b5732171631e7"] },
    { method: "getBlockTransactionCountByNumberRosettanet", key: "getBlockTransactionCountByNumber", params: ["0x123"] },
    { method: "getCodeRosettanet", key: "getCode", params: [rAccount.address] },
    { method: "getTransactionHashByBlockHashAndIndexRosettanet", key: "getTransactionHashByBlockHashAndIndex", params: ["0x44e35afdc050293af1263eda16c324ed53efdb4de9f1ef9cf3b5732171631e7", 1] },
    { method: "getTransactionHashByBlockNumberAndIndexRosettanet", key: "getTransactionHashByBlockNumberAndIndex", params: ["0x123", 1] },
    { method: "getTransactionByHashRosettanet", key: "getTransactionByHash", params: ["0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a"] },
    { method: "getTransactionCountRosettanet", key: "getTransactionCount", params: [rAccount.address] },
    { method: "getTransactionReceiptRosettanet", key: "getTransactionReceipt", params: ["0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a"] },
  ];

  for (const { method, key, params = [], transform } of methods) {
    try {
      const result = await rAccount[method](...params);
      const processedResult = transform ? transform(result) : result;
      console.log(`${method}:`, processedResult);
      setCallMethodResults((prev) => ({
        ...prev,
        [key]: processedResult,
      }));
    } catch (e) {
      console.error(`Error in ${method}:`, e);
    }
  }
};

// StarknetJS call methods
export const executeStarknetJSCallMethods = async (selectedAccount, setStarknetCallMethodResults) => {
  const rAccount = await connectAccount(selectedAccount);
  const snAddress = await getStarknetAddressForAccount(selectedAccount, rAccount);

  const methods = [
    { method: "getChainId", key: "chainId" },
    { method: "getBlockNumber", key: "blockNumber" },
    { method: "getBlockLatestAccepted", key: "getBlockLatestAccepted" },
    { method: "getSpecVersion", key: "getSpecVersion" },
    { method: "getNonceForAddress", key: "getNonceForAddress", params: [snAddress] },
    { method: "getBlockWithTxHashes", key: "getBlockWithTxHashes", params: ["latest"] },
    { method: "getBlockWithTxs", key: "getBlockWithTxs", params: ["latest"] },
    { method: "getBlockWithReceipts", key: "getBlockWithReceipts", params: ["latest"] },
    { method: "getBlockStateUpdate", key: "getBlockStateUpdate", params: ["latest"] },
    { method: "getBlockTransactionsTraces", key: "getBlockTransactionsTraces" },
    { method: "getBlockTransactionCount", key: "getBlockTransactionCount", params: ["latest"] },
    { method: "getTransactionByHash", key: "getTransactionByHash", params: ["0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a"] },
    { method: "getTransactionByBlockIdAndIndex", key: "getTransactionByBlockIdAndIndex", params: ["latest", 1] },
    { method: "getTransactionReceipt", key: "getTransactionReceipt", params: ["0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a"] },
    { method: "getTransactionTrace", key: "getTransactionTrace", params: ["0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a"] },
    { method: "getTransactionStatus", key: "getTransactionStatus", params: ["0x7f963911128c444a231748fb461c8caf568d0893532e3de81342cea3fce600a"] },
    { method: "getClassHashAt", key: "getClassHashAt", params: [snAddress, "latest"] },
    { method: "getClass", key: "getClass", params: ["0x04b7ccebfb848b8d8e62808718de698afcb529b36885c2927ae4fbafc5a18a81"] },
    { method: "getClassAt", key: "getClassAt", params: [snAddress, "latest"] },
  ];

  for (const { method, key, params = [] } of methods) {
    try {
      const result = await rAccount[method](...params);
      console.log(`${method}:`, result);
      setStarknetCallMethodResults((prev) => ({
        ...prev,
        [key]: result,
      }));
    } catch (e) {
      console.error(`Error in ${method}:`, e);
    }
  }

  // Handle getInvokeEstimateFee separately due to special processing
  try {
    const res = await rAccount.getInvokeEstimateFee(snTx);
    const result = {
      data_gas_consumed: res.data_gas_consumed.toString(),
      data_gas_price: res.data_gas_price.toString(),
      gas_consumed: res.gas_consumed.toString(),
      gas_price: res.gas_price.toString(),
      overall_fee: res.overall_fee.toString(),
      resourceBounds: {
        l1_gas: {
          max_amount: res.resourceBounds.l1_gas.max_amount.toString(),
          max_price_per_unit: res.resourceBounds.l1_gas.max_price_per_unit.toString(),
        },
        l2_gas: {
          max_amount: res.resourceBounds.l2_gas.max_amount.toString(),
          max_price_per_unit: res.resourceBounds.l2_gas.max_price_per_unit.toString(),
        },
      },
      suggestedMaxFee: res.suggestedMaxFee.toString(),
      unit: res.unit,
    };

    setStarknetCallMethodResults((prev) => ({
      ...prev,
      getInvokeEstimateFee: result,
    }));
  } catch (e) {
    console.error("Error in getInvokeEstimateFee:", e);
  }
};

// Sign message function
export const executeSignMessage = async (selectedAccount) => {
  const rAccount = await connectAccount(selectedAccount);

  const msgParams = JSON.stringify({
    domain: {
      chainId: 1381192787,
      name: "Ether Mail",
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      version: "1",
    },
    message: {
      contents: "Hello, Bob!",
      from: {
        name: "Cow",
        wallets: [
          "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
          "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
        ],
      },
      to: [
        {
          name: "Bob",
          wallets: [
            "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
            "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
            "0xB0B0b0b0b0b0B000000000000000000000000000",
          ],
        },
      ],
    },
    primaryType: "Mail",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Group: [
        { name: "name", type: "string" },
        { name: "members", type: "Person[]" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person[]" },
        { name: "contents", type: "string" },
      ],
      Person: [
        { name: "name", type: "string" },
        { name: "wallets", type: "address[]" },
      ],
    },
  });

  const result = await rAccount.signMessage(msgParams, rAccount.address);
  console.log("Sign message result:", result);
  return result;
};

// Send transaction function
export const executeSendTransaction = async (selectedAccount) => {
  const rAccount = await connectAccount(selectedAccount);

  const unsignedTx = {
    to: "0x1e495b498736bBa9d2CbE8dabA652058d46B2d5a",
    value: "0xDE0B6B3A7640000",
    from: rAccount.address,
    data: "0x",
  };

  const result = await rAccount.sendTransactionRosettanet(unsignedTx);
  console.log("Send transaction result:", result);
  return result;
};

// AVNU swap function
export const executeAvnuSwap = async (selectedAccount) => {
  const rAccount = await connectAccount(selectedAccount);
  const snAddress = await getStarknetAddressForAccount(selectedAccount, rAccount);

  const getQuotes = await fetch(
    "https://sepolia.api.avnu.fi/swap/v2/quotes?sellTokenAddress=0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d&buyTokenAddress=0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7&sellAmount=0xDE0B6B3A7640000"
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

  const calldataDecoded = [
    {
      contract_address:
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      entry_point:
        "0x0219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c",
      calldata: buildSwapDataResponse.calls[0].calldata,
    },
    {
      contract_address:
        "0x2c56e8b00dbe2a71e57472685378fc8988bba947e9a99b26a00fade2b4fe7c2",
      entry_point:
        "0x01171593aa5bdadda4d6b0efde6cc94ee7649c3163d5efeb19da6c16d63a2a63",
      calldata: buildSwapDataResponse.calls[1].calldata,
    },
  ];

  const unsignedTx = {
    from: rAccount.address,
    to: "0x0000000000000000000000004645415455524553",
    data: prepareMulticallCalldata(calldataDecoded),
    value: "0x0",
  };

  console.log("AVNU transaction object:", unsignedTx);
  const result = await rAccount.sendTransactionRosettanet(unsignedTx);
  console.log("AVNU swap result:", result);
  return result;
};

// Switch to Rosettanet chain
export const executeSwitchToRosettanet = async (selectedAccount) => {
  const rAccount = await connectAccount(selectedAccount);
  const result = await rAccount.switchStarknetChain("0x52535453");
  console.log("Switch chain result:", result);
  return result;
};

// Execute Starknet transaction
export const executeStarknetTransaction = async (selectedAccount) => {
  const rAccount = await connectAccount(selectedAccount);
  const snAddress = await getStarknetAddressForAccount(selectedAccount, rAccount);

  const getQuotes = await fetch(
    "https://sepolia.api.avnu.fi/swap/v2/quotes?sellTokenAddress=0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d&buyTokenAddress=0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7&sellAmount=0xDE0B6B3A7640000"
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

  const calldataDecoded = [
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
  console.log("Starknet calldata:", calldataDecoded);

  const result = await rAccount.execute(calldataDecoded);
  console.log("Execute result:", result);
  return result.transaction_hash;
};

// Declare function
export const executeDeclare = async (selectedAccount) => {
  const rAccount = await connectAccount(selectedAccount);
  const result = await rAccount.declare();
  console.log("Declare result:", result);
  return result;
};

// Deploy function
export const executeDeploy = async (selectedAccount) => {
  const rAccount = await connectAccount(selectedAccount);
  const result = await rAccount.deploy();
  console.log("Deploy result:", result);
  return result;
};

// Get permissions
export const executeGetPermissions = async (selectedAccount) => {
  const rAccount = await connectAccount(selectedAccount);
  const result = await rAccount.getPermissions();
  console.log("Permissions result:", result);
  return result;
};

// Get Endur with contract call
export const executeGetEndurWithContractCall = async (selectedAccount) => {
  const rAccount = await connectAccount(selectedAccount);

  const lstContract = new Contract(
    ENDURLST_ABI,
    "0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb",
    rAccount
  );

  const lstStake = await lstContract.asset();
  const result = "0x" + BigInt(lstStake).toString(16);
  console.log("Endur contract call result:", result);
  return result;
};

// Create memecoin (Unruggable)
export const executeCreateMemecoin = async (
  selectedAccount,
  tokenName,
  tokenSymbol,
  initialSupply,
  contractSalt
) => {
  // Validation
  if (tokenName.length > 30 || tokenSymbol.length > 30 || contractSalt.length > 30) {
    throw new Error("Name, Symbol and Salt needs to be felt252. Less than 30 characters");
  }

  const initialSupplyUint256 = cairo.uint256(initialSupply);

  if (
    cairo.isTypeUint256([
      BigInt(initialSupplyUint256.low, 16),
      BigInt(initialSupplyUint256.high, 16),
    ])
  ) {
    throw new Error("initialSupply needs to be Uint256.");
  }

  const rAccount = await connectAccount(selectedAccount);
  const snAddress = await getStarknetAddressForAccount(selectedAccount, rAccount);

  const createMemecoinCalldata = [
    {
      contractAddress:
        "0x00494a72a742b7880725a965ee487d937fa6d08a94ba4eb9e29dd0663bc653a2",
      entrypoint:
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

  const result = await rAccount.execute(createMemecoinCalldata);
  console.log("Create memecoin result:", result);
  return result.transaction_hash;
};

// Code examples
export const codeExamples = {
  executeExample: `let rAccount;
    if (selectedAccount) {
      rAccount = await (
        typeof selectedAccount.sendAsync === 'function' && typeof selectedAccount.send === 'function'
          ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
          : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount)
      );
    }

    await rAccount.execute(starknetCalldata).then(res => {
    console.log(res);
    });`,

  contractCallExample: ` async function getEndurWithContractCall() {
    let rAccount;
    if (selectedAccount) {
      rAccount = await (
        typeof selectedAccount.sendAsync === 'function' && typeof selectedAccount.send === 'function'
          ? RosettanetAccount.connect({ nodeUrl: node }, selectedAccount)
          : WalletAccount.connect({ nodeUrl: nodeStrk }, selectedAccount)
      );
    }

    if (rAccount) {
      const lstContract = new Contract(
        ENDURLST_ABI,
        '0x042de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb', // LST Contract Address
        rAccount
      );

      const lstStake = await lstContract.asset();

      console.log('0x' + BigInt(lstStake).toString(16));
    }
  }
`
};