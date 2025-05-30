
import {
  blake2AsHex,
  sr25519PairFromSeed,
  encodeAddress,
  sr25519Sign,
  sr25519Verify,
  cryptoWaitReady,
} from '@polkadot/util-crypto';
import { base64url } from 'jose';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { secp256k1 } from '@noble/curves/secp256k1';

/**
 * Defines the structure of a wallet object
 */
export interface WalletState {
  address: string;
  crypto_type: 'sr25519' | 'ecdsa';
  public_key: string;
  private_key: string;
}

/**
 * Wallet class for managing cryptographic operations
 * Supports sr25519 and ecdsa signature schemes
 */
export class Wallet {
  private private_key!: string; // Stores the private key of the wallet
  public public_key!: string; // Stores the public key of the wallet
  public address!: string; // Stores the wallet's address
  public crypto_type!: string; // Defines the signature type used by the wallet

  /**
   * Signs a message using the wallet's private key
   * @param message - The message to sign
   * @returns A hex-encoded signature
   */
  public async sign(message: string): Promise<string> {
    if (!message) {
      throw new Error('Empty message cannot be signed');
    }
    const messageBytes: Uint8Array = new TextEncoder().encode(message);
    let signature: Uint8Array;
    
    if (this.crypto_type === 'sr25519') {
      signature = sr25519Sign(messageBytes, {
        publicKey: hexToU8a(this.public_key),
        secretKey: hexToU8a(this.private_key),
      });
    } else if (this.crypto_type === 'ecdsa') {
      const messageHash = blake2AsHex(message);
      signature = secp256k1
        .sign(hexToU8a(messageHash), hexToU8a(this.private_key))
        .toDERRawBytes();
    } else {
      throw new Error('Unsupported crypto type');
    }
    
    return u8aToHex(signature);
  }

  /**
   * Converts a string to bytes
   */
  str2bytes(str: string): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }
  
  /**
   * Converts bytes to a string
   */
  bytes2str(bytes: Uint8Array): string {
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }

  /**
   * Verifies a signature against a message and public key
   * @param message - The original message
   * @param signature - The signature to verify
   * @param public_key - The public key to verify against
   * @returns Boolean indicating if the signature is valid
   */
  public async verify(message: string, signature: string, public_key: string): Promise<boolean> {
    if (!message || !signature || !public_key) {
      throw new Error('Invalid verification parameters');
    }
    
    const messageBytes = new TextEncoder().encode(message);

    if (this.crypto_type === 'sr25519') {
      return sr25519Verify(messageBytes, hexToU8a(signature), hexToU8a(public_key));
    } else if (this.crypto_type === 'ecdsa') {
      const messageHash = blake2AsHex(message);
      return secp256k1.verify(hexToU8a(signature), hexToU8a(messageHash), hexToU8a(public_key));
    } else {
      throw new Error('Unsupported crypto type');
    }
  }

  /**
   * Encode data as base64url
   */
  _base64urlEncode(data: any): string {
    if (typeof data === 'string') {
      return base64url.encode(Buffer.from(data, 'utf-8')).replace(/=/g, '');
    } else if (Buffer.isBuffer(data)) {
      return base64url.encode(data).replace(/=/g, '');
    } else if (typeof data === 'object') {
      return base64url.encode(Buffer.from(JSON.stringify(data, null, 0), 'utf-8')).replace(/=/g, '');
    }
    throw new Error('Unsupported data type for base64url encoding');
  }

  /**
   * Decode base64url data
   */
  _base64urlDecode(data: string, asBuffer: boolean = false): any {
    const padding = '='.repeat((4 - (data.length % 4)) % 4);
    const decoded = base64url.decode(`${data}${padding}`);
    
    if (asBuffer) {
      return decoded;
    }
    
    try {
      return decoded.toString('utf-8');
    } catch (e) {
      return decoded;
    }
  }

  /**
   * Generate a JWT token with the given data
   * @param data - The data to include in the token
   * @param expiration - Token expiration time in seconds
   * @param mode - Token mode
   * @returns JWT token string
   */
  public getToken(data: String = 'hey', expiration: number = 3600, mode: string = 'bytes'): string {
    // Add standard JWT claims
    const tokenData = {
      data: data,
      iat: String(Date.now() / 1000),
      exp: String((Date.now() / 1000) + expiration),
      iss: this.address,
    };
    
    const header = {
      alg: this.crypto_type,
      typ: 'JWT',
    };

    // Create message to sign
    const message = `${this._base64urlEncode(header)}.${this._base64urlEncode(tokenData)}`;
    const signature = this.sign(message);
    const signatureEncoded = this._base64urlEncode(signature);
    
    // Combine to create the token
    return `${message}.${signatureEncoded}`;
  }

  /**
   * Creates a wallet from a password
   * @param password - The password to derive the wallet from
   * @param crypto_type - The cryptographic signature scheme to use
   * @returns A wallet state object
   */
  public async fromPassword(
    password: string,
    crypto_type: string = 'sr25519'
  ): Promise<WalletState> {
    if (!password || typeof password !== 'string') {
      throw new Error('Invalid password provided');
    }

    // Wait for WASM crypto initialization
    await cryptoWaitReady();

    // Derive a seed from the password using Blake2 hashing
    const seedHex = blake2AsHex(password, 256);
    const seedBytes = hexToU8a(seedHex);
    let wallet: WalletState;

    if (crypto_type === 'sr25519') {
      // Generate sr25519 keypair
      const keyPair = sr25519PairFromSeed(seedBytes);
      const address = encodeAddress(keyPair.publicKey, 42);

      wallet = {
        address: address,
        crypto_type: 'sr25519',
        public_key: u8aToHex(keyPair.publicKey),
        private_key: u8aToHex(keyPair.secretKey),
      };
    } else if (crypto_type === 'ecdsa') {
      // Generate ECDSA keypair using secp256k1
      const public_key = secp256k1.getPublicKey(seedHex);
      const address = blake2AsHex(seedHex, 256);
      wallet = {
        address: address,
        crypto_type: 'ecdsa',
        public_key: u8aToHex(public_key),
        private_key: seedHex,
      };
    } else {
      throw new Error('Unsupported crypto type');
    }

    // Set the wallet properties
    this.address = wallet.address;
    this.crypto_type = wallet.crypto_type;
    this.public_key = wallet.public_key;
    this.private_key = wallet.private_key;

    return wallet;
  }

  /**
   * Creates a wallet from a private key
   * @param private_key - The private key to use
   * @param crypto_type - The cryptographic signature scheme to use
   * @returns A wallet state object
   */
  public async fromPrivateKey(
    private_key: string,
    crypto_type: string = 'sr25519'
  ): Promise<WalletState> {
    if (!private_key || typeof private_key !== 'string') {
      throw new Error('Invalid private key provided');
    }
    
    // Wait for WASM crypto initialization
    await cryptoWaitReady();
    let wallet: WalletState;

    if (crypto_type === 'sr25519') {
      // Generate sr25519 keypair
      const keyPair = sr25519PairFromSeed(hexToU8a(private_key));
      const address = encodeAddress(keyPair.publicKey, 42);

      wallet = {
        address: address,
        crypto_type: 'sr25519',
        public_key: u8aToHex(keyPair.publicKey),
        private_key: u8aToHex(keyPair.secretKey),
      };
    } else if (crypto_type === 'ecdsa') {
      // Generate ECDSA keypair using secp256k1
      const public_key = secp256k1.getPublicKey(private_key);
      const address = blake2AsHex(private_key, 256);
      wallet = {
        address: address,
        crypto_type: 'ecdsa',
        public_key: u8aToHex(public_key),
        private_key: private_key,
      };
    } else {
      throw new Error('Unsupported crypto type');
    }

    // Set the wallet properties
    this.address = wallet.address;
    this.crypto_type = wallet.crypto_type;
    this.public_key = wallet.public_key;
    this.private_key = wallet.private_key;

    return wallet;
  }

  /**
   * Get a wallet from either a private key or password
   * @param private_key - Optional private key
   * @param password - Optional password
   * @param crypto_type - The cryptographic signature scheme to use
   * @returns A wallet state object
   */
  public async get_key(private_key: string | null = null, password: string | null = null, crypto_type: string = 'sr25519'): Promise<WalletState> {
    let wallet: WalletState;
    
    if (private_key !== null) {
      wallet = await this.fromPrivateKey(private_key, crypto_type);
    } else if (password !== null) {
      wallet = await this.fromPassword(password, crypto_type);
    } else {
      throw new Error('Either private key or password must be provided');
    }
    
    return wallet;
  }
}
