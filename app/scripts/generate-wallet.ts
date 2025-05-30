
#!/usr/bin/env ts-node
/**
 * Wallet Generation Script
 * 
 * This script demonstrates how to generate a wallet using the Wallet class.
 * It can be used to create a wallet from a password.
 * 
 * Usage:
 *   npm run generate-wallet -- --password="your_password"
 */

import { Wallet } from '../wallet/wallet';
import { cryptoWaitReady } from '@polkadot/util-crypto';

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  let password: string | null = null;

  for (const arg of args) {
    if (arg.startsWith('--password=')) {
      password = arg.replace('--password=', '');
    }
  }

  // Validate inputs
  if (!password) {
    console.error('Error: --password must be provided');
    process.exit(1);
  }

  try {
    // Initialize crypto
    await cryptoWaitReady();
    
    // Create wallet instance
    const wallet = new Wallet();
    
    console.log(`Generating wallet from password using sr25519...`);
    const walletData = await wallet.fromPassword(password, 'sr25519');

    console.log('\nWallet generated successfully:');
    console.log('----------------------------');
    console.log(`Address: ${walletData.address}`);
    console.log(`Public Key: ${walletData.public_key}`);
    console.log(`Crypto Type: ${walletData.crypto_type}`);
    
    // Generate a sample JWT token
    const token = wallet.getToken('Sample data', 3600);
    console.log('\nSample JWT Token:');
    console.log(token);
  } catch (error) {
    console.error('Error generating wallet:', error);
    process.exit(1);
  }
}

main().catch(console.error);
