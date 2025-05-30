
import { 
  blake2AsHex,
  naclEncrypt,
  naclDecrypt,
  naclSeal,
  naclOpen
} from '@polkadot/util-crypto';
import { hexToU8a, u8aToHex, stringToU8a, u8aToString } from '@polkadot/util';
import { Wallet } from './wallet';

/**
 * Utility class for cryptographic operations
 */
export class CryptoUtils {
  private wallet: Wallet;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
  }

  /**
   * Sign a message and return the signature
   * @param message - The message to sign
   * @returns The hex-encoded signature
   */
  async signMessage(message: string): Promise<string> {
    if (!message) {
      throw new Error('Empty message cannot be signed');
    }
    
    return this.wallet.sign(message);
  }

  /**
   * Sign a message and format it as a JWT token
   * @param message - The message to sign
   * @param expiration - Token expiration time in seconds
   * @returns JWT token
   */
  async signAsJWT(message: string, expiration: number = 3600): Promise<string> {
    return this.wallet.getToken(message, expiration);
  }

  /**
   * Verify a signature against a message
   * @param message - The original message
   * @param signature - The signature to verify
   * @param public_key - The public key to verify against (defaults to the wallet's public key)
   * @returns Boolean indicating if the signature is valid
   */
  async verifySignature(
    message: string, 
    signature: string, 
    public_key?: string
  ): Promise<boolean> {
    return this.wallet.verify(
      message, 
      signature, 
      public_key || this.wallet.public_key
    );
  }

  /**
   * Encrypt a message using NaCl
   * @param message - The message to encrypt
   * @param recipientPublicKey - The recipient's public key (optional)
   * @returns The encrypted message and nonce
   */
  async encryptMessage(
    message: string, 
    recipientPublicKey?: string
  ): Promise<{ encrypted: string, nonce: string }> {
    const messageData = stringToU8a(message);
    const senderPrivateKey = hexToU8a(this.wallet.private_key);
    
    if (recipientPublicKey) {
      // Encrypt for a specific recipient
      const recipientKey = hexToU8a(recipientPublicKey);
      const { sealed, nonce } = naclSeal(messageData, senderPrivateKey, recipientKey);
      
      return {
        encrypted: u8aToHex(sealed),
        nonce: u8aToHex(nonce)
      };
    } else {
      // Symmetric encryption
      const { encrypted, nonce } = naclEncrypt(messageData, senderPrivateKey);
      
      return {
        encrypted: u8aToHex(encrypted),
        nonce: u8aToHex(nonce)
      };
    }
  }

  /**
   * Decrypt a message using NaCl
   * @param encryptedMessage - The encrypted message
   * @param nonce - The nonce used for encryption
   * @param senderPublicKey - The sender's public key (for asymmetric decryption)
   * @returns The decrypted message
   */
  async decryptMessage(
    encryptedMessage: string, 
    nonce: string, 
    senderPublicKey?: string
  ): Promise<string> {
    const encrypted = hexToU8a(encryptedMessage);
    const nonceData = hexToU8a(nonce);
    const privateKey = hexToU8a(this.wallet.private_key);
    
    let decrypted: Uint8Array | null;
    
    if (senderPublicKey) {
      // Asymmetric decryption
      const senderKey = hexToU8a(senderPublicKey);
      decrypted = naclOpen(encrypted, nonceData, senderKey, privateKey);
    } else {
      // Symmetric decryption
      decrypted = naclDecrypt(encrypted, nonceData, privateKey);
    }
    
    if (!decrypted) {
      throw new Error('Failed to decrypt message');
    }
    
    return u8aToString(decrypted);
  }

  /**
   * Hash a message using Blake2
   * @param message - The message to hash
   * @returns The hash of the message
   */
  hashMessage(message: string): string {
    return blake2AsHex(message);
  }
}
