
#!/usr/bin/env ts-node

import { Wallet } from '../app/wallet/wallet';
import { CryptoUtils } from '../app/wallet/crypto-utils';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Command-line utility for signing messages
 * Can be used for testing or generating signatures outside the application
 */
async function main() {
  console.log('=== Message Signing Utility ===');
  
  // Create a wallet instance
  const wallet = new Wallet();
  
  // Get password from user
  const password = await new Promise<string>(resolve => {
    rl.question('Enter password to derive wallet: ', (answer) => {
      resolve(answer);
    });
  });
  
  try {
    // Initialize wallet from password
    await wallet.fromPassword(password);
    console.log(`Wallet initialized with address: ${wallet.address}`);
    console.log(`Public key: ${wallet.public_key}`);
    
    // Create crypto utils
    const cryptoUtils = new CryptoUtils(wallet);
    
    // Get message from user
    const message = await new Promise<string>(resolve => {
      rl.question('Enter message to sign: ', (answer) => {
        resolve(answer);
      });
    });
    
    // Sign the message
    const signature = await cryptoUtils.signMessage(message);
    console.log('\n=== Signature Generated ===');
    console.log(`Message: ${message}`);
    console.log(`Signature: ${signature}`);
    
    // Generate JWT if requested
    const generateJwt = await new Promise<string>(resolve => {
      rl.question('Generate JWT token? (y/n): ', (answer) => {
        resolve(answer.toLowerCase());
      });
    });
    
    if (generateJwt === 'y') {
      const jwt = await cryptoUtils.signAsJWT(message);
      console.log('\n=== JWT Token ===');
      console.log(jwt);
    }
    
    // Verify the signature
    const verified = await cryptoUtils.verifySignature(message, signature, wallet.public_key);
    console.log('\n=== Verification ===');
    console.log(`Signature valid: ${verified ? 'Yes' : 'No'}`);
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
