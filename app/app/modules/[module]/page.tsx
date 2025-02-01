'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Client from '@/app/client'
import { Footer } from '@/app/components'
import { Loading } from '@/app/components/Loading'

type ModuleType = {
  name: string
  key: string
  github: string
  url: string
  description: string
  key_type: string
  hash: string
  network: string
}

type Props = {
  params: {
    module: string
  }
}

function CopyButton({
  text,
  label,
}: {
  text: string
  label: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 text-xs bg-gray-700/50 hover:bg-gray-600 rounded-lg transition-colors"
    >
      {copied ? '✓ Copied' : `Copy ${label}`}
    </button>
  )
}

function InfoCard({
  title,
  value,
  copyable = true,
}: {
  title: string
  value: string
  copyable?: boolean
}) {
  return (
    <div className="bg-black/40 rounded-xl p-4 border border-green-500/20">
      <h3 className="text-white font-semibold mb-2 text-sm">{title}</h3>
      <div className="bg-black/60 rounded-lg p-3 flex justify-between items-center">
        <span className="text-white text-xs overflow-hidden text-ellipsis">
          {value}
        </span>
        {copyable && <CopyButton text={value} label={title} />}
      </div>
    </div>
  )
}

export default function ModuleDetailPage({ params }: Props) {
  const router = useRouter()
  const [module, setModule] = useState<ModuleType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const client = new Client()

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const modules = await client.call('modules')
        const foundModule = modules.find((m: ModuleType) => m.key === params.module)
        if (foundModule) {
          setModule(foundModule)
        } else {
          setError(`Module with key = ${params.module} not found`)
        }
      } catch (err) {
        setError('Failed to fetch module')
        console.error('Failed to fetch module:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchModule()
  }, [params.module])

  if (loading) {
    return <Loading />
  }

  if (error || !module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 md:p-8 font-mono">
      <button
        onClick={() => router.back()}
        className="mb-4 text-green-300 hover:text-green-400 flex items-center gap-2"
      >
        <span className="text-xs">←</span>
        <span>Back</span>
      </button>

      <div className="bg-gray-800/90 rounded-2xl p-8 shadow-2xl border border-green-500/30">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
            <span className="text-2xl">🔮</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{module.name}</h1>
            <p className="text-green-400 text-sm">{module.key_type}</p>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-green-300 mb-2">
            Description
          </h2>
          <p className="text-sm text-white/70">
            {module.description || 'No description available'}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <InfoCard title="key" value={module.key} />
          <InfoCard title="url" value={module.url} />
          <InfoCard title="network" value={module.network} />
          <InfoCard title="code" value={module.github || 'n/a'} />
        </div>

        {/* Preview Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
          <div className="relative aspect-video">
            <iframe
              src={`http://${module.url}/docs`}
              className="w-full h-[600px] rounded-xl border border-green-500/20"
              title={`${module.name} preview`}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
