'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Client } from '@/app/client'
import { Footer } from '@/app/components'
import { Loading } from '@/app/components/Loading'
import { CodeViewer } from '@/app/components/CodeViewer'
import { ModuleType } from '@/app/types'

type TabType = 'desc' | 'app' | 'api' | 'code' | 'history'

function obj2str(obj: any) {
  return JSON.stringify(obj, null, 2)
}

export default function ModulePage({ params }: { params: { module: string } }) {
  const router = useRouter()
  const [module, setModule] = useState<ModuleType | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [codeMap, setCodeMap] = useState<Record<string, string>>({})

  const client = new Client()

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const foundModule = await client.call('get_module', { module: params.module })
        if (foundModule) {
          setModule(foundModule)
          // Handle code map if it exists
          if (foundModule.code && typeof foundModule.code === 'object') {
            setCodeMap(foundModule.code as Record<string, string>)
          }
        } else {
          setError(`Module ${params.module} not found`)
        }
      } catch (err) {
        setError('Failed to fetch module')
      } finally {
        setLoading(false)
      }
    }
    fetchModule()
  }, [params.module]) // Add dependency

  const filteredFiles = Object.entries(codeMap).filter(([path, content]) =>
    path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <Loading />
  if (error || !module) return <div className="min-h-screen flex items-center justify-center bg-black text-red-500">{error}</div>

  const tabs = [
    { id: 'desc', label: 'DESC' },
    { id: 'app', label: 'APP' },
    { id: 'api', label: 'API' },
    { id: 'code', label: 'CODE' },
    { id: 'history', label: 'HISTORY' }
  ]

  return (
    <div className="min-h-screen bg-black text-green-400 p-4 font-mono">
      <div className="max-w-4xl mx-auto border border-green-500/30 rounded">
        {/* Terminal Header */}
        <div className="bg-black border-b border-green-500/30 p-2 flex items-center">
          <span className="text-yellow-500">$ {module.name}</span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-green-500/30">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2 text-xs border-r border-green-500/30
                ${activeTab === tab.id ? 'bg-green-900/20' : 'hover:bg-green-900/10'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <pre className="text-sm">
{`
founder:  ${module.founder || 'N/A'}
key:      ${module.key}
hash:     ${module.hash || 'N/A'}
network:  ${module.network || 'N/A'}
url:      ${module.url || 'N/A'}
desc:     ${module.desc || 'N/A'}`}
              </pre>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-black/90 text-green-400 border 
                           border-green-500/30 rounded focus:outline-none"
                />
              </div>

              {/* Code files */}
              {filteredFiles.map(([path, content]) => (
                <CodeViewer
                  key={path}
                  code={content}
                  path={path}
                />
              ))}
            </div>
          )}

          {activeTab === 'api' && (
            <pre className="text-sm bg-black/40 p-4 rounded">
              {module.schema ? obj2str(module.schema) : 'No API schema available'}
            </pre>
          )}

          {activeTab === 'history' && (
            <pre className="text-sm bg-black/40 p-4 rounded">
              {module.history || 'No history available'}
            </pre>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="max-w-4xl mx-auto mt-4 flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-xs border border-green-500/30 hover:bg-green-900/20"
        >
          [ESC] BACK
        </button>
      </div>
      <Footer />
    </div>
  )
}