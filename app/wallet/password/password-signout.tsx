
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, Loader, LogOut } from 'lucide-react';
import { useWalletStore } from '@/wallet/state';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getDefaultPassword } from '@/wallet/utils/password-generator';

interface PasswordSignOutProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PasswordSignOut({ onSuccess, onError }: PasswordSignOutProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { disconnectWallet } = useWalletStore();

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Password is required');
      onError?.('Password is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if the password matches the default password
      const defaultPassword = getDefaultPassword();
      
      if (password === defaultPassword) {
        // Password matches, proceed with sign out
        disconnectWallet();
        onSuccess?.();
      } else {
        // Password doesn't match
        setError('Incorrect password');
        onError?.('Incorrect password');
      }
    } catch (error) {
      console.error("Password verification error:", error);
      setError(error instanceof Error ? error.message : "Failed to verify password");
      onError?.(error instanceof Error ? error.message : "Failed to verify password");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSignOut} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="signout-password">Confirm Password</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="signout-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password to sign out"
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-red-500 text-white hover:bg-red-600"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Signing Out...
          </>
        ) : (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Confirm Sign Out
          </>
        )}
      </Button>
    </form>
  );
}
