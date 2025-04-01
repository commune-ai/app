import * as c from './crypto';
import { base64url } from 'jose';





export class JWT {
  /**
   * Generate the headers with the JWT token
   */
  getHeaders(data: any, key: string = null, cryptoType: string = 'ecdsa', mode: string = 'dict'): any {
    const headers = this.getToken(c.hash(data), key, cryptoType, mode);
    return headers;
  }

  /**
   * Verify and decode a JWT token from headers
   */
  verifyHeaders(headers: any, data: any = null): any {
    const verified = this.verifyToken(headers.token);
    if (!verified) {
      throw new Error('Invalid signature');
    }
    
    if (data !== null) {
      if (verified.data !== c.hash(data)) {
        throw new Error(`Invalid data ${verified.data} != ${c.hash(data)}`);
      }
    }
    
    return verified;
  }

  /**
   * Check if the crypto type is valid
   */
  checkCryptoType(cryptoType: string): void {
    if (!['ecdsa', 'sr25519'].includes(cryptoType)) {
      throw new Error(`Invalid crypto_type ${cryptoType}`);
    }
  }

  /**
   * Generate a JWT token with the given data
   */
  getToken(data: any = 'hey', key: any = null, cryptoType: string = 'ecdsa', 
           expiration: number = 3600, mode: string = 'bytes'): any {
    
    let keyObj;
    if (typeof key === 'string' || key === null) {
      keyObj = c.getKey(key, { cryptoType });
    } else {
      keyObj = key;
      if (cryptoType !== keyObj.getCryptoType(keyObj.cryptoType)) {
        cryptoType = keyObj.getCryptoType(keyObj.cryptoType);
      }
    }

    this.checkCryptoType(cryptoType);
    
    let tokenData: any;
    if (typeof data !== 'object' || data === null) {
      tokenData = { data };
    } else {
      tokenData = { ...data };
    }

    // Add standard JWT claims
    tokenData = {
      ...tokenData,
      iat: String(Date.now() / 1000),
      exp: String((Date.now() / 1000) + expiration),
      iss: keyObj.keyAddress,
    };

    const header = {
      alg: cryptoType,
      typ: 'JWT',
    };

    // Create message to sign
    const message = `${this._base64urlEncode(header)}.${this._base64urlEncode(tokenData)}`;
    
    // For asymmetric algorithms, use the key's sign method
    const signature = keyObj.sign(message, 'bytes');
    const signatureEncoded = this._base64urlEncode(signature);
    
    // Combine to create the token
    const token = `${message}.${signatureEncoded}`;

    if (!['bytes', 'dict'].includes(mode)) {
      throw new Error(`Invalid mode ${mode}`);
    }

    if (mode === 'dict') {
      return this.verifyToken(token);
    } else if (mode === 'bytes') {
      return token;
    }
  }

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string | any): any {
    if (typeof token === 'object' && token !== null && 'token' in token) {
      token = token.token;
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
    
    if (!verify(message, signature, data.iss, headers.alg)) {
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

  /**
   * Test the JWT token functionality
   */
  testToken(testData: any = { fam: 'fam', admin: 1 }, cryptoType: string = 'ecdsa'): any {
    // Generate a token
    const token = this.getToken(testData, null, cryptoType);
    
    // Verify the token
    const decoded = this.verifyToken(token);
    
    // Check if original data is in the decoded data
    const validationPassed = Object.keys(testData).every(key => testData === decoded);
    if (!validationPassed) {
      throw new Error("Decoded data does not match original data");
    }
    
    // Test token expiration
    const quickToken = this.getToken(testData, null, cryptoType, 0.1);
    
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        let expiredTokenCaught = false;
        try {
          this.verifyToken(quickToken);
        } catch (e) {
          expiredTokenCaught = true;
        }
        
        if (!expiredTokenCaught) {
          throw new Error("Expired token not caught");
        }
        
        resolve({
          token,
          decoded_data: decoded,
          crypto_type: cryptoType,
          quick_token: quickToken,
          expired_token_caught: expiredTokenCaught
        });
      }, 200); // Wait for token to expire
    });
  }

  /**
   * Test the headers functionality
   */
  testHeaders(key: string = 'test.jwt', cryptoType: string = 'ecdsa'): any {
    const data = { fn: 'test', params: { a: 1, b: 2 } };
    const headers = this.getHeaders(data, key, cryptoType);
    const verified1 = this.verifyHeaders(headers);
    const verified2 = this.verifyHeaders(headers, data);
    
    return { headers, verified: verified2 };
  }

  /**
   * Run all tests
   */
  async test(): Promise<any> {
    const tokenTest = await this.testToken();
    return {
      token: tokenTest,
      headers: this.testHeaders()
    };
  }
}