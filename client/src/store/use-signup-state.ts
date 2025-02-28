import { create } from "zustand";
import * as bip39 from "bip39";
import { WalletType } from "@/types/wallet-types";
import { useWalletStore } from "./use-wallet-state";
import { EthWallet } from "@/utils/ethereum-local-wallet";
import { PolkadotWallet } from "@/utils/polkadot-local-wallet";
interface State {
  mnemonic: string;
  copied: boolean;
  confirmed: boolean;
  walletLoading: boolean;
}

type StoreType = State & {
  setMnemonic: (value: string) => void;
  walletSelected: WalletType;
  setWalletSelected: (walletSelected: WalletType) => void;
  setCopied: (value: boolean) => void;
  setConfirmed: (value: boolean) => void;
  setWalletLoading: (value: boolean) => void;
  generateMnemonic: () => Promise<void>;
  handleCopyMnemonic: () => void;
  handleSignUp: (type: WalletType) => Promise<void>;
  getMnemonicWords: () => string[];
};


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
  const handleSignUp = async (type: WalletType) => {
    if (!useSignupStore.getState().confirmed) {
      set((prev) => ({ ...prev, confirmed: true }));
      return;
    }


    set((prev) => ({ ...prev, walletLoading: true }));
    try {
      let localWallet;
      if(type===WalletType.POLKADOT){
        localWallet = new PolkadotWallet();
      }else{
        localWallet = new EthWallet();
      }
      if(!localWallet){
        throw new Error("Invalid wallet type");
      }
      const walletData = await localWallet.fromMnemonic(useSignupStore.getState().mnemonic);
      console.log(walletData);
      const walletAddress = walletData.address;

      if (!walletAddress || walletAddress === "undefined") {
        throw new Error("Invalid wallet address");
      }

      const balance = walletData.balance;
      if (!balance || balance === "undefined") {
        throw new Error("Invalid balance");
      }

      useWalletStore.getState().setWalletConnected(true);
      const { walletSelected } = useSignupStore.getState();
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
    getMnemonicWords,
    generateMnemonic,
    handleCopyMnemonic,
    handleSignUp,
  };
});
