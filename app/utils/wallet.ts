import { ethers } from 'ethers';
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as solanaWeb3 from '@solana/web3.js';
import { Connection } from '@solana/web3.js';
import { fetchNonce, verifySignature } from './backend-login';

interface WalletResponse {
  success: boolean;
  error?: string;
  address?: string;
  balance?: string;
}

/**
 * Connects to MetaMask and retrieves the user's account information.
 */
const connectToMetaMask = async (): Promise<WalletResponse> => {
  if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
    return { success: false, error: 'MetaMask is not installed' };
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);

    const nonce = await fetchNonce(address);
    const signature = await signer.signMessage(nonce);
    const response = await verifySignature(address, signature, 'metamask');

    if (!response.success) {
      throw new Error('Signature verification failed');
    }

    return {
      success: true,
      address,
      balance: ethers.formatEther(balance),
    };
  } catch {
    return {
      success: false,
      error: 'An error occurred during connection to MetaMask',
    };
  }
};

/**
 * Connects to SubWallet and retrieves the user's Polkadot account information.
 */
const connectToSubWallet = async (): Promise<WalletResponse> => {
  if (typeof window === 'undefined' || typeof window.SubWallet === 'undefined') {
    return { success: false, error: 'SubWallet is not installed' };
  }

  try {
    const { web3Enable, web3Accounts, web3FromAddress } = await import('@subwallet/extension-dapp');
    const extensions = await web3Enable('SubWallet Connect');

    if (extensions.length === 0) {
      throw new Error('SubWallet extension is not installed');
    }

    const accounts = await web3Accounts();
    if (accounts.length === 0) {
      throw new Error('No accounts found in SubWallet');
    }

    const address = accounts[0].address;
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });

    const accountInfo = await api.query.system.account(address);
    const { data: { free: balance } } = accountInfo.toHuman() as { data: { free: string } };

    const nonce = await fetchNonce(address);
    const injector = await web3FromAddress(address);

    if (!injector.signer || !injector.signer.signRaw) {
      throw new Error('Signer or signRaw method is undefined');
    }

    const { signature } = await injector.signer.signRaw({
      address: address,
      data: nonce,
      type: 'bytes',
    });

    const response = await verifySignature(address, signature, 'subwallet');
    if (!response.success) {
      throw new Error('Signature verification failed');
    }

    return {
      success: true,
      address,
      balance: balance.toString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during connection to SubWallet',
    };
  }
};

/**
 * Connects to Phantom Wallet and retrieves the user's Solana account information.
 */
const connectToPhantom = async (): Promise<WalletResponse> => {
  if (typeof window === 'undefined' || typeof window.solana === 'undefined') {
    return { success: false, error: 'Phantom Wallet is not installed' };
  }

  try {
    const provider = window.solana;
    if (!provider.isConnected) {
      await provider.connect();
    }

    if (!provider.publicKey) {
      throw new Error('Failed to retrieve public key from Phantom Wallet');
    }

    const address = provider.publicKey.toString();
    const nonce = new TextEncoder().encode(await fetchNonce(address));
    const { signature } = await provider.signMessage(nonce, 'utf8');

    const baseSignature = btoa(String.fromCharCode(...signature));
    const response = await verifySignature(address, baseSignature, 'phantom');

    if (!response.success) {
      throw new Error('Signature verification failed');
    }

    const connection = new Connection('https://api.devnet.solana.com');
    const balance = await connection.getBalance(new solanaWeb3.PublicKey(address));

    return {
      success: true,
      address,
      balance: (balance / solanaWeb3.LAMPORTS_PER_SOL).toString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during connection to Phantom Wallet',
    };
  }
};

export { connectToMetaMask, connectToSubWallet, connectToPhantom };
