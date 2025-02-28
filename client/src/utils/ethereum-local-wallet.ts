import { ethers } from "ethers";
import * as bip39 from "bip39";
import { hdkey } from "@ethereumjs/wallet";

export interface EthWalletType {
  address: string;
  crypto_type: "ecdsa";
  public_key: string;
  private_key: string;
  balance: string;
}

export class EthWallet {
  private private_key!: string;
  public public_key!: string;
  public address!: string;
  public crypto_type = "ecdsa" as const;

  /**
   * Generates an Ethereum wallet from a mnemonic and fetches its balance.
   * @param mnemonic - The BIP-39 mnemonic phrase.
   * @returns A EthWalletType object containing address, public_key, private_key, and balance.
   */
  public async fromMnemonic(mnemonic: string): Promise<EthWalletType> {
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error("Invalid mnemonic provided");
    }

    // Generate HD Wallet
    const hdwallet = hdkey.EthereumHDKey.fromMnemonic(mnemonic);
    const wallet = hdwallet.deriveChild(0).getWallet(); // First child wallet

    // Extract keys and address
    this.private_key = wallet.getPrivateKeyString();
    this.public_key = wallet.getPublicKeyString();
    this.address = wallet.getAddressString();

    // Fetch balance
    const balance = await this.getBalance();

    return {
      address: this.address,
      crypto_type: "ecdsa",
      public_key: this.public_key,
      private_key: this.private_key,
      balance,
    };
  }

  /**
   * Gets the ETH balance of the wallet using the default provider.
   * @returns Wallet balance in ETH.
   */
  public async getBalance(): Promise<string> {
    if (!this.address) throw new Error("Wallet is not initialized");

    try {
      const provider = ethers.getDefaultProvider(); // Default public provider
      const balance = await provider.getBalance(this.address);

      return ethers.formatEther(balance); // Convert from Wei to ETH
    } catch (error) {
      console.error("Error fetching balance:", error);
      return "0"; // Return "0" if fetching balance fails
    }
  }

  /**
   * Signs a message using the wallet's private key.
   * @param message - The message to sign.
   * @returns A signed message string.
   */
  public async signMessage(message: string): Promise<string> {
    if (!this.private_key) throw new Error("Wallet is not initialized");

    const wallet = new ethers.Wallet(this.private_key);
    return wallet.signMessage(message);
  }

  /**
   * Verifies a signed message.
   * @param message - The original message.
   * @param signature - The signature to verify.
   * @returns Whether the signature is valid.
   */
  public async verifyMessage(message: string, signature: string): Promise<boolean> {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === this.address.toLowerCase();
  }
}
