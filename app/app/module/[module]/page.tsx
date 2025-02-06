'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Client } from '@/app/client'
import { Footer } from '@/app/components'
import { Loading } from '@/app/components/Loading'
import { ModuleCode } from './ModuleCode'
import { ModuleApi } from './ModuleApi'
import { ModuleType } from '@/app/types'
import { CopyButton } from '@/app/components/CopyButton'
import { 
  CodeBracketIcon, 
  ServerIcon, 
  GlobeAltIcon,
  BeakerIcon,
  DocumentDuplicateIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

type TabType = 'code'|'api'

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

  useEffect(() => {
    const fetchModule = async() => {
      try {
        const foundModule = await client.call('get_module',{module:params.module})
        if(foundModule) {
          setModule(foundModule)
          if(foundModule.code && typeof foundModule.code === 'object') {
            setCodeMap(foundModule.code as Record<string,string>)
          }
        } else {
          setError(`Module ${params.module} not found`)
        }
      } catch(err) {
        setError('Failed to fetch module')
      } finally {
        setLoading(false)
      }
    }
    fetchModule()
  },[])

  const filteredFiles = Object.entries(codeMap).filter(([path, content]) =>
    path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if(loading) return <Loading/>
  if(error || !module) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
      {error}
    </div>
  )

  const tabs = [
    {id:'code', label:'CODE', icon: CodeBracketIcon},
    {id:'api', label:'API', icon: ServerIcon},
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-green-400 p-6 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-black/90 border border-green-500/30 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Module Title Section */}
          <div className="p-8 border-b border-green-500/30 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <BeakerIcon className="h-8 w-8 text-green-400" />
                <div>
                  <h1 className="text-3xl font-bold text-green-400">{module.name}</h1>
                  <p className="text-gray-400 mt-1">{module.network || 'commune'}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-6 py-3 bg-green-900/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-900/40 transition-all">
                  <GlobeAltIcon className="h-5 w-5" />
                  <span>Deploy</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-green-900/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-900/40 transition-all">
                  <DocumentDuplicateIcon className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Module Description */}
            <p className="text-gray-400 max-w-3xl">
              {module.desc || 'No description available'}
            </p>

            {/* Tags */}
            {module.tags && module.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {module.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 text-sm bg-green-900/20 text-green-400 rounded-full border border-green-500/30">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {[
                {label: 'Key', value: module.key},
                {label: 'Hash', value: module.hash || 'N/A'},
                {label: 'Created', value: time2str(module.time)},
                {label: 'Owner', value: module.owner || 'N/A'}
              ].map((item, index) => (
                <div key={index} className="p-4 bg-black/60 rounded-xl border border-green-500/30 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">{item.label}</span>
                    <CopyButton code={item.value} />
                  </div>
                  <div className="font-mono text-sm truncate text-green-400">
                    {shorten(item.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-green-500/30">
            {tabs.map(({id, label, icon: Icon}) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as TabType)}
                className={`flex items-center space-x-2 px-8 py-4 transition-all
                  ${activeTab === id 
                    ? 'bg-green-900/20 text-green-400 border-b-2 border-green-400' 
                    : 'text-gray-400 hover:text-green-400 hover:bg-green-900/10'}`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="p-8">
            {activeTab === 'code' && (
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search in files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 bg-black/90 text-green-400 
                             border border-green-500/30 rounded-xl
                             focus:outline-none focus:border-green-400
                             transition-all placeholder-gray-500"
                  />
                </div>
                {filteredFiles.map(([path, content]) => (
                  <ModuleCode key={path} code={content} path={path} />
                ))}
              </div>
            )}

            {activeTab === 'api' && (
              <ModuleApi schema={module.schema} module={module.name} />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 px-6 py-3 bg-black/90 text-green-400 
                     border border-green-500/30 rounded-xl
                     hover:bg-green-900/20 transition-all"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Modules</span>
          </button>
          
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-black/90 text-green-400 
                           border border-green-500/30 rounded-xl
                           hover:bg-green-900/20 transition-all">
              Documentation
            </button>
            <button className="px-6 py-3 bg-black/90 text-green-400 
                           border border-green-500/30 rounded-xl
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