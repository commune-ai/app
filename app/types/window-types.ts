import { ExternalProvider } from "@ethersproject/providers";

interface EthereumProvider extends ExternalProvider {
  isMetaMask?: boolean;
  request: (request: {
    method: string;
    params?: unknown[];
  }) => Promise<unknown>;
}

interface SolanaProvider {
  isPhantom?: boolean;
  isConnected: boolean;
  publicKey?: {
    toBase58: () => string;
  };
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    solana?: SolanaProvider;
    SubWallet?: {
      isSubWallet: boolean;
      connect: () => Promise<void>;
      disconnect: () => Promise<void>;
    };
  }
}
