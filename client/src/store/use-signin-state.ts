import { PolkadotWallet } from "@/utils/polkadot-local-wallet";
import { create } from "zustand";
import { useWalletStore } from "./use-wallet-state";
import { WalletType } from "@/types/wallet-types";
import { EthWallet } from "@/utils/ethereum-local-wallet";

interface SigninState {
  privateKey: string;
  isLoading: boolean;
  signinSuccess: boolean;
}

interface SigninActions {
  setPrivateKey: (privateKey: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSigninSuccess: (success: boolean) => void;
  walletSelected: WalletType;
  setWalletSelected: (walletSelected: WalletType) => void;
  handlePrivateKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignIn: (e: React.FormEvent<HTMLFormElement>, type: WalletType) => void;
}

export const useSigninStore = create<SigninState & SigninActions>((set) => ({
  privateKey: "",
  isLoading: false,
  signinSuccess: false,
  walletSelected: WalletType.POLKADOT,
  setWalletSelected: (walletSelected: WalletType) => set({ walletSelected }),
  setPrivateKey: (privateKey: string) => set({ privateKey }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setSigninSuccess: (success: boolean) => set({ signinSuccess: success }),
  handlePrivateKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    set({ privateKey: e.target.value });
  },
  handleSignIn: async (e: React.FormEvent, type: WalletType) => {
    e.preventDefault();
    const { privateKey } = useSigninStore.getState();
    if (!privateKey) return;

    try {
      set({ isLoading: true, signinSuccess: false });
      let localWallet;
      if (type === WalletType.POLKADOT) {
        localWallet = new PolkadotWallet();
      } else {
        localWallet = new EthWallet();
      }
      if (!localWallet) {
        throw new Error("Invalid wallet type");
      }
      const walletData = await localWallet.fromMnemonic(privateKey);
      const walletAddress = walletData.address;

      if (!walletAddress || walletAddress === "undefined") {
        throw new Error("Invalid wallet address");
      }

      const balance = walletData.balance;
      if (!balance || balance === "undefined") {
        throw new Error("Invalid balance");
      }

      const { walletSelected } = useSigninStore.getState();
      useWalletStore.getState().setWallet(walletSelected, walletAddress, balance);
      useWalletStore.getState().setWalletConnected(true);
      set({ signinSuccess: true });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
