import { create } from "zustand";
import { WalletType } from "@/types/wallet-types";

interface WalletState {
  walletConnected: boolean;
  connectingWallet: boolean;
  setConnectingWallet: (connectingWallet: boolean) => void;
  wallet: {
    name: WalletType | null;
    address: string;
    balance: string;
  } | null;
  setWalletConnected: (connectedWallet: boolean) => void;
  setWallet: (name: WalletType, address: string, balance: string) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  walletConnected: false,
  wallet: {
    name: null,
    address: "",
    balance: "0",
  },
  connectingWallet: false,
  setConnectingWallet: (connectingWallet) => set({ connectingWallet }),
  setWalletConnected: (connectedWallet) => set({ walletConnected: connectedWallet }),
  setWallet: (name, address, balance) =>
    set({
      wallet: {
        name,
        address,
        balance,
      },
    }),
}));
