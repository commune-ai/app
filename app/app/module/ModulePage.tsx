'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {Client} from '@/app/client'
import { Footer } from '@/app/components'
import { Loading } from '@/app/components/Loading'
import { ModuleType } from '@/app/types'
type TabType = 'desc' | 'app' | 'api' | 'code' | 'history'


function obj2str(obj: any) {
  return JSON.stringify(obj, null, 2)
}

export default function ModulePage({ params }: { params: { module: string } }) {
  const router = useRouter()
  const [module, setModule] = useState<ModuleType>()
  const [activeTab, setActiveTab] = useState<TabType>('desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const client = new Client()

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const foundModule = await client.call('get_module', { module: params.module })
        if (foundModule) {
          setModule(foundModule)
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
  }, [params.module])

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

          {activeTab === 'app' && (
            <div className="text-sm">
              <p>Application interface coming soon...</p>
            </div>
          )}
          {activeTab === 'api' && (
            <pre className="text-sm bg-black/40 p-4 rounded">
{obj2str(module.schema)}
      
            </pre>
          )}

          {activeTab === 'code' && (
            <pre className="text-sm bg-black/40 p-4 rounded">
{`
${module.code || 'Not available'}

# Implementation details will be 
# displayed here...`}
            </pre>
          )}

  
          {activeTab === 'history' && (
            <pre className="text-sm bg-black/40 p-4 rounded">
{`
${module.history || 'Not available'}

# Implementation details will be 
# displayed here...`}
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