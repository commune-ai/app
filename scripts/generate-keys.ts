
#!/usr/bin/env ts-node
import { Wallet } from '../app/wallet/wallet';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import fs from 'fs';
import path from 'path';

/**
 * Script to generate wallet keys for development or testing
 */
async function generateKeys() {
  // Initialize crypto
  await cryptoWaitReady();
  
  console.log('Generating wallet keys...');
  
  // Create wallets with different crypto types
  const sr25519Wallet = new Wallet();
  const ecdsaWallet = new Wallet();
  
  await sr25519Wallet.fromPassword('test_password', 'sr25519');
  await ecdsaWallet.fromPassword('test_password', 'ecdsa');
  
  const wallets = {
    sr25519: {
      address: sr25519Wallet.address,
      public_key: sr25519Wallet.public_key,
      private_key: sr25519Wallet.private_key,
      crypto_type: sr25519Wallet.crypto_type,
    },
    ecdsa: {
      address: ecdsaWallet.address,
      public_key: ecdsaWallet.public_key,
      private_key: ecdsaWallet.private_key,
      crypto_type: ecdsaWallet.crypto_type,
    },
  };
  
  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '../.keys');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write keys to file
  fs.writeFileSync(
    path.join(outputDir, 'test-keys.json'), 
    JSON.stringify(wallets, null, 2)
  );
  
  console.log('Keys generated and saved to .keys/test-keys.json');
  console.log('SR25519 Address:', sr25519Wallet.address);
  console.log('ECDSA Address:', ecdsaWallet.address);
}

// Run the script
generateKeys().catch(console.error);
