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
  Clock,
  User,
  ChevronRight,
  MessageCircle,
  AlertTriangle,
  Coins,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeTab } from '@/components/module-tabs/code-tab';
import { ApiTab } from '@/components/module-tabs/api-tab';
import { AppTab } from '@/components/module-tabs/app-tab';
import ModuleDetailSkeleton from '@/components/skeleton/module-detail-skeleton';
import { DiscussionTab } from '@/components/module-tabs/discussion-tab';
import { useModuleDetailStore } from '@/store/use-module-detail-state';
import { ModuleReportDialog } from '@/components/module/module-report-dialog';

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('code');
  const [copied, setCopied] = useState({ key: false, hash: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isReportingModuleDialogOpen, setIsReportingModuleDialogOpen] = useState(false);

  const { fetchModuleDetail, moduleDetail } = useModuleDetailStore();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          await fetchModuleDetail(params.modulename as string);
        } catch (err) {
          console.error(err);
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
    if (tab && ['code', 'api', 'app', 'discussion'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const moduleData = {
    name: 'DeepSeek AI',
    description: 'A powerful AI model for natural language processing and understanding.',
    key: 'module_key_123456789',
    hash: '0xabc123def456...',
    timeCreated: '2024-02-08 14:30:00',
    owner: 'Founder123',
    status: 'Active',
    version: '1.0.0',
    upvotes: 125,
    downvotes: 23,
  };

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

  if (isLoading) {
    return <ModuleDetailSkeleton />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#03040B] md:pl-20">
      {/* Left Sidebar */}
      <div className="w-full md:w-20 flex md:flex-col justify-between items-center border-b md:border-b-0 md:border-r border-white/10 bg-white/5 backdrop-blur-xl backdrop-filter p-4 md:fixed md:h-screen md:left-0">
        <div>
          <span className="text-xl font-bold text-white">
            <span className="text-blue-400">dhub</span>
          </span>
        </div>
        <div className="flex items-center justify-center">
          <WalletConnect onSidebar={true}/>
        </div>
      </div>

      {/* Middle Column - Module Details */}
      <div className="w-full md:w-[400px] border-b md:border-b-0 md:border-r border-white/10 bg-white/5 backdrop-blur-xl backdrop-filter p-6">
        <div className="space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => {
                    router.push('/');
                  }}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Modules
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-sm text-white">
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
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                v1.0.0
              </span>
              <span className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                {moduleData.owner}
              </span>
              <span className="flex items-center">
                <ThumbsUp className="mr-1 h-4 w-4 text-green-400" />
                {moduleData.upvotes}
              </span>
              <span className="flex items-center">
                <ThumbsDown className="mr-1 h-4 w-4 text-red-400" />
                {moduleData.downvotes}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#0D1117] p-4 space-y-4">
            <div>
              <label className="text-sm text-gray-500 block mb-2">Module Key</label>
              <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                <code className="text-sm text-gray-300 font-mono truncate">
                  {moduleDetail[0]?.key}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(moduleData.key, 'key')}
                  className="h-8 w-8 rounded-md hover:bg-[#30363D] transition-all duration-200"
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
              <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                <code className="text-sm text-gray-300 font-mono truncate">
                  {moduleDetail[0]?.hash}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(moduleData.hash, 'hash')}
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
              <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                <Rocket className="mr-2 h-4 w-4" />
                Deploy
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Coins className="mr-2 h-4 w-4" />
                Stake on Module
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
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
      <div className="flex-1 bg-[#0D1117] backdrop-blur-xl backdrop-filter">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
          <div className="border-b border-white/10">
            <TabsList className="h-16 w-full justify-start bg-transparent">
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400"
              >
                <Code className="mr-2 h-4 w-4" />
                CODE
              </TabsTrigger>
              <TabsTrigger
                value="api"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400"
              >
                API
              </TabsTrigger>
              <TabsTrigger
                value="app"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400"
              >
                APP
              </TabsTrigger>
              <TabsTrigger
                value="discussion"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                DISCUSSION
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="code" className="flex-1 p-0 overflow-auto">
            <CodeTab code={moduleDetail[0]?.code} />
          </TabsContent>

          <TabsContent value="api" className="flex-1 p-6 overflow-auto">
            <ApiTab schema={moduleDetail[0]?.schema} />
          </TabsContent>

          <TabsContent value="app" className="flex-1 p-6 overflow-auto">
            <AppTab />
          </TabsContent>

          <TabsContent value="discussion" className="flex-1 p-6 overflow-auto">
            <DiscussionTab moduleName={moduleDetail[0]?.name} />
          </TabsContent>
        </Tabs>
      </div>
      <ModuleReportDialog
        moduleName={moduleDetail[0]?.name}
        open={isReportingModuleDialogOpen}
        onOpenChange={setIsReportingModuleDialogOpen}
      />
    </div>
  );
}
