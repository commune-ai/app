
/**
 * Truncates an address for display purposes
 * @param address - The full address
 * @param startChars - Number of characters to show at the start
 * @param endChars - Number of characters to show at the end
 * @returns Truncated address string
 */
export function truncateAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Formats a balance with appropriate units
 * @param balance - The balance to format
 * @param decimals - Number of decimal places
 * @param symbol - Currency symbol
 * @returns Formatted balance string
 */
export function formatBalance(
  balance: string | number,
  decimals: number = 4,
  symbol: string = ''
): string {
  if (!balance) return '0';
  
  const num = typeof balance === 'string' ? parseFloat(balance) : balance;
  
  if (isNaN(num)) return '0';
  
  const formattedBalance = num.toFixed(decimals);
  
  // Remove trailing zeros
  const cleanedBalance = formattedBalance.replace(/\.?0+$/, '');
  
  return symbol ? `${cleanedBalance} ${symbol}` : cleanedBalance;
}
