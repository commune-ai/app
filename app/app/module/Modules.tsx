'use client'

import { useEffect, useState } from 'react'
import { Footer } from '@/app/components'
import {Client} from '@/app/client'
import { Loading } from '@/app/components/Loading'
import ModuleCard from '@/app/module/ModuleCard'
import {CreateModule} from '@/app/module/CreateModule'
import { ModuleType, DefaultModule } from '@/app/types'
// Helper to abbreviate keys
export default function Modules() {
  const client = new Client()
  const [searchTerm, setSearchTerm] = useState('')
  const [modules, setModules] = useState<ModuleType[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newModule, setNewModule] = useState<ModuleType>(DefaultModule)
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
      
      {showCreateForm && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <CreateModule
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            fetchModules()
            setShowCreateForm(false)
          }}
        />
      </div>
    )}
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
