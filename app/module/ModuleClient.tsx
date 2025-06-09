'use client'

import { useEffect, useState } from 'react'
import { Client } from '@/app/client/client'
import { Loading } from '@/app/components/Loading'
import ModuleCard from '@/app/module/ModuleCard'
import { CreateModule } from '@/app/module/CreateModule'
import { ModuleType } from '@/app/types/module'
import {
  CodeBracketIcon,
  ServerIcon,
  GlobeAltIcon,
  BeakerIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import { ShareIcon } from '@heroicons/react/20/solid'
import { CopyButton } from '@/app/components/CopyButton'
import { ModuleCode } from './ModuleCode'
import ModuleSchema from './ModuleSchema'
import Link from 'next/link'

type TabType = 'code' | 'api'

function shorten(str: string) {
  if (!str || str.length <= 12) return str
  return `${str.slice(0, 8)}...${str.slice(-4)}`
}

function time2str(time: number) {
  const d = new Date(time * 1000)
  return d.toLocaleString()
}


export default function ModulesClient({ module_name, code, api }: { module_name : string; code : boolean, api : boolean }) {
  const client = new Client()
  const [searchTerm, setSearchTerm] = useState('')
  const [module, setModule] = useState<ModuleType>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [codeMap, setCodeMap] = useState<Record<string, string>>({})
  const initialTab = code ? 'code' : api ? 'api' : 'code'
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const foundModule = await client.call('get_module', {
          module: module_name,
        })
        if (foundModule) {
          setModule(foundModule)
          if (foundModule.code && typeof foundModule.code === 'object') {
            setCodeMap(foundModule.code as Record<string, string>)
          }
        } else {
          setError(`Module ${module} not found`)
        }
      } catch (err) {
        setError('Failed to fetch module')
      } finally {
        setLoading(false)
      }
    }
    fetchModule()
  }, [])

  const filteredFiles = Object.entries(codeMap).filter(
    ([path, content]) =>
      path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <Loading />
  if (error || !module)
    return (
      <div className='flex min-h-screen items-center justify-center bg-black text-red-500'>
        {error}
      </div>
    )

  const tabs = [
      { id: 'code', label: 'CODE', icon: CodeBracketIcon },
      { id: 'api', label: 'SCHEMA', icon: ServerIcon },
    ]

  
  return (
    <div className='min-h-screen bg-gradient-to-b from-black to-gray-950 p-6 font-mono text-green-400'>
      <div className='mx-auto max-w-7xl space-y-6'>
        {/* Header Card */}
        <div className='overflow-hidden rounded-2xl border border-green-500/30 bg-black/90 shadow-xl backdrop-blur-sm'>
          {/* Module Title Section */}
          <div className='space-y-6 border-b border-green-500/30 p-8'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <BeakerIcon className='h-8 w-8 text-green-400' />
                <div>
                  <h1 className='text-3xl font-bold text-green-400'>
                    {module.name}
                  </h1>
                  <p className='mt-1 text-gray-400'>
                    {module.network || 'commune'}
                  </p>
                </div>
              </div>
              <div className='group flex space-x-4'>
                <button
                  title='deploy'
                  className='flex items-center space-x-2 rounded-lg border border-green-500/30 bg-green-900/20 p-2 text-green-400 transition-all hover:bg-green-900/40 md:px-6 md:py-3'
                >
                  <GlobeAltIcon className='h-5 w-5' />
                  <span className='hidden md:inline'>Deploy</span>
                </button>
                <button
                  title='Share'
                  className='flex items-center space-x-2 rounded-lg border border-green-500/30 bg-green-900/20 p-2 text-green-400 transition-all hover:bg-green-900/40 md:px-6 md:py-3'
                >
                  <ShareIcon className='h-5 w-5' />
                  <span className='hidden md:inline'>Share</span>
                </button>
              </div>
            </div>

            {/* Module Description */}
            <p className='max-w-3xl text-gray-400'>
              {module.desc || 'No description available'}
            </p>

            {/* Tags */}
            {module.tags && module.tags.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {module.tags.map((tag, index) => (
                  <span
                    key={index}
                    className='rounded-full border border-green-500/30 bg-green-900/20 px-3 py-1 text-sm text-green-400'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Info Grid */}
            <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {[
                { label: 'key', value: module.key || 'N/A' },
                { label: 'cid', value: module.cid || 'N/A' },
                { label: 'created ', value: time2str(module.time) },
              ].map((item, index) => (
                <div
                  key={index}
                  className='rounded-xl border border-green-500/30 bg-black/60 p-4 backdrop-blur-sm'
                >
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='text-gray-400'>{item.label}</span>
                    <CopyButton code={item.value} />
                  </div>
                  <div className='truncate font-mono text-sm text-green-400'>
                    {shorten(item.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className='flex border-b border-green-500/30'>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as TabType)}
                className={`flex items-center space-x-2 px-8 py-4 transition-all
                  ${
                    activeTab === id
                      ? 'border-b-2 border-green-400 bg-green-900/20 text-green-400'
                      : 'text-gray-400 hover:bg-green-900/10 hover:text-green-400'
                  }`}
              >
                <Icon className='h-5 w-5' />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className='p-8'>
            {activeTab === 'code' && (
              <div className='space-y-6'>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Search in files...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full rounded-xl border border-green-500/30 bg-black/90 
                             px-6 py-4 text-green-400
                             placeholder-gray-500 transition-all
                             focus:border-green-400 focus:outline-none'
                  />
                </div>
                {filteredFiles.map(([path, content]) => (
                  <ModuleCode key={path} code={content} path={path} />
                ))}
              </div>
            )}

            {activeTab === 'api' && (
              <ModuleSchema mod={module} />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className='flex flex-wrap items-center justify-between gap-2 sm:gap-4'>
          <Link
            href={"/"}
            className='flex w-full items-center justify-center space-x-2 rounded-xl border 
               border-green-500/30 bg-black/90 px-6 py-3 text-center
               text-green-400 transition-all hover:bg-green-900/20 sm:w-auto'
          >
            <ArrowLeftIcon className='h-5 w-5' />
            <span>Back to Modules</span>
          </Link>

          <div className='flex w-full flex-wrap justify-center gap-2 sm:w-auto sm:justify-end sm:gap-4'>
            <button
              className='w-full rounded-xl border border-green-500/30 bg-black/90 px-6 
                        py-3 text-center text-green-400 transition-all hover:bg-green-900/20 sm:w-auto'
            >
              Documentation
            </button>
            <button
              className='w-full rounded-xl border border-green-500/30 bg-black/90 px-6 
                        py-3 text-center text-green-400 transition-all hover:bg-green-900/20 sm:w-auto'
            >
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
