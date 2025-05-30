
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SimpleHubNavbar } from '@/components/navbar/navbar-simple';
import { Footer } from '@/components/footer/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Save, User, Network, Key, Eye, EyeOff } from 'lucide-react';
import { useWalletStore } from '@/wallet/state';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { WalletSelector } from '@/wallet/selector';
import { WalletType, NetworkType, walletOptions } from '@/wallet/types';

export default function AccountSettings() {
  const { wallet, walletConnected } = useWalletStore();
  const router = useRouter();
  
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!walletConnected) {
      router.push('/signin');
    }
  }, [walletConnected, router]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulating an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Account settings updated successfully');
    } catch (err) {
      setError('Failed to update account settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPrivateKey = () => {
    // In a real implementation, you would decrypt and retrieve the private key
    // This is just a placeholder
    setPrivateKey('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
  };

  if (!wallet) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#03040B] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <SimpleHubNavbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-8 text-gray-400 hover:text-white hover:bg-transparent"
          onClick={() => router.push('/')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Account Settings</h2>
            <p className="mt-2 text-sm text-gray-400">
              Manage your wallet and account preferences
            </p>
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white">Wallet Information</CardTitle>
              <CardDescription>View and manage your wallet details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="bg-green-500/10 border-green-500/20 text-green-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-200">
                  <User className="inline h-4 w-4 mr-2" />
                  Wallet Address
                </Label>
                <Input
                  readOnly
                  value={wallet.address}
                  className="bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-gray-400">Your public wallet address</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-200">
                  <Network className="inline h-4 w-4 mr-2" />
                  Network
                </Label>
                <Input
                  readOnly
                  value={wallet.network || 'Unknown'}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-200">
                  <Key className="inline h-4 w-4 mr-2" />
                  Private Key
                </Label>
                <div className="relative">
                  <Input
                    readOnly
                    type={showPrivateKey ? "text" : "password"}
                    value={privateKey || '••••••••••••••••••••••••••••••••'}
                    className="bg-white/5 border-white/10 text-white pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="h-7 px-2 text-gray-400"
                      disabled={!privateKey}
                    >
                      {showPrivateKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleExportPrivateKey}
                      className="h-7 px-2 text-xs bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
                    >
                      Export
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-red-400">
                  Never share your private key with anyone. Keep it secure.
                </p>
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
