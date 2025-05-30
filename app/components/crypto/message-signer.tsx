
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Check, FileSignature, ShieldCheck } from 'lucide-react';
import { useWalletStore } from '@/wallet/state';
import { Wallet } from '@/wallet/wallet';
import { CryptoUtils } from '@/wallet/crypto-utils';
import { truncateAddress } from '@/utils/wallet-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function MessageSigner() {
  const { wallet, walletConnected } = useWalletStore();
  const { toast } = useToast();
  const [walletInstance, setWalletInstance] = useState<Wallet | null>(null);
  const [cryptoUtils, setCryptoUtils] = useState<CryptoUtils | null>(null);
  
  // Form states
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('');
  const [verifySignature, setVerifySignature] = useState('');
  const [verifyPublicKey, setVerifyPublicKey] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize wallet and crypto utils
  useEffect(() => {
    if (walletConnected && wallet?.address) {
      // In a real app, you would retrieve the actual wallet instance
      // This is a mock implementation
      const mockWallet = new Wallet();
      mockWallet.fromPassword('password').then(() => {
        setWalletInstance(mockWallet);
        setCryptoUtils(new CryptoUtils(mockWallet));
        // Pre-fill the verification public key with the current wallet's public key
        setVerifyPublicKey(mockWallet.public_key);
      });
    }
  }, [walletConnected, wallet]);

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: message,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignMessage = async () => {
    if (!message || !cryptoUtils) return;
    
    setLoading(true);
    try {
      const sig = await cryptoUtils.signMessage(message);
      setSignature(sig);
      
      toast({
        title: "Message signed",
        description: "Your message has been signed successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signing failed",
        description: error instanceof Error ? error.message : "Failed to sign message",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignature = async () => {
    if (!verifyMessage || !verifySignature || !verifyPublicKey || !cryptoUtils) return;
    
    setLoading(true);
    try {
      const result = await cryptoUtils.verifySignature(
        verifyMessage,
        verifySignature,
        verifyPublicKey
      );
      
      setVerificationResult(result);
      
      toast({
        title: result ? "Verification successful" : "Verification failed",
        description: result 
          ? "The signature is valid for this message and public key." 
          : "The signature could not be verified with the provided message and public key.",
        variant: result ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Failed to verify signature",
      });
      setVerificationResult(false);
    } finally {
      setLoading(false);
    }
  };

  if (!walletConnected) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Message Signer</CardTitle>
          <CardDescription>
            Connect your wallet to sign and verify messages
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Message Signer</CardTitle>
        <CardDescription>
          Sign and verify messages with your wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sign" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger value="sign" className="data-[state=active]:bg-blue-500">
              <FileSignature className="h-4 w-4 mr-2" />
              Sign
            </TabsTrigger>
            <TabsTrigger value="verify" className="data-[state=active]:bg-blue-500">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Verify
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sign" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter message to sign"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <Button 
              onClick={handleSignMessage} 
              disabled={!message || loading}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {loading ? 'Signing...' : 'Sign Message'}
            </Button>
            
            {signature && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="signature">Signature</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(signature, "Signature copied to clipboard")}
                    className="h-6 px-2 text-xs"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <Textarea
                  id="signature"
                  readOnly
                  value={signature}
                  className="bg-white/5 border-white/10 text-white text-xs h-20"
                />
                <div className="text-xs text-gray-400">
                  <p>Signed with: {walletInstance?.public_key ? truncateAddress(walletInstance.public_key, 8, 8) : 'Unknown'}</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="verify" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="verifyMessage">Message</Label>
              <Textarea
                id="verifyMessage"
                placeholder="Enter message to verify"
                value={verifyMessage}
                onChange={(e) => setVerifyMessage(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verifySignature">Signature</Label>
              <Textarea
                id="verifySignature"
                placeholder="Enter signature to verify"
                value={verifySignature}
                onChange={(e) => setVerifySignature(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verifyPublicKey">Public Key</Label>
              <Input
                id="verifyPublicKey"
                placeholder="Enter public key (defaults to your wallet's public key)"
                value={verifyPublicKey}
                onChange={(e) => setVerifyPublicKey(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <Button 
              onClick={handleVerifySignature} 
              disabled={!verifyMessage || !verifySignature || !verifyPublicKey || loading}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {loading ? 'Verifying...' : 'Verify Signature'}
            </Button>
            
            {verificationResult !== null && (
              <div className={`p-3 rounded-md mt-4 ${verificationResult ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                <div className="flex items-center">
                  {verificationResult ? (
                    <>
                      <ShieldCheck className="h-5 w-5 mr-2" />
                      <span>Signature verified successfully!</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5 mr-2" />
                      <span>Signature verification failed.</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
