
# Wallet Password Authentication System

This system provides password-based authentication for wallet sign-in and sign-out operations.

## Components

### PasswordWallet

Used for signing in with a password. It can generate and use a default password for convenience.

```jsx
import { PasswordWallet } from '@/wallet/password/password-wallet';

<PasswordWallet 
  onSuccess={() => console.log('Sign in successful')} 
  onError={(error) => console.error(error)}
  useDefaultPassword={true} // Auto-generates a password if none exists
/>
```

### PasswordSignOut

Requires password confirmation before signing out, enhancing security.

```jsx
import { PasswordSignOut } from '@/wallet/password/password-signout';

<PasswordSignOut 
  onSuccess={() => console.log('Sign out successful')} 
  onError={(error) => console.error(error)}
/>
```

### SignOutDialog

A complete dialog component that handles sign-out confirmation, with special handling for password wallets.

```jsx
import { useState } from 'react';
import { SignOutDialog } from '@/components/dialogs/signout-dialog';

function MyComponent() {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setDialogOpen(true)}>
        Sign Out
      </button>
      
      <SignOutDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </>
  );
}
```

## Password Utilities

The system includes utilities for password generation and storage:

```javascript
import { 
  generateSecurePassword, 
  storeDefaultPassword,
  getDefaultPassword,
  generateAndStoreDefaultPassword,
  clearDefaultPassword
} from '@/wallet/utils/password-generator';

// Generate a new password
const password = generateSecurePassword();

// Store a password
storeDefaultPassword(password);

// Retrieve the stored password
const storedPassword = getDefaultPassword();

// Generate and store in one step
const newPassword = generateAndStoreDefaultPassword();

// Clear the stored password
clearDefaultPassword();
```

## Implementation Notes

1. The default password is stored in localStorage for convenience
2. For production use, consider implementing more secure storage methods
3. The sign-out confirmation adds an extra layer of security for password wallets
4. Non-password wallets use a simpler confirmation dialog

## Security Considerations

- The default password mechanism is designed for convenience in development
- For production applications, consider implementing more robust authentication
- Password storage in localStorage is not secure for highly sensitive applications
