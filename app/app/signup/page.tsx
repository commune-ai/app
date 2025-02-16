"use client";

import { useRouter } from "next/navigation";
import { SimpleHubNavbar } from "@/components/navbar/hub-navbar-simple";
import { Footer } from "@/components/footer/hub-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, AlertTriangle, Check, ChevronLeft, Loader } from "lucide-react";
import { useSignupStore } from "@/store/use-signup-state";
import { useEffect } from "react";
import { useWalletStore } from "@/store/use-wallet-state";

export default function SignUp() {
  const {
    copied,
    confirmed,
    walletLoading,
    getMnemonicWords,
    generateMnemonic,
    handleCopyMnemonic,
    handleSignUp,
  } = useSignupStore();
  const { walletConnected } = useWalletStore();
  const router = useRouter();

  useEffect(() => {
    generateMnemonic();
  }, [generateMnemonic]);

  useEffect(() => {
    if (walletConnected) {
      router.push("/");
    }
  }, [walletConnected, router]);

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
              Your 24-word mnemonic has been generated. Please save it securely.
            </p>
          </div>

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
        </div>
      </main>
      <Footer />
    </div>
  );
}
