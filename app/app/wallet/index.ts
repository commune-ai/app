import { 
    blake2AsHex, 
    sr25519PairFromSeed,
    encodeAddress,
    sr25519Sign,
    sr25519Verify
} from '@polkadot/util-crypto';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { secp256k1 } from '@noble/curves/secp256k1';

export interface WalletType {
    address: string;
    crypto_type: 'sr25519' | 'ecdsa';
    publicKey: string;
    privateKey: string;
}

export class Wallet{

    private privateKey : string;
    public publicKey : string;
    public address : string;
    public crypto_type : 'sr25519' | 'ecdsa';

    constructor(password: string = "bro", crypto_type:string='sr25519') {
        this.fromPassword(password=password, crypto_type=crypto_type);

    }

    private fromPassword(password: string, crypto_type:string='sr25519'): WalletType {
        if (!password || typeof password !== 'string') {
            throw new Error('Invalid password provided');
        }
        const seedHex = blake2AsHex(password, 256);
        const seedBytes = hexToU8a(seedHex);
        // Create SR25519 key pair
        let wallet : WalletType;

        if (crypto_type === 'sr25519') {
            const keyPair = sr25519PairFromSeed(seedBytes);
            const address = encodeAddress(keyPair.publicKey, 42);

            wallet = {
                address,
                crypto_type: 'sr25519',
                publicKey: u8aToHex(keyPair.publicKey),
                privateKey: u8aToHex(keyPair.secretKey)
            };
        } else if (crypto_type === 'ecdsa') {
            const keyPair = secp256k1.keyFromPrivate(seedHex);
            const publicKey = keyPair.getPublic(true, 'hex');
            wallet =  {
                address: publicKey,
                crypto_type: 'ecdsa',
                publicKey: publicKey,
                privateKey: seedHex
            };
        } else {
            throw new Error('Unsupported crypto type');
        }

        this.privateKey = wallet.privateKey;
        this.publicKey = wallet.publicKey;
        this.address = wallet.address;
        this.crypto_type = wallet.crypto_type;

    }


    public async sign(message: string): Promise<string> {
        if (!message) {
            throw new Error('Empty message cannot be signed');
        }
        const messageBytes = this.encode(message);
    
        if (this.crypto_type === 'sr25519') {
            const signature = sr25519Sign(hexToU8a(this.publicKey),hexToU8a(this.privateKey),messageBytes);
            return this.decode(signature);
        
        } else if (this.crypto_type === 'ecdsa') {
            const messageHash = blake2AsHex(message);
            const signature = secp256k1.sign(hexToU8a(messageHash),hexToU8a(this.privateKey));
            return this.decode(signature);
        }
        else {
            throw new Error('Unsupported crypto type');
        }
    }

    public async verify(
        message: string, 
        signature: string, 
        publicKey: string,
    ): Promise<boolean> {
        if (!message || !signature || !publicKey) {
            throw new Error('Invalid verification parameters');
        }
        const sigType = this.crypto_type;
        const messageBytes = new TextEncoder().encode(message);

        if (sigType === 'sr25519') {
            return sr25519Verify(
                messageBytes,
                hexToU8a(signature),
                hexToU8a(publicKey)
            );
        } else if (sigType === 'ecdsa') {
            const messageHash = blake2AsHex(message);
            return secp256k1.verify(
                hexToU8a(signature),
                hexToU8a(messageHash),
                hexToU8a(publicKey)
            );
        } else {
            throw new Error('Unsupported crypto type');
        }
        

    }

    encode(message: string): Uint8Array {
        return new Uint8Array(Buffer.from(message));
    }

    decode(message: Uint8Array): string {
        return Buffer.from(message).toString();
    }
}
