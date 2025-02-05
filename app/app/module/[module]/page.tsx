// ModulePage.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Client } from '@/app/client'
import { Footer } from '@/app/components'
import { Loading } from '@/app/components/Loading'
import { CodePage } from './CodePage'
import { ModuleType } from '@/app/types'
import { CopyButton } from '@/app/components/CopyButton'

type TabType = 'code'|'api'

// Helper to shorten long strings
function shorten(str: string) {
  if (!str || str.length <= 12) return str
  return `${str.slice(0, 8)}...${str.slice(-4)}`
}

function time2str(time: number) {
  const d = new Date(time * 1000)
  return d.toLocaleString()
}

export default function ModulePage({params}:{params:{module:string}}) {
  const router = useRouter()
  const [module,setModule] = useState<ModuleType>()
  const [activeTab,setActiveTab] = useState<TabType>('code')
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState('')
  const [searchTerm,setSearchTerm] = useState('')
  const [codeMap,setCodeMap] = useState<Record<string,string>>({})
  const client = new Client()

  useEffect(()=>{
    const fetchModule=async()=>{
      try{
        const foundModule=await client.call('get_module',{module:params.module})
        if(foundModule){
          setModule(foundModule)
          if(foundModule.code&&typeof foundModule.code==='object'){
            setCodeMap(foundModule.code as Record<string,string>)
          }
        }else{
          setError(`Module ${params.module} not found`)
        }
      }catch(err){
        setError('Failed to fetch module')
      }finally{
        setLoading(false)
      }
    }
    fetchModule()
  },[])

  const filteredFiles=Object.entries(codeMap).filter(([path,content])=>
    path.toLowerCase().includes(searchTerm.toLowerCase())||
    content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if(loading)return<Loading/>
  if(error||!module)return<div className="min-h-screen flex items-center justify-center bg-black text-red-500">{error}</div>

  const tabs=[
    {id:'code',label:'CODE'},
    {id:'api',label:'API'},
  ]

  const moduleInfo = `owner: ${module.owner || 'N/A'} | key: ${module.key} | hash: ${module.hash || 'N/A'} | time: ${time2str(module.time)}`

  
  
  return (
    <div className="min-h-screen  from-black to-gray-900 text-green-400 p-6 font-mono">
      <div className="max-w-7xl mx-auto">
        {/* Module Header */}
        <div className="bg-black/90 border border-green-500/30 rounded-lg shadow-lg mb-6">
          <div className="p-6 border-b border-green-500/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-2xl text-yellow-500">$ {module.name}</span>
                <span className="text-sm text-gray-400">{module.network || 'commune'}</span>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-md hover:bg-green-900/40 transition">
                  Deploy
                </button>
                <button className="px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-md hover:bg-green-900/40 transition">
                  Share
                </button>
              </div>
            </div>

            {/* Module Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Key Card */}
              <div className="p-4 bg-black/60 rounded-lg border border-green-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Key</span>
                  <CopyButton code={module.key} />
                </div>
                <div className="font-mono text-sm truncate">{shorten(module.key)}</div>
              </div>

              {/* Hash Card */}
              <div className="p-4 bg-black/60 rounded-lg border border-green-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Hash</span>
                  <CopyButton code={module.hash || 'N/A'} />
                </div>
                <div className="font-mono text-sm truncate">{shorten(module.hash || 'N/A')}</div>
              </div>

              {/* Time Card */}
              <div className="p-4 bg-black/60 rounded-lg border border-green-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Created</span>
                </div>
                <div className="font-mono text-sm">{time2str(module.time)}</div>
              </div>

              {/* Owner Card */}
              <div className="p-4 bg-black/60 rounded-lg border border-green-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Owner</span>
                </div>
                <div className="font-mono text-sm truncate">{module.owner || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-green-500/30">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-6 py-3 text-sm transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-green-900/20 text-green-400 border-b-2 border-green-400' 
                    : 'text-gray-400 hover:text-green-400 hover:bg-green-900/10'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'code' && (
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search in files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-black/90 text-green-400 
                             border border-green-500/30 rounded-lg
                             focus:outline-none focus:border-green-400
                             transition-colors"
                  />
                </div>
                {filteredFiles.map(([path, content]) => (
                  <CodePage key={path} code={content} path={path} />
                ))}
              </div>
            )}
            {/* ... (rest of the content areas remain the same) */}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-black/90 text-green-400 
                     border border-green-500/30 rounded-lg
                     hover:bg-green-900/20 transition-all"
          >
            ← Back to Modules
          </button>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-black/90 text-green-400 
                           border border-green-500/30 rounded-lg
                           hover:bg-green-900/20 transition-all">
              View Documentation
            </button>
            <button className="px-6 py-3 bg-black/90 text-green-400 
                           border border-green-500/30 rounded-lg
                           hover:bg-green-900/20 transition-all">
              Report Issue
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}