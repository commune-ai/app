
#!/usr/bin/env ts-node

import { Wallet } from '../app/wallet/wallet';
import { CryptoUtils } from '../app/wallet/crypto-utils';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Command-line utility for verifying message signatures
 * Can be used for testing or verifying signatures outside the application
 */
async function main() {
  console.log('=== Signature Verification Utility ===');
  
  // Create a wallet instance
  const wallet = new Wallet();
  
  // Get message from user
  const message = await new Promise<string>(resolve => {
    rl.question('Enter the original message: ', (answer) => {
      resolve(answer);
    });
  });
  
  // Get signature from user
  const signature = await new Promise<string>(resolve => {
    rl.question('Enter the signature to verify: ', (answer) => {
      resolve(answer);
    });
  });
  
  // Get public key from user
  const publicKey = await new Promise<string>(resolve => {
    rl.question('Enter the public key of the signer: ', (answer) => {
      resolve(answer);
    });
  });
  
  try {
    // Initialize crypto utils
    const cryptoUtils = new CryptoUtils(wallet);
    
    // Verify the signature
    const verified = await cryptoUtils.verifySignature(message, signature, publicKey);
    
    console.log('\n=== Verification Result ===');
    if (verified) {
      console.log('✅ Signature is VALID!');
      console.log('This message was signed by the owner of the provided public key.');
    } else {
      console.log('❌ Signature is INVALID!');
      console.log('Either the message was altered, the signature is incorrect, or it was signed by a different key.');
    }
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
