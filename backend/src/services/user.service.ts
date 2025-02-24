import bcrypt from 'bcrypt';
import { signatureVerify } from '@polkadot/util-crypto';
import { ethers } from 'ethers';
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
export class UserService {
    static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
    static async generateNonce(): Promise<string> {
        return Math.random().toString(36).substring(2, 15);
    }

    static async verifyWalletSignature(type: string, nonce: string, address: string, signature: string): Promise<boolean> {
        switch (type) {
            case "metamask": {
                const recoveredAddress = ethers.verifyMessage(nonce, signature);
                return recoveredAddress.toLowerCase() === address.toLowerCase();
            }
            case "subwallet": {
                const { isValid } = signatureVerify(nonce, signature, address);
                return isValid;
            }
            case "phantom": {
                const nonceUint8 = new TextEncoder().encode(nonce);
                const signatureUint8 = new Uint8Array(atob(signature).split("").map(c => c.charCodeAt(0)));
                return nacl.sign.detached.verify(
                    nonceUint8,
                    signatureUint8,
                    new PublicKey(address).toBytes()
                );
            }
            default:
                throw new Error("Invalid wallet type for signature verification");
        }
    }
}