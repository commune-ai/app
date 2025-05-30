
import { create } from 'zustand';
import { WalletType, NetworkType } from './types';

interface WalletState {
  walletConnected: boolean;
  connectingWallet: boolean;
  wallet: {
    name: WalletType;
    address: string;
    balance: string;
    network: NetworkType;
  } | null;
  setWalletConnected: (connected: boolean) => void;
  setConnectingWallet: (connecting: boolean) => void;
  setWallet: (name: WalletType, address: string, balance: string, network: NetworkType) => void;
  disconnectWallet: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  walletConnected: false,
  connectingWallet: false,
  wallet: null,
  setWalletConnected: (connected) => set({ walletConnected: connected }),
  setConnectingWallet: (connecting) => set({ connectingWallet: connecting }),
  setWallet: (name, address, balance, network) => set({
    wallet: {
      name,
      address,
      balance,
      network
    }
  }),
  disconnectWallet: () => set({
    walletConnected: false,
    wallet: null
  }),
}));
