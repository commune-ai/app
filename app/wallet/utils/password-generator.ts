
/**
 * Password generator and storage utility for wallet authentication
 */

const PASSWORD_STORAGE_KEY = 'wallet_default_password';

/**
 * Generates a secure random password
 * @param length The length of the password to generate
 * @returns A secure random password
 */
export function generateSecurePassword(length: number = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?';
  let password = '';
  
  // Use crypto API for secure random generation if available
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(array[i] % charset.length);
    }
  } else {
    // Fallback to Math.random (less secure)
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }
  
  return password;
}

/**
 * Stores the default password in localStorage
 * @param password The password to store
 */
export function storeDefaultPassword(password: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PASSWORD_STORAGE_KEY, password);
  }
}

/**
 * Retrieves the default password from localStorage
 * @returns The stored default password or null if not found
 */
export function getDefaultPassword(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(PASSWORD_STORAGE_KEY);
  }
  return null;
}

/**
 * Generates a new default password and stores it
 * @returns The newly generated password
 */
export function generateAndStoreDefaultPassword(): string {
  const password = generateSecurePassword();
  storeDefaultPassword(password);
  return password;
}

/**
 * Clears the stored default password
 */
export function clearDefaultPassword(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PASSWORD_STORAGE_KEY);
  }
}
