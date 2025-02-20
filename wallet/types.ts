
export enum WalletType {
    METAMASK = 'Metamask',
    SUBWALLET = 'Subwallet',
    PHANTOM = 'Phantom',
    POLKADOT = 'Polkadot',
    ETHEREUM = 'Ethereum',
  }

  
export interface WalletOption {
    id: string
    name: string
    icon: string
}


export const walletOptions: WalletOption[] = [
  { id: WalletType.POLKADOT, name: "Polkadot", icon: "/polkadot.svg" },
  { id: WalletType.ETHEREUM, name: "Ethereum", icon: "/ethereum.svg" },
]



