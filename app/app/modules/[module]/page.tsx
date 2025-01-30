'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Client from '@/app/client';
import { Footer } from '@/app/components';

type ModuleType = {
  name: string;
  key: string;
  github: string;
  address: string;
  description: string;
  key_type: string;
  hash: string;
  network: string;
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 text-sm bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
    >
      {copied ? '✓ Copied' : `Copy ${label}`}
    </button>
  );
}

function InfoCard({ title, value, copyable = true }: { title: string; value: string; copyable?: boolean }) {
  return (
    <div className="bg-black/40 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <div className="bg-black/60 rounded-lg p-3 flex justify-between items-center">
        <span className="text-white overflow-hidden text-ellipsis">{value}</span>
        {copyable && <CopyButton text={value} label={title} />}
      </div>
    </div>
  );
}

export default function ModulePage({ key }: { key: string }) {
  const router = useRouter();
  const [module, setModule] = useState<ModuleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const client = new Client();

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const modules = await client.call('modules');
        const foundModule = modules.find((m: ModuleType) => m.key === key);
        if (foundModule) {
          setModule(foundModule);
        } else {
          const msg = `Module with key ${key} not found`;
          setError(msg);
        }
      } catch (error) {
        setError('Failed to fetch module');
        console.error('Failed to fetch module:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [key]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-8 text-white hover:text-gray-300 flex items-center gap-2"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        <div className="bg-gray-800/90 rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-3xl">🔮</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{module.name}</h1>
              <p className="text-white/60">{module.key_type}</p>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
            <p className="text-white/70">{module.description || 'No description available'}</p>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <InfoCard title="Hash" value={module.hash} />
            <InfoCard title="Key" value={module.key} />
            <InfoCard title="Address" value={module.address} />
            <InfoCard title="Network" value={module.network} />
            <InfoCard title="GitHub" value={module.github} />
          </div>

          {/* Preview Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Preview</h2>
            <div className="relative aspect-video">
              <iframe
                src={`http://${module.address}/docs`}
                className="w-full h-[600px] rounded-xl border border-white/20"
                title={`${module.name} preview`}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
