
import { Wallet } from './wallet';
import { base64url } from 'jose';

export class Auth {
  private wallet: Wallet | null = null;

  /**
   * Initialize the auth system with a wallet
   */
  init(wallet: Wallet) {
    this.wallet = wallet;
  }

  /**
   * Generate a JWT token with the given data
   */
  getToken(data: any = 'hey', expiration: number = 3600): string {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }

    // Add standard JWT claims
    const tokenData = {
      data: data,
      iat: String(Date.now() / 1000),
      exp: String((Date.now() / 1000) + expiration),
      iss: this.wallet.address,
    };
    
    const header = {
      alg: this.wallet.crypto_type,
      typ: 'JWT',
    };

    // Create message to sign
    const message = `${this._base64urlEncode(header)}.${this._base64urlEncode(tokenData)}`;
    const signature = this.wallet.sign(message);
    const signatureEncoded = this._base64urlEncode(signature);
    
    // Combine to create the token
    return `${message}.${signatureEncoded}`;
  }

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string): any {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }

    // Split the token into parts
    const [headerEncoded, dataEncoded, signatureEncoded] = token.split('.');
  
    // Decode the data
    const data = JSON.parse(this._base64urlDecode(dataEncoded));
    const headers = JSON.parse(this._base64urlDecode(headerEncoded));
    
    // Check if token is expired
    if ('exp' in data && parseFloat(data.exp) < (Date.now() / 1000)) {
      throw new Error("Token has expired");
    }
    
    // Verify signature
    const message = `${headerEncoded}.${dataEncoded}`;
    const signature = this._base64urlDecode(signatureEncoded, true);
    
    if (!this.wallet.verify(message, signature, data.iss)) {
      throw new Error("Invalid token signature");
    }
    
    // Add additional fields to the returned data
    return {
      ...data,
      time: data.iat,
      signature: '0x' + Buffer.from(signature).toString('hex'),
      alg: headers.alg,
      typ: headers.typ,
      token,
      key: data.iss
    };
  }

  /**
   * Encode data in base64url format
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
}
