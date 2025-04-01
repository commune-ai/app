export enum WalletType {
  METAMASK = 'Metamask',
  SUBWALLET = 'Subwallet',
  PHANTOM = 'Phantom',
  POLKADOT = 'Polkadot',
  ETHEREUM = 'Ethereum',
}

export enum NetworkType {
  ETHEREUM = 'Ethereum',
  POLKADOT = 'Polkadot',
  SOLANA = 'Solana',
}

export interface WalletOption {
  id: string
  name: string
  icon: string
  network: NetworkType
}

export const networkOptions = [
  { id: NetworkType.ETHEREUM, name: "Ethereum", icon: "/ethereum.svg" },
  { id: NetworkType.POLKADOT, name: "Polkadot", icon: "/polkadot.svg" },
  { id: NetworkType.SOLANA, name: "Solana", icon: "/solana.svg" },
];

export const walletOptions: WalletOption[] = [
  { id: WalletType.POLKADOT, name: "Polkadot", icon: "/polkadot.svg", network: NetworkType.POLKADOT },
  { id: WalletType.ETHEREUM, name: "Ethereum", icon: "/ethereum.svg", network: NetworkType.ETHEREUM },
  { id: WalletType.METAMASK, name: "Metamask", icon: "/metamask.svg", network: NetworkType.ETHEREUM },
  { id: WalletType.SUBWALLET, name: "Subwallet", icon: "/subwallet.svg", network: NetworkType.POLKADOT },
  { id: WalletType.PHANTOM, name: "Phantom", icon: "/phantom.svg", network: NetworkType.SOLANA },
];