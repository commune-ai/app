
import { Wallet } from './wallet';

/**
 * Key management utility for wallet operations
 */
export class KeyManager {
  private wallet: Wallet;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
  }

  /**
   * Get wallet key information
   * @param key - Optional key to use
   * @param options - Additional options
   * @returns The wallet state
   */
  async getKey(key: string | null = null, options: any = {}): Promise<any> {
    if (key) {
      return this.wallet.fromPrivateKey(key, options.crypto_type || 'sr25519');
    } else if (options.password) {
      return this.wallet.fromPassword(options.password, options.crypto_type || 'sr25519');
    } else {
      throw new Error('Either key or password must be provided');
    }
  }

  /**
   * Export the wallet's public key
   * @returns The public key
   */
  getPublicKey(): string {
    return this.wallet.public_key;
  }

  /**
   * Export the wallet's address
   * @returns The wallet address
   */
  getAddress(): string {
    return this.wallet.address;
  }

  /**
   * Export the wallet's private key (use with caution!)
   * @param password - Optional password to encrypt the exported key
   * @returns The private key
   */
  exportPrivateKey(password?: string): string {
    // In a real implementation, you would add encryption for security
    // This is just a basic implementation
    if (!this.wallet.private_key) {
      throw new Error('No private key available');
    }
    
    return this.wallet.private_key;
  }
}
