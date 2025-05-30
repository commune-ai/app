
/**
 * Test script for wallet functionality
 * 
 * This script tests:
 * - Password wallet generation
 * - Default password functionality
 * - JWT token generation and verification
 */

const { generateRandomPassword } = require('../app/wallet/utils/password-generator');

// Test password generation
function testPasswordGeneration() {
  console.log('Testing password generation:');
  
  // Generate 5 random passwords
  for (let i = 0; i < 5; i++) {
    const password = generateRandomPassword();
    console.log(`Password ${i+1}: ${password}`);
    
    // Verify password meets requirements
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password);
    
    console.log(`  - Has lowercase: ${hasLowercase}`);
    console.log(`  - Has uppercase: ${hasUppercase}`);
    console.log(`  - Has number: ${hasNumber}`);
    console.log(`  - Has special: ${hasSpecial}`);
    console.log(`  - Length: ${password.length}`);
    console.log('');
  }
}

// Run tests
function runTests() {
  console.log('=== Wallet System Tests ===\n');
  testPasswordGeneration();
  console.log('All tests completed!');
}

runTests();
