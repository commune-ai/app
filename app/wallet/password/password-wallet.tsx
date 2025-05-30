
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, Loader } from 'lucide-react';
import { useWalletStore } from '@/wallet/state';
import { WalletType, NetworkType } from '@/wallet/types';
import { Wallet } from '@/wallet/wallet';
import { getDefaultPassword } from '@/wallet/utils/password-generator';

interface PasswordWalletProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  useDefaultPassword?: boolean;
}

export function PasswordWallet({ 
  onSuccess, 
  onError, 
  useDefaultPassword = true 
}: PasswordWalletProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { setWalletConnected, setWallet } = useWalletStore();

  // Load default password if enabled
  useEffect(() => {
    if (useDefaultPassword) {
      const defaultPassword = getDefaultPassword();
      setPassword(defaultPassword);
      
      // Auto-connect with default password if available
      if (defaultPassword) {
        handlePasswordConnect(defaultPassword);
      }
    }
  }, [useDefaultPassword]);

  const handlePasswordConnect = async (passwordToUse: string) => {
    if (!passwordToUse) {
      onError?.('Password is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const localWallet = new Wallet();
      const walletData = await localWallet.fromPassword(passwordToUse, 'sr25519');
      
      // Set wallet in store
      setWallet(
        WalletType.PASSWORD,
        walletData.address,
        "0", // Initial balance for password wallet
        NetworkType.LOCAL
      );
      
      setWalletConnected(true);
      onSuccess?.();
    } catch (error) {
      console.error("Password wallet error:", error);
      onError?.(error instanceof Error ? error.message : "Failed to process password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePasswordConnect(password);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
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
        className="w-full bg-blue-500 text-white hover:bg-blue-600"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          "Connect with Password"
        )}
      </Button>
      
      {useDefaultPassword && (
        <p className="text-xs text-gray-400 text-center">
          A random secure password has been generated for you.
        </p>
      )}
    </form>
  );
}
