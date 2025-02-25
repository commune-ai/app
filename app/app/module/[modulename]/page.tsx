'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { WalletConnect } from '@/components/wallet/wallet-connect';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Copy,
  Share2,
  Rocket,
  Code,
  Check,
  ChevronRight,
  MessageCircle,
  AlertTriangle,
  Coins,
  ExternalLink,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeTab } from '@/components/module-tabs/code-tab';
import { ApiTab } from '@/components/module-tabs/api-tab';
import { AppTab } from '@/components/module-tabs/app-tab';
import ModuleDetailSkeleton from '@/components/skeleton/module-detail-skeleton';
import { DiscussionTab } from '@/components/module-tabs/discussion-tab';
import { useModuleDetailStore } from '@/store/use-module-detail-state';
import { ModuleReportDialog } from '@/components/module/module-report-dialog';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import HistoryTab from '@/components/module-tabs/history-tab';

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('code');
  const [copied, setCopied] = useState({ key: false, hash: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isReportingModuleDialogOpen, setIsReportingModuleDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchModuleDetail, moduleDetail } = useModuleDetailStore();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetchModuleDetail(params.modulename as string);
          if (!response.success) {
            setError(response.error ?? null);
          }
        } catch (err) {
          setError(String(err))
        } finally {
          setIsLoading(false);
          hasFetched.current = true;
        }
      };
      fetchData();
    }
  }, [fetchModuleDetail, params]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['code', 'api', 'app', 'discussion','history'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleCopy = async (text: string, type: 'key' | 'hash') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/module/${params.modulename}?tab=${value}`, { scroll: false });
  };

  const dhubVersionTwo=()=>{
    toast.warning("Wait for the next version of dhub to access this feature");
  }

  if (isLoading) {
    return <ModuleDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F0F0F]">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Failed to get Module Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="link"
            className="mt-2 text-white hover:text-gray-500"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0F0F0F] md:pl-20">
      <div className="w-full md:w-20 flex md:flex-col justify-between items-center border-b md:border-b-0 md:border-r border-white/10 bg-[#0F0F0Fs] backdrop-blur-xl backdrop-filter p-4 md:fixed md:h-screen md:left-0">
        <div>
          <div className="text-xl font-bold text-white">
            <span
              onClick={() => router.push('/')}
              className="text-green-400 cursor-pointer"
            >
              dhub
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <WalletConnect onSidebar={true} />
        </div>
      </div>

      <div className="w-full md:w-[400px] border-b md:border-b-0 md:border-r border-white/10 bg-[#0F0F0F] backdrop-blur-xl backdrop-filter p-6">
        <div className="space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => {
                    router.push('/');
                  }}
                  className="text-sm text-gray-400 hover:text-white cursor-pointer"
                >
                  Modules
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-sm text-white cursor-pointer">
                  {moduleDetail[0]?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-white">{moduleDetail[0]?.name}</h1>
            </div>
            <p className="text-gray-400 mb-4">
              {moduleDetail[0]?.description ||
                'This is a description of a module.The module take input from the user and give the output.'}
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#0F0F0F] p-4 space-y-4">
            <div>
              <label className="text-sm text-gray-500 block mb-2">Module Key</label>
              <div className="flex items-center justify-between p-2 rounded bg-[#0F0F0F] border border-white/10">
                <code className="text-sm text-gray-300 font-mono truncate">
                  {moduleDetail[0]?.key}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(moduleDetail[0]?.key, 'key')}
                  className="h-8 w-8 rounded-md hover:bg-[#0F0F0F] transition-all duration-200"
                >
                  {copied.key ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-2">Hash</label>
              <div className="flex items-center justify-between p-2 rounded bg-[#0F0F0F] border border-white/10 gap-2">
                <code className="text-sm text-gray-300 font-mono truncate">
                  {moduleDetail[0]?.ipfs_cid}
                </code>
                <Link href={`https://gateway.lighthouse.storage/ipfs/${moduleDetail[0]?.ipfs_cid}`} target='blank' className='hover:text-green-500'>
                  <ExternalLink className="h-4 w-4 text-green-400" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(moduleDetail[0]?.ipfs_cid, 'hash')}
                  className="h-8 w-8 rounded-md hover:bg-[#30363D] transition-all duration-200"
                >
                  {copied.hash ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button className="w-full bg-green-500 text-white hover:bg-green-600" onClick={()=>{ dhubVersionTwo() }}>
                <Rocket className="mr-2 h-4 w-4" />
                Deploy
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/10 bg-[#0F0F0F] text-white hover:bg-white/10 hover:text-white"
                onClick={()=>{ dhubVersionTwo() }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/10 bg-[#0F0F0F] text-white hover:bg-white/10 hover:text-white"
                onClick={()=>{ dhubVersionTwo() }}
              >
                <Coins className="mr-2 h-4 w-4" />
                Stake on Module
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-white"
                onClick={() => {
                  setIsReportingModuleDialogOpen(true);
                }}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Report on Module
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Tabs */}
      <div className="flex-1 bg-[#0F0F0F] backdrop-blur-xl backdrop-filter">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
          <div className="border-b border-white/10">
            <TabsList className="h-16 w-full justify-start bg-[#0F0F0F]">
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400"
              >
                <Code className="mr-2 h-4 w-4" />
                CODE
              </TabsTrigger>
              <TabsTrigger
                value="api"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400"
              >
                API
              </TabsTrigger>
              <TabsTrigger
                value="app"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400"
              >
                APP
              </TabsTrigger>
              <TabsTrigger
                value="discussion"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                DISCUSSION
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400"
              >
                HISTORY
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="code" className="flex-1 p-0 overflow-auto bg-[#0F0F0F]">
            <CodeTab code={moduleDetail[0]?.code} />
          </TabsContent>

          <TabsContent value="api" className="flex-1 p-6 overflow-auto bg-[#0F0F0F]">
            <ApiTab schema={moduleDetail[0]?.schema} />
          </TabsContent>

          <TabsContent value="app" className="flex-1 p-6 overflow-auto bg-[#0F0F0F]">
            <AppTab id={moduleDetail[0]?.id} url={moduleDetail[0]?.appurl} />
          </TabsContent>

          <TabsContent value="discussion" className="flex-1 p-6 overflow-auto bg-[#0F0F0F]">
            <DiscussionTab moduleName={moduleDetail[0]?.name} />
          </TabsContent>
          <TabsContent value="history" className="flex-1 p-6 overflow-auto bg-[#0F0F0F]">
            <HistoryTab moduleid={moduleDetail[0]?.id} />
          </TabsContent>
        </Tabs>
      </div>
      <ModuleReportDialog
        moduleName={moduleDetail[0]?.name}
        open={isReportingModuleDialogOpen}
        onOpenChange={setIsReportingModuleDialogOpen}
      />
    </div >
  );
}
