import { Wallet } from "@/wallet/local/wallet";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { create } from "zustand";
import { useWalletStore } from "./use-wallet-state";
import { WalletType } from "@/wallet/types";

interface SigninState {
  privateKey: string;
  isLoading: boolean;
  signinSuccess: boolean;
  getBalance: (address: string) => Promise<string>;
}

interface SigninActions {
  setPrivateKey: (privateKey: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSigninSuccess: (success: boolean) => void;
  walletSelected:WalletType;
  setWalletSelected: (walletSelected: WalletType) => void;
  handlePrivateKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignIn: (e: React.FormEvent<HTMLFormElement>) => void;
}
const wsProvider = new WsProvider("wss://rpc.polkadot.io");
const api = ApiPromise.create({ provider: wsProvider });

export const useSigninStore = create<SigninState & SigninActions>((set) => ({
  privateKey: "",
  isLoading: false,
  signinSuccess: false,
  walletSelected:WalletType.POLKADOT,
  setWalletSelected: (walletSelected: WalletType) => set({ walletSelected }),
  setPrivateKey: (privateKey: string) => set({ privateKey }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setSigninSuccess: (success: boolean) => set({ signinSuccess: success }),

  getBalance: async (address: string) => {
    const apiInstance = await api;
    const accountInfo = await apiInstance.query.system.account(address);
    const {
      data: { free: balance },
    } = accountInfo.toHuman() as { data: { free: string } };
    return balance.toString();
  },
  handlePrivateKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    set({ privateKey: e.target.value });
  },
  handleSignIn: async (e: React.FormEvent) => {
    e.preventDefault();
    const { privateKey } = useSigninStore.getState();
    if (!privateKey) return;

    try {
      set({ isLoading: true, signinSuccess: false });
      const localWallet = new Wallet();
      const walletData = await localWallet.fromPassword(privateKey);
      const walletAddress = walletData.address;

      if (!walletAddress || walletAddress === "undefined") {
        throw new Error("Invalid wallet address");
      }

      const balance = await useSigninStore.getState().getBalance(walletAddress);
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
