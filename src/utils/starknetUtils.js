/* eslint-disable no-unused-vars */
import { RpcProvider, Contract } from 'starknet';

const rosettanetBora =
  '0x065a6238502254a31072c53bedf5046cbb626ce49cd49ba20e206b35d5aed0ad';

const rosettanetDigine =
  '0x033d9ff643e9e964545dac77bb66d1f1828e11845fe7cac1960cb96e6b566833';

const rosettanetYeni =
  '0x05a15273877f8f142a4398371d76c0dad78bf6f352999b3b0619a16e0e184798';

const rosettanetNoL1GasValidation = "0x049fe1e4d813f5d7a05b0e76b6fd5dc81554f2a0ae12415aa2c80d1d98d230b2"

const rosettanetEriminGas = "0x0738a28eda7041678adcfc7f01468b34828dd857937252c4054eb579f15c3489"

export const CONTRACT_OPTIONS = {
  V1_NO_GAS_VERIF: rosettanetNoL1GasValidation,
  V2_WITH_L2_GAS_VERIF: rosettanetEriminGas,
};

export async function getStarknetAddress(address, contractType = 'V2_WITH_L2_GAS_VERIF') {
  try{
  const starknetProvider = new RpcProvider({
    nodeUrl: 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/Ml3s1yVYyyuskNoJAAkuAUDSWv7eH51C',
  });

  const contractAddress = CONTRACT_OPTIONS[contractType] || rosettanetEriminGas;

  const { abi: contractAbi } = await starknetProvider.getClassAt(
    contractAddress
  );
  if (contractAbi === undefined) {
    throw new Error('no contract abi, error in contract address');
  }
  const rosettaContract = new Contract(
    contractAbi,
    contractAddress,
    starknetProvider
  );

  // Interaction with the contract with call
  const starknetAddress =
    await rosettaContract.get_starknet_address_with_fallback(address);
  return '0x' + starknetAddress.toString(16);
  }catch{
    throw new Error('Error fetching Starknet address');
  }
}
