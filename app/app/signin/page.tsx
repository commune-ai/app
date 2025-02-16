"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SimpleHubNavbar } from "@/components/navbar/hub-navbar-simple";
import { Footer } from "@/components/footer/hub-footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Key, ChevronLeft, Loader } from "lucide-react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Wallet } from "@/utils/local-wallet";
import { useWalletStore } from "@/store/use-wallet-state";
import { WalletType } from "@/types/wallet-types";

const wsProvider = new WsProvider("wss://rpc.polkadot.io");
const api = ApiPromise.create({ provider: wsProvider });

export default function SignIn() {
  const [privateKey, setPrivateKey] = useState("");
  const router = useRouter();
  const { setWallet, setWalletConnected } = useWalletStore();
  const [walletLoading, setWalletLoading] = useState(false);

  const getBalance = useCallback(async (address: string) => {
    const apiInstance = await api;
    const accountInfo = await apiInstance.query.system.account(address);
    const {
      data: { free: balance },
    } = accountInfo.toHuman() as { data: { free: string } };
    return balance.toString();
  }, []);

  const handleSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!privateKey) return;

      try {
        setWalletLoading(true);
        const localWallet = new Wallet();
        const walletData = await localWallet.fromPassword(privateKey);
        const walletAddress = walletData.address;

        if (walletAddress === "undefined") {
          throw new Error("Invalid wallet address");
        }

        const balance = await getBalance(walletAddress);
        if (balance === "undefined") {
          throw new Error("Invalid balance");
        }

        setWalletConnected(true);
        setWallet(WalletType.LOCAL, walletAddress, balance);
        router.push("/");
      } catch (e) {
        console.error(e);
      } finally {
        setWalletLoading(false);
      }
    },
    [privateKey, getBalance, setWallet, setWalletConnected, router]
  );

  const handleBack = useCallback(() => {
    router.push("/");
  }, [router]);

  const handlePrivateKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivateKey(e.target.value);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#03040B] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <SimpleHubNavbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-8 text-gray-400 hover:text-white hover:bg-transparent"
          onClick={handleBack}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to your account using your private key
            </p>
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white">Sign In</CardTitle>
              <CardDescription>Enter your private key to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="privateKey"
                      type="password"
                      placeholder="Enter your private key"
                      value={privateKey}
                      onChange={handlePrivateKeyChange}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  disabled={walletLoading}
                >
                  Sign In {walletLoading && <Loader className="h-5 w-5 animate-spin" />}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#03040B]/50 text-gray-400 backdrop-blur-xl">
                      Don&apos;t have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    href="/signup"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Create new account
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
