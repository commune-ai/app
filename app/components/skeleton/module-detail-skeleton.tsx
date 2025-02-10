import { Skeleton } from "@/components/ui/skeleton"
import { WalletConnect } from "@/components/wallet/wallet-connect"
import { Card, CardContent } from "@/components/ui/card"
export default function ModuleDetailSkeleton() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#03040B]">
      {/* Left Sidebar */}
      <div className="w-full md:w-16 flex md:flex-col justify-between items-center border-b md:border-b-0 md:border-r border-white/10 bg-white/5 backdrop-blur-xl backdrop-filter p-4">
        <div>
          <span className="text-xl font-bold text-white">
            <span className="text-blue-400">dhub</span>
          </span>
        </div>
        <div className="flex items-center justify-center">
          <WalletConnect />
        </div>
      </div>

      {/* Middle Column - Agent Details */}
      <div className="w-full md:w-[400px] border-b md:border-b-0 md:border-r border-white/10 bg-white/5 backdrop-blur-xl backdrop-filter p-6">
        <div className="space-y-6">
          <Skeleton className="h-4 w-32 bg-white/5" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48 bg-white/5" />
              <Skeleton className="h-6 w-16 bg-white/5 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-3/4 bg-white/5" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-20 bg-white/5" />
              <Skeleton className="h-4 w-20 bg-white/5" />
              <Skeleton className="h-4 w-16 bg-white/5" />
              <Skeleton className="h-4 w-16 bg-white/5" />
            </div>
          </div>
          <Card className="border-white/10 bg-white/5">
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-white/10" />
                <Skeleton className="h-8 w-full bg-white/10" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-white/10" />
                <Skeleton className="h-8 w-full bg-white/10" />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/5" />
          </div>
        </div>
      </div>

      {/* Right Column - Tabs */}
      <div className="flex-1 bg-[#0D1117] backdrop-blur-xl backdrop-filter">
        <div className="h-16 border-b border-white/10">
          <div className="flex gap-2 p-4">
            <Skeleton className="h-8 w-20 bg-white/5" />
            <Skeleton className="h-8 w-20 bg-white/5" />
            <Skeleton className="h-8 w-20 bg-white/5" />
            <Skeleton className="h-8 w-20 bg-white/5" />
          </div>
        </div>
        <div className="p-6">
          <Skeleton className="h-[calc(100vh-theme(spacing.32))] w-full bg-white/5" />
        </div>
      </div>
    </div>
  )
}
