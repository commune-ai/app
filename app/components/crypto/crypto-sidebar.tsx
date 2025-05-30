
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Check, Key, Lock, Unlock, FileSignature } from 'lucide-react';
import { useWalletStore } from '@/wallet/state';
import { Wallet } from '@/wallet/wallet';
import { CryptoUtils } from '@/wallet/crypto-utils';

export function CryptoSidebar() {
  const { wallet, walletConnected } = useWalletStore();
  const { toast } = useToast();
  const [walletInstance, setWalletInstance] = useState<Wallet | null>(null);
  const [cryptoUtils, setCryptoUtils] = useState<CryptoUtils | null>(null);
  
  // Form states
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [jwt, setJwt] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Encryption states
  const [textToEncrypt, setTextToEncrypt] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [encryptionNonce, setEncryptionNonce] = useState('');
  const [textToDecrypt, setTextToDecrypt] = useState('');
  const [decryptNonce, setDecryptNonce] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [recipientPublicKey, setRecipientPublicKey] = useState('');

  // Initialize wallet and crypto utils
  useEffect(() => {
    if (walletConnected && wallet?.address) {
      // In a real app, you would retrieve the actual wallet instance
      // This is a mock implementation
      const mockWallet = new Wallet();
      mockWallet.fromPassword('password').then(() => {
        setWalletInstance(mockWallet);
        setCryptoUtils(new CryptoUtils(mockWallet));
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
      
      const jwtToken = await cryptoUtils.signAsJWT(message);
      setJwt(jwtToken);
      
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

  const handleEncrypt = async () => {
    if (!textToEncrypt || !cryptoUtils) return;
    
    setLoading(true);
    try {
      const { encrypted, nonce } = await cryptoUtils.encryptMessage(
        textToEncrypt,
        recipientPublicKey || undefined
      );
      
      setEncryptedText(encrypted);
      setEncryptionNonce(nonce);
      
      toast({
        title: "Message encrypted",
        description: "Your message has been encrypted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Encryption failed",
        description: error instanceof Error ? error.message : "Failed to encrypt message",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!textToDecrypt || !decryptNonce || !cryptoUtils) return;
    
    setLoading(true);
    try {
      const decrypted = await cryptoUtils.decryptMessage(
        textToDecrypt,
        decryptNonce
      );
      
      setDecryptedText(decrypted);
      
      toast({
        title: "Message decrypted",
        description: "Your message has been decrypted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Decryption failed",
        description: error instanceof Error ? error.message : "Failed to decrypt message",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!walletConnected) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Crypto Tools</CardTitle>
          <CardDescription>
            Connect your wallet to use cryptographic tools
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Crypto Tools</CardTitle>
        <CardDescription>
          Sign, encrypt, and decrypt messages with your wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sign" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger value="sign" className="data-[state=active]:bg-blue-500">
              <FileSignature className="h-4 w-4 mr-2" />
              Sign
            </TabsTrigger>
            <TabsTrigger value="encrypt" className="data-[state=active]:bg-blue-500">
              <Lock className="h-4 w-4 mr-2" />
              Encrypt
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
              </div>
            )}
            
            {jwt && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="jwt">JWT Token</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(jwt, "JWT token copied to clipboard")}
                    className="h-6 px-2 text-xs"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <Textarea
                  id="jwt"
                  readOnly
                  value={jwt}
                  className="bg-white/5 border-white/10 text-white text-xs h-20"
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="encrypt" className="space-y-4 mt-4">
            <Tabs defaultValue="encrypt-tab" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5">
                <TabsTrigger value="encrypt-tab" className="data-[state=active]:bg-blue-500">
                  <Lock className="h-4 w-4 mr-2" />
                  Encrypt
                </TabsTrigger>
                <TabsTrigger value="decrypt-tab" className="data-[state=active]:bg-blue-500">
                  <Unlock className="h-4 w-4 mr-2" />
                  Decrypt
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="encrypt-tab" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="textToEncrypt">Text to Encrypt</Label>
                  <Textarea
                    id="textToEncrypt"
                    placeholder="Enter text to encrypt"
                    value={textToEncrypt}
                    onChange={(e) => setTextToEncrypt(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recipientKey">Recipient Public Key (Optional)</Label>
                  <Input
                    id="recipientKey"
                    placeholder="Enter recipient's public key for asymmetric encryption"
                    value={recipientPublicKey}
                    onChange={(e) => setRecipientPublicKey(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                
                <Button 
                  onClick={handleEncrypt} 
                  disabled={!textToEncrypt || loading}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {loading ? 'Encrypting...' : 'Encrypt Message'}
                </Button>
                
                {encryptedText && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="encryptedText">Encrypted Text</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(encryptedText, "Encrypted text copied to clipboard")}
                          className="h-6 px-2 text-xs"
                        >
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <Textarea
                        id="encryptedText"
                        readOnly
                        value={encryptedText}
                        className="bg-white/5 border-white/10 text-white text-xs h-20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="nonce">Nonce</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(encryptionNonce, "Nonce copied to clipboard")}
                          className="h-6 px-2 text-xs"
                        >
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <Input
                        id="nonce"
                        readOnly
                        value={encryptionNonce}
                        className="bg-white/5 border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="decrypt-tab" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="textToDecrypt">Encrypted Text</Label>
                  <Textarea
                    id="textToDecrypt"
                    placeholder="Enter encrypted text"
                    value={textToDecrypt}
                    onChange={(e) => setTextToDecrypt(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="decryptNonce">Nonce</Label>
                  <Input
                    id="decryptNonce"
                    placeholder="Enter nonce"
                    value={decryptNonce}
                    onChange={(e) => setDecryptNonce(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                
                <Button 
                  onClick={handleDecrypt} 
                  disabled={!textToDecrypt || !decryptNonce || loading}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {loading ? 'Decrypting...' : 'Decrypt Message'}
                </Button>
                
                {decryptedText && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="decryptedText">Decrypted Text</Label>
                    <Textarea
                      id="decryptedText"
                      readOnly
                      value={decryptedText}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
