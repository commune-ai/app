
/**
 * Utility functions for wallet operations
 */

import { ethers } from 'ethers';
import { mnemonicToSeedSync } from '@scure/bip39';
import { HDKey } from '@scure/bip32';

/**
 * Generates a random mnemonic phrase
 */
export function generateMnemonic(): string {
  const entropy = ethers.randomBytes(16);
  return ethers.Mnemonic.entropyToPhrase(entropy);
}

/**
 * Derives a wallet from a mnemonic phrase
 */
export function walletFromMnemonic(mnemonic: string, path: string = "m/44'/60'/0'/0/0"): ethers.HDNodeWallet {
  return ethers.HDNodeWallet.fromMnemonic(ethers.Mnemonic.fromPhrase(mnemonic), path);
}

/**
 * Derives a wallet from a password using PBKDF2
 */
export async function walletFromPassword(password: string, salt?: string): Promise<ethers.Wallet> {
  const saltValue = salt || ethers.id(Date.now().toString());
  const derivedKey = await ethers.pbkdf2(
    ethers.toUtf8Bytes(password),
    ethers.toUtf8Bytes(saltValue),
    10000,
    32,
    'sha256'
  );
  return new ethers.Wallet(derivedKey);
}

/**
 * Signs a message with a private key
 */
export function signMessage(message: string, privateKey: string): string {
  const wallet = new ethers.Wallet(privateKey);
  return wallet.signMessage(message);
}

/**
 * Verifies a signature
 */
export function verifySignature(message: string, signature: string, address: string): boolean {
  const recoveredAddress = ethers.verifyMessage(message, signature);
  return recoveredAddress.toLowerCase() === address.toLowerCase();
}

/**
 * Encrypts data with a public key
 */
export async function encryptData(data: string, publicKey: string): Promise<string> {
  // Implementation depends on the specific encryption method required
  // This is a placeholder
  return ethers.encryptDataV2({ publicKey, data: ethers.toUtf8Bytes(data) });
}

/**
 * Decrypts data with a private key
 */
export async function decryptData(encryptedData: string, privateKey: string): Promise<string> {
  // Implementation depends on the specific encryption method used
  // This is a placeholder
  const wallet = new ethers.Wallet(privateKey);
  const decryptedData = await wallet.decryptDataV2(encryptedData);
  return ethers.toUtf8String(decryptedData);
}
