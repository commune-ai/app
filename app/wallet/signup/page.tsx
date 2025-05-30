
"use client";

import { useRouter } from "next/navigation";
import { SimpleHubNavbar } from "@/components/navbar/navbar-simple";
import { Footer } from "@/components/footer/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, AlertTriangle, Check, ChevronLeft, Loader, Key, Eye, EyeOff } from "lucide-react";
import { useSignupStore } from "@/store/use-signup-state";
import { useEffect, useState } from "react";
import { useWalletStore } from "@/wallet/state";
import { WalletType, NetworkType, walletOptions } from "@/wallet/types";
import { Label } from "@/components/ui/label";
import { WalletSelector } from "@/wallet/selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Wallet } from "@/wallet/wallet";

export default function SignUp() {
  const {
    copied,
    confirmed,
    walletLoading,
    getMnemonicWords,
    generateMnemonic,
    handleCopyMnemonic,
    handleSignUp,
    setWalletSelected,
    walletSelected,
  } = useSignupStore();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  const { walletConnected, setWalletConnected, setWallet } = useWalletStore();
  const router = useRouter();

  useEffect(() => {
    generateMnemonic();
  }, [generateMnemonic]);

  useEffect(() => {
    if (walletConnected) {
      router.push("/");
    }
  }, [walletConnected, router]);

  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    setIsPasswordLoading(true);
    setPasswordError(null);
    
    try {
      const localWallet = new Wallet();
      const walletData = await localWallet.fromPassword(password);
      
      // Set wallet in store
      setWallet(
        WalletType.PASSWORD,
        walletData.address,
        "0", // Initial balance for password wallet
        NetworkType.LOCAL
      );
      
      setWalletConnected(true);
      router.push("/");
    } catch (error) {
      console.error("Password wallet error:", error);
      setPasswordError(error instanceof Error ? error.message : "Failed to create wallet");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#03040B] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <SimpleHubNavbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-8 text-gray-400 hover:text-white hover:bg-transparent"
          onClick={() => router.push("/")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Create your account</h2>
            <p className="mt-2 text-sm text-gray-400">
              Choose your preferred method to create a wallet
            </p>
          </div>

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="password">Password Wallet</TabsTrigger>
              <TabsTrigger value="mnemonic">Mnemonic Wallet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="password" className="mt-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Create Password Wallet</CardTitle>
                  <CardDescription className="text-gray-400">
                    Create a wallet using a secure password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSignUp} className="space-y-4">
                    {passwordError && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{passwordError}</AlertDescription>
                      </Alert>
                    )}
                    
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
                          placeholder="Create a secure password"
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                    
                    <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        Remember your password! If you forget it, you will not be able to recover your wallet.
                      </AlertDescription>
                    </Alert>
                    
                    <Button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      disabled={isPasswordLoading}
                    >
                      {isPasswordLoading ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Creating Wallet...
                        </>
                      ) : (
                        "Create Password Wallet"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mnemonic" className="mt-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span>Important Security Notice</span>
                  </CardTitle>
                  <CardDescription className="text-yellow-200/80">
                    Write down these words in the exact order and keep them safe. You&apos;ll need them
                    to access your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-200">Select Wallet</Label>
                    <WalletSelector
                      options={walletOptions}
                      selectedWallet={walletSelected}
                      onSelect={(walletId: string) => setWalletSelected(walletId as WalletType)}
                    />
                  </div>
                  <div className="relative">
                    <div className="p-4 bg-[#0D1117] rounded-lg border border-white/10 font-mono text-sm">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 select-none">
                        {getMnemonicWords().map((word, index) => (
                          <div key={index} className="flex items-center space-x-2 text-gray-300">
                            <span className="text-gray-500">
                              {(index + 1).toString().padStart(2, "0")}.
                            </span>
                            <span>{word}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyMnemonic}
                        className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-white/10"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {!confirmed && (
                    <Alert
                      variant="destructive"
                      className="bg-yellow-500/10 border-yellow-500/20 text-yellow-200"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Action Required</AlertTitle>
                      <AlertDescription>
                        Please ensure you have saved your mnemonic phrase before continuing. You
                        won&apos;t be able to see it again.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleSignUp}
                    className={`w-full ${
                      confirmed ? "bg-blue-500 hover:bg-blue-600" : "bg-yellow-500 hover:bg-yellow-600"
                    } text-white transition-colors`}
                    disabled={walletLoading}
                  >
                    {confirmed ? "Create Account" : "I've Saved My Mnemonic"}
                    {walletLoading && <Loader className="ml-2 h-5 w-5 animate-spin" />}
                  </Button>

                  {copied && (
                    <p className="text-center text-sm text-green-400">Mnemonic copied to clipboard!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
