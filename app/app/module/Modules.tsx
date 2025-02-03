'use client'

import { useEffect, useState } from 'react'
import { Footer } from '@/app/components'
import {Client} from '@/app/client'
import { Loading } from '@/app/components/Loading'
import ModuleCard from '@/app/module/ModuleCard'
import { useRouter } from 'next/navigation'

type ModuleType = {
  name: string
  key: string
  url: string
  description: string
  network: string
}

const defaultModule: ModuleType = {
  name: 'agi',
  key: 'agi',
  url: 'agi.com',
  description: 'agi module',
  network: 'eth',
}

// Helper to abbreviate keys
function abbreviateKey(key: string) {
  if (key.length <= 12) return key
  return `${key.slice(0, 8)}...${key.slice(-4)}`
}

export default function Modules() {
  const client = new Client()
  const [searchTerm, setSearchTerm] = useState('')
  const [modules, setModules] = useState<ModuleType[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newModule, setNewModule] = useState<ModuleType>(defaultModule)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchModules = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await client.call('modules')
      if (!Array.isArray(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data)}`)
      }
      setModules(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch modules')
      setModules([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    try {
      const { name, key, url, description, network } = newModule
      if (!name || !key) {
        throw new Error('Name and Key are required')
      }
      const params = { name, key, url, description, network }
      await client.call('add_module', params)
      setNewModule(defaultModule)
      setShowCreateForm(false)
      await fetchModules()
    } catch (err: any) {
      setError(err.message || 'Failed to create module')
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (field: string, value: string) => {
    setNewModule((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const filteredModules = modules.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    fetchModules()
  }, [])

  return (
    <div className="flex flex-col items-center py-10 min-h-screen bg-black font-mono text-gray-200">
      {error && (
        <div className="mb-4 w-full max-w-md px-4 py-2 bg-red-500/80 text-white rounded-lg flex justify-between items-center shadow-lg">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-4">
            ✕
          </button>
        </div>
      )}

    <div className="flex gap-4 items-center w-full max-w-3xl px-6 mb-12">
      <div className="flex-1 relative border border-green-500/30 bg-black/90 rounded-lg">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400">
          <span className="font-mono">$</span>
        </div>
        <input
          type="text"
          placeholder="search modules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-transparent text-green-400 
                    focus:outline-none font-mono placeholder-gray-500"
          disabled={loading}
        />
      </div>
      
      <button
        onClick={fetchModules}
        disabled={loading}
        className="px-4 py-2 bg-black/90 text-green-400 rounded-lg 
                  border border-green-500/30 hover:border-green-400 
                  hover:bg-green-900/20 transition-all font-mono"
      >
        $ refresh
      </button>
      
      <button
        onClick={() => setShowCreateForm(true)}
        disabled={loading}
        className="px-4 py-2 bg-black/90 text-green-400 rounded-lg 
                  border border-green-500/30 hover:border-green-400 
                  hover:bg-green-900/20 transition-all font-mono"
      >
        $ new
      </button>
    </div>
    {showCreateForm && (
  <div className="w-full max-w-lg mb-8 p-6 bg-black/90 rounded-lg 
                  border border-green-500/30 font-mono">
    <div className="flex items-center mb-6">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
      </div>
      <span className="ml-4 text-yellow-500">$ new_module</span>
    </div>

    <div className="space-y-4">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400">$</span>
        <input
          placeholder="module_key"
          value={newModule.key}
          onChange={(e) => handleFormChange('key', e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-black/90 text-green-400 
                    border border-green-500/30 rounded-lg
                    focus:border-green-400 focus:outline-none 
                    placeholder-gray-500"
          disabled={loading}
        />
      </div>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400">$</span>
        <input
          placeholder="module_url"
          value={newModule.url}
          onChange={(e) => handleFormChange('url', e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-black/90 text-green-400 
                    border border-green-500/30 rounded-lg
                    focus:border-green-400 focus:outline-none 
                    placeholder-gray-500"
          disabled={loading}
        />
      </div>
    </div>

    <div className="flex justify-end gap-4 mt-6">
      <button
        onClick={() => {
          setShowCreateForm(false)
          setNewModule(defaultModule)
        }}
        disabled={loading}
        className="px-4 py-2 bg-black/90 text-green-400 
                  border border-green-500/30 rounded-lg
                  hover:border-green-400 hover:bg-green-900/20 
                  transition-all disabled:opacity-50"
      >
        [ESC] Cancel
      </button>
      <button
        onClick={handleCreate}
        disabled={loading}
        className="px-4 py-2 bg-black/90 text-green-400 
                  border border-green-500/30 rounded-lg
                  hover:border-green-400 hover:bg-green-900/20 
                  transition-all disabled:opacity-50"
      >
        {loading ? 'Creating...' : '[ENTER] Create'}
      </button>
    </div>
  </div>
)}

      {/* Actual modules listing */}
      <div className="w-full max-w-[1600px] px-4 max-h-[70vh] overflow-y-auto">
        {loading && <Loading />}
        {!loading && filteredModules.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            {searchTerm ? 'No modules found.' : 'No modules available.'}
          </div>
        )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModules.map((m) => (
              <ModuleCard key={m.key} module={m} />
            ))}
          </div>


      </div>

      <Footer />
    </div>
  )
}
