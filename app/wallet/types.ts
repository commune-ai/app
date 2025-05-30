
export enum WalletType {
  POLKADOT = 'Polkadot',
  METAMASK = 'MetaMask',
  PHANTOM = 'Phantom',
  PASSWORD = 'Password',
}

export enum NetworkType {
  POLKADOT = 'Polkadot',
  KUSAMA = 'Kusama',
  ETHEREUM = 'Ethereum',
  SOLANA = 'Solana',
  LOCAL = 'Local',
}

export interface WalletOption {
  id: WalletType;
  name: string;
  icon: string;
  description: string;
}

export const walletOptions: WalletOption[] = [
  {
    id: WalletType.POLKADOT,
    name: 'Polkadot',
    icon: '/images/wallets/polkadot.svg',
    description: 'Connect using Polkadot.js extension',
  },
  {
    id: WalletType.METAMASK,
    name: 'MetaMask',
    icon: '/images/wallets/metamask.svg',
    description: 'Connect using MetaMask extension',
  },
  {
    id: WalletType.PHANTOM,
    name: 'Phantom',
    icon: '/images/wallets/phantom.svg',
    description: 'Connect using Phantom wallet',
  },
  {
    id: WalletType.PASSWORD,
    name: 'Password',
    icon: '/images/wallets/password.svg',
    description: 'Sign in with a password',
  },
];
