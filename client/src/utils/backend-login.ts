import axios from 'axios';
import getBackendUrl from "./get-backend-url";
import { WalletType } from '@/types/wallet-types';
import { ethers } from 'ethers';
const apiBase = await getBackendUrl();
export const fetchNonce = async (address: string) => {
    const response = await axios.get(`${apiBase}/api/auth/nonce/${address}`);
    return response.data.nonce;
};

export const verifySignature = async (address: string, signature: string, type: string): Promise<{ success: boolean, error?: string }> => {
    try {
        await axios.post(`${apiBase}/api/auth/verify`, {
            address: address,
            signature: signature,
            type: type
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        return { success: true };
    } catch {
        return { success: false, error: "failed to get value" };
    }
};

export const logout = async () => {
    try {
        await axios.get(`${apiBase}/api/auth/logout`, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
    }
}

export const signMessage = async (wallet: WalletType): Promise<{ success: boolean, error?: string, signature?: string, wallet?: string }> => {
    switch (wallet) {
        case WalletType.METAMASK:
            if (typeof window.ethereum === 'undefined') {
                return {
                    success: false,
                    error: 'MetaMask is not installed',
                };
            }
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = signer.address;
                const nonce = await fetchNonce(address);
                const signature = await signer.signMessage(nonce);
                return {
                    success: true,
                    signature: signature,
                    wallet: WalletType.METAMASK.toLocaleLowerCase(),
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'An error occurred during signing to MetaMask',
                };
            }
        case WalletType.SUBWALLET:
            if (typeof window === 'undefined' || typeof window.SubWallet === 'undefined') {
                return {
                    success: false,
                    error: 'Subwallet is not installed',
                };
            }
            const { web3Enable, web3Accounts, web3FromAddress } = await import('@subwallet/extension-dapp');
            try {
                const extensions = await web3Enable('SubWallet Connect');
                if (extensions.length === 0) {
                    return {
                        success: false,
                        error: 'SubWallet extension is not installed',
                    };
                }
                const accounts = await web3Accounts();
                if (accounts.length === 0) {
                    return {
                        success: false,
                        error: 'No accounts found in SubWallet',
                    };
                }

                const address = accounts[0].address;
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

                return {
                    success: true,
                    signature: signature,
                    wallet: WalletType.SUBWALLET.toLocaleLowerCase(),
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'An error occurred while connecting to SubWallet. Check the console for more details.',
                };
            }
        case WalletType.PHANTOM:
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
                return {
                    success: true,
                    signature: baseSignature,
                    wallet: WalletType.PHANTOM.toLocaleLowerCase(),
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'An error occurred during connection to Phantom Wallet',
                };
            }
        default:
            return { success: false, error: 'Unsupported wallet type' };
    }
}