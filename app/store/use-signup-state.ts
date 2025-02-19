import { ApiPromise, WsProvider } from "@polkadot/api";
import { create } from "zustand";
import * as bip39 from "bip39";
import { Wallet } from "@/utils/local-wallet";
import { WalletType } from "@/types/wallet-types";
import { useWalletStore } from "./use-wallet-state";

interface State {
  mnemonic: string;
  copied: boolean;
  confirmed: boolean;
  walletLoading: boolean;
}

type StoreType = State & {
  setMnemonic: (value: string) => void;
  walletSelected:WalletType;
  setWalletSelected: (walletSelected: WalletType) => void;
  setCopied: (value: boolean) => void;
  setConfirmed: (value: boolean) => void;
  setWalletLoading: (value: boolean) => void;
  generateMnemonic: () => Promise<void>;
  getBalance: (address: string) => Promise<string>;
  handleCopyMnemonic: () => void;
  handleSignUp: () => Promise<void>;
  getMnemonicWords: () => string[];
};

const wsProvider = new WsProvider("wss://rpc.polkadot.io");
const api = ApiPromise.create({ provider: wsProvider });

export const useSignupStore = create<StoreType>((set) => {
  const generateMnemonic = async () => {
    try {
      const newMnemonic = await bip39.generateMnemonic(256);
      set((prev) => ({ ...prev, mnemonic: newMnemonic }));
    } catch (error) {
      console.error("Error generating mnemonic:", error);
    }
  };
  const handleCopyMnemonic = async () => {
    try {
      const text = useSignupStore.getState().mnemonic;
      await navigator.clipboard
        .writeText(text)
        .then(() => {
          set((prev) => ({ ...prev, copied: true }));
          setTimeout(() => set((prev) => ({ ...prev, copied: false })), 2000);
        })
        .catch(console.error);
    } catch (error) {
      console.error("Error handling copy:", error);
    }
  };
  const handleSignUp = async () => {
    if (!useSignupStore.getState().confirmed) {
      set((prev) => ({ ...prev, confirmed: true }));
      return;
    }

    set((prev) => ({ ...prev, walletLoading: true }));
    try {
      const localWallet = new Wallet();
      const walletData = await localWallet.fromPassword(useSignupStore.getState().mnemonic);
      const walletAddress = walletData.address;

      if (!walletAddress || walletAddress === "undefined") {
        throw new Error("Invalid wallet address");
      }

      const balance = await useSignupStore.getState().getBalance(walletAddress);
      if (!balance || balance === "undefined") {
        throw new Error("Invalid balance");
      }

      useWalletStore.getState().setWalletConnected(true);
      const {walletSelected}=useSignupStore.getState();
      useWalletStore.getState().setWallet(walletSelected, walletAddress, balance);
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      set((prev) => ({ ...prev, walletLoading: false }));
    }
  };
  const getMnemonicWords = () => {
    const mnemonicWords: string[] = useSignupStore.getState().mnemonic.split(" ");
    return mnemonicWords;
  };

  return {
    mnemonic: "",
    copied: false,
    confirmed: false,
    walletLoading: false,
    setMnemonic: (value: string) => set({ mnemonic: value }),
    setCopied: (value: boolean) => set({ copied: value }),
    walletSelected: WalletType.POLKADOT,
    setWalletSelected: (walletSelected: WalletType) => set({ walletSelected }),
    setConfirmed: (value: boolean) => set({ confirmed: value }),
    setWalletLoading: (value: boolean) => set({ walletLoading: value }),
    getBalance: async (address: string): Promise<string> => {
      try {
        const accountInfo = await (await api).query.system.account(address);
        const {
          data: { free: balance },
        } = accountInfo.toHuman() as { data: { free: string } };
        return balance.toString();
      } catch (error) {
        console.error("Error getting balance:", error);
        throw error;
      }
    },
    getMnemonicWords,
    generateMnemonic,
    handleCopyMnemonic,
    handleSignUp,
  };
});
