'use client'

import { useState } from 'react'
import { ModuleType, DefaultModule } from '@/app/types/module'
import { Client } from '@/app/client/client'

const github_prefix: string = 'https://github.com/'
export const CreateModule = ({ 
  onClose,
  onSuccess 
}: { 
  onClose: () => void
  onSuccess: () => void 
}) => {
  const [newModule, setNewModule] = useState<ModuleType>(DefaultModule)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('') // New state for tag input
  const client = new Client()

  const handleFormChange = (field: string, value: any) => {
    setNewModule((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  // New function to handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      // make sure its all lowercase  

      if (newTag && !newModule.tags.includes(newTag)) {
        handleFormChange('tags', [...newModule.tags, newTag])
        setTagInput('')
      }
    }
  }

  // Function to remove a tag
  const removeTag = (tagToRemove: string) => {
    handleFormChange('tags', newModule.tags.filter(tag => tag !== tagToRemove))
  }

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    try {
      if (newModule.code && !newModule.code.startsWith(github_prefix)) {
        newModule.code = `${github_prefix}${newModule.code}`
      }

      await client.call('add_module', newModule)
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create module')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl p-6 bg-black/90 rounded-lg border border-green-500/30">
      <div className="flex items-center mb-6">
        <span className="ml-4 text-yellow-500">$ new_module</span>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <input
          placeholder="[REQ] name (default: agi)"
          value={''}
          onChange={(e) => handleFormChange('name', e.target.value)}
          className="w-full px-4 py-2 bg-black/90 text-green-400 focus:outline-none focus:border-green-400 border border-green-500/30 rounded"
        />
      <input
          placeholder="[REQ] url (url of your server or website)"
          value={''}
          onChange={(e) => handleFormChange('url', e.target.value)}
          className="w-full px-4 py-2 bg-black/90 text-green-400 border focus:outline-none focus:border-green-400 border-green-500/30 rounded"
        />
        <input
          placeholder="[OPT] code (where is your code?)"
          value={''}
          onChange={(e) => handleFormChange('code', e.target.value)}
          className="w-full px-4 py-2 bg-black/90 text-green-400 border focus:outline-none focus:border-green-400 border-green-500/30 rounded"
        />
        <input
          placeholder="[OPT] network (default:commune)"
          value={''}
          onChange={(e) => handleFormChange('network', e.target.value)}
          className="w-full px-4 py-2 bg-black/90 text-green-400 border focus:outline-none focus:border-green-400 border-green-500/30 rounded"
        />

        <input
          placeholder="desc [OPT]  (this agi module does agi things)"
          value={''}
          onChange={(e) => handleFormChange('desc', e.target.value)}
          className="w-full px-4 py-2 bg-black/90 text-green-400 border focus:outline-none focus:border-green-400 border-green-500/30 rounded"
        />
        {/* Tags input and display */}
        <div className="space-y-2">
          <input
            placeholder="Add tags (press Enter or comma to add)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInput}
            className="w-full px-4 py-2 bg-black/90 text-green-400 border focus:outline-none focus:border-green-400 border-green-500/30 rounded"
          />
          
          {/* Tags display */}
          <div className="flex flex-wrap gap-2">
            {newModule.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-green-900/20 text-green-400 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-green-400 hover:text-green-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-2 bg-red-500/20 border border-red-500 text-red-400 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 bg-black/90 text-green-400 border border-green-500/30 rounded hover:bg-green-900/20"
        >
          [ESC] Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="px-4 py-2 bg-black/90 text-green-400 border border-green-500/30 rounded hover:bg-green-900/20"
        >
          {loading ? 'Creating...' : '[ENTER] Create'}
        </button>
      </div>
    </div>
  )
}