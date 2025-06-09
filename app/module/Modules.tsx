'use client'

import { useEffect, useState } from 'react'
import { Footer } from '@/app/components'
import { Client } from '@/app/client/client'
import { Loading } from '@/app/components/Loading'
import ModuleCard from '@/app/module/ModuleCard'
import { CreateModule } from '@/app/module/CreateModule'
import { ModuleType, DefaultModule } from '@/app/types/module'
// Helper to abbreviate keys
export default function Modules() {
  const client = new Client()
  const [searchTerm, setSearchTerm] = useState('')
  const [modules, setModules] = useState<ModuleType[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchModules = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await client.call('modules', {"search": searchTerm, "page_size": 20})
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
    <div className='flex min-h-screen flex-col items-center bg-black py-10 font-mono text-gray-200'>
      {error && (
        <div className='mb-4 flex w-full max-w-md items-center justify-between rounded-lg bg-red-500/80 px-4 py-2 text-white shadow-lg'>
          <span>{error}</span>
          <button onClick={() => setError('')} className='ml-4'>
            ✕
          </button>
        </div>
      )}

      <div className='mb-12 flex w-full max-w-3xl flex-col items-center gap-2 px-6 sm:flex-row sm:gap-4'>
        {/* Search Input (Full Width on Mobile) */}
        <div className='relative w-full rounded-lg border border-green-500/30 bg-black/90 sm:flex-1'>
          <div className='absolute left-4 top-1/2 -translate-y-1/2 text-green-400'>
            <span className='font-mono'>$</span>
          </div>
          <input
            type='text'
            placeholder='search modules...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full bg-transparent py-2 pl-10 pr-4 font-mono text-sm 
                text-green-400 placeholder-gray-500 focus:outline-none'
            disabled={loading}
          />
        </div>

        {/* Create Module Modal */}
        {showCreateForm && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <CreateModule
              onClose={() => setShowCreateForm(false)}
              onSuccess={() => {
                fetchModules()
                setShowCreateForm(false)
              }}
            />
          </div>
        )}

        {/* Buttons Container (Full Width on Mobile) */}
        <div className='grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-4'>
          <button
            onClick={fetchModules}
            disabled={loading}
            className='w-full rounded-lg border border-green-500/30 bg-black/90 px-3 
                py-2 font-mono text-sm 
                text-green-400 transition-all hover:border-green-400 hover:bg-green-900/20 sm:w-auto sm:px-4 sm:text-base'
          >
            $ refresh
          </button>

          <button
            onClick={() => setShowCreateForm(true)}
            disabled={loading}
            className='w-full rounded-lg border border-green-500/30 bg-black/90 px-3 
                py-2 font-mono text-sm 
                text-green-400 transition-all hover:border-green-400 hover:bg-green-900/20 sm:w-auto sm:px-4 sm:text-base'
          >
            $ new
          </button>
        </div>
      </div>

      {/* Actual modules listing */}
      <div className='min-h-screen w-full max-w-full overflow-y-auto p-10 px-4'>
        {loading && <Loading />}
        {!loading && filteredModules.length === 0 && (
          <div className='py-4 text-center text-gray-400'>
            {searchTerm ? 'No modules found.' : 'No modules available.'}
          </div>
        )}

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredModules.map((m) => (
            <ModuleCard key={m.key} module={m} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
