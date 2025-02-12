import { ethers } from "ethers";
import { ApiPromise, WsProvider } from "@polkadot/api";
import * as solanaWeb3 from "@solana/web3.js";
import { Connection } from "@solana/web3.js";

interface SubWalletResponse {
  success: boolean;
  error?: string;
  address?: string;
  balance?: string;
}

/**
 * Connects to MetaMask and retrieves the user's account information.
 *
 * @returns {Promise<{
 *   success: boolean;
 *   error?: string;
 *   address?: string;
 *   balance?: string;
 * }>} An object containing the connection status, and if successful, the user's address, network name, and balance.
 *
 * @throws Will return an error message if MetaMask is not installed or if an error occurs during the connection process.
 */

async function connectToMetaMask(): Promise<{
  success: boolean;
  error?: string;
  address?: string;
  balance?: string;
}> {
  if (typeof window.ethereum === "undefined") {
    return {
      success: false,
      error: "MetaMask is not installed",
    };
  }
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = signer.address;
    const balance = await provider.getBalance(address);
    return {
      success: true,
      address,
      balance: ethers.formatEther(balance),
    };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      error: "An error occurred during connection to MetaMask",
    };
  }
}

/**
 * Connects to SubWallet and retrieves the user's Polkadot account information.
 *
 * @returns {Promise<{
 *   success: boolean;
 *   error?: string;
 *   address?: string;
 *   balance?: string;
 * }>} An object containing the connection status, and if successful, the user's address and balance.
 *
 * @throws Will return an error message if SubWallet is not installed or if an error occurs during the connection process.
 */
const connectToSubWallet = async (): Promise<SubWalletResponse> => {
  if (
    typeof window === "undefined" ||
    typeof window.SubWallet === "undefined"
  ) {
    return {
      success: false,
      error: "Subwallet is not installed",
    };
  }
  const { web3Enable, web3Accounts } = await import(
    "@subwallet/extension-dapp"
  );
  try {
    const extensions = await web3Enable("SubWallet Connect");
    if (extensions.length === 0) {
      return {
        success: false,
        error: "SubWallet extension is not installed",
      };
    }

    const accounts = await web3Accounts();
    if (accounts.length === 0) {
      return {
        success: false,
        error: "No accounts found in SubWallet",
      };
    }

    const address = accounts[0].address;
    const wsProvider = new WsProvider("wss://rpc.polkadot.io");
    const api = await ApiPromise.create({ provider: wsProvider });

    const accountInfo = await api.query.system.account(address);
    const {
      data: { free: balance },
    } = accountInfo.toHuman() as { data: { free: string } };

    return {
      success: true,
      address,
      balance: balance.toString(),
    };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      error:
        "An error occurred while connecting to SubWallet. Check the console for more details.",
    };
  }
};

/**
 * Connects to Phantom Wallet and retrieves the user's account information.
 *
 * @returns {Promise<{
 *   success: boolean;
 *   error?: string;
 *   address?: string;
 *   balance?: string;
 * }>} An object containing the connection status, and if successful, the user's address, and balance.
 *
 * @throws Will return an error message if Phantom Wallet is not installed or if an error occurs during the connection process.
 */
async function connectToPhantom(): Promise<{
  success: boolean;
  error?: string;
  address?: string;
  balance?: string;
}> {
  if (typeof window.solana === "undefined") {
    return {
      success: false,
      error: "Phantom Wallet is not installed",
    };
  }
  try {
    const response = await window.solana.connect();
    const address = response.publicKey.toString();

    const connection = new Connection("https://api.devnet.solana.com");
    const balance = await connection.getBalance(
      new solanaWeb3.PublicKey(response.publicKey.toString()),
    );

    return {
      success: true,
      address,
      balance: (balance / solanaWeb3.LAMPORTS_PER_SOL).toString(),
    };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      error: "An error occurred during connection to Phantom Wallet",
    };
  }
}

export { connectToSubWallet, connectToMetaMask, connectToPhantom };
