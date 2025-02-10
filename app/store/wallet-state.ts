import { create } from "zustand";
import { WalletType } from "@/types/wallet-types";

interface WalletState {
  walletConnected: boolean;
  wallet: {
    name: WalletType | null;
    address: string;
    balance: string;
  };
  setWalletConnected: (connectedWallet: boolean) => void;
  setWallet: (name: WalletType, address: string, balance: string) => void;
}

const useWalletStore = create<WalletState>((set) => ({
  walletConnected: false,
  wallet: {
    name: null,
    address: "",
    balance: "0",
  },
  setWalletConnected: (connectedWallet) =>
    set({ walletConnected: connectedWallet }),
  setWallet: (name, address, balance) =>
    set(({
      wallet: {
        name,
        address,
        balance,
      },
    })),
}));

export default useWalletStore;
