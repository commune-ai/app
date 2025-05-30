# Wallet Module

This module provides a comprehensive wallet implementation supporting multiple cryptographic signature schemes.

## Features

- Support for sr25519 and ecdsa signature schemes
- Wallet generation from password or private key
- Message signing and signature verification
- JWT token generation
- Integration with Polkadot, Ethereum, and Solana ecosystems

## Usage Examples

### Creating a Wallet

```typescript
import { Wallet } from './wallet';

async function createWallet() {
  const wallet = new Wallet();
  
  // Create from password
  const walletData = await wallet.fromPassword('your_secure_password', 'sr25519');
  console.log('Address:', walletData.address);
  
  // Or create from private key
  // const walletData = await wallet.fromPrivateKey('your_private_key', 'ecdsa');
}
```

### Signing Messages

```typescript
import { Wallet } from './wallet';

async function signMessage() {
  const wallet = new Wallet();
  await wallet.fromPassword('your_secure_password');
  
  const message = 'Hello, world!';
  const signature = await wallet.sign(message);
  console.log('Signature:', signature);
  
  // Verify the signature
  const isValid = await wallet.verify(message, signature, wallet.public_key);
  console.log('Signature valid:', isValid);
}
```

### Generating JWT Tokens

```typescript
import { Wallet } from './wallet';

async function generateToken() {
  const wallet = new Wallet();
  await wallet.fromPassword('your_secure_password');
  
  const data = { userId: 123, role: 'admin' };
  const token = wallet.getToken(data, 3600); // 1 hour expiration
  console.log('JWT Token:', token);
}
```
