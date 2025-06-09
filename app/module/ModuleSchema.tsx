'use client'
import { Client } from '@/app/client/client'
import { useState } from 'react'
import { CopyButton } from '@/app/components/CopyButton'

type SchemaType = {
  input: Record<string, {
    value: any
    type: string
  }>
  output: {
    value: any
    type: string
  }
}

export const ModuleSchema = ({mod}: Record<string, any>) => {
  const [selectedFunction, setSelectedFunction] = useState<string>('')
  const [params, setParams] = useState<Record<string, any>>({})
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const  [error, setError] = useState<string>('')
  console.log('ModuleSchema props:', mod)
  let schema: SchemaType = mod.schema || {}

  // Handle parameter input change
  const handleParamChange = (paramName: string, value: string) => {
    setParams({ ...params, [paramName]: value })
  } 
  // Execute the selected function
  const executeFunction = async () => {
    setLoading(true)
    setError('')
    try {
      const client = new Client()
      const response = await client.call(selectedFunction, params)
      setResponse(response)
    } catch (err: any) {
      setError(err.message || 'Failed to execute function')
    } finally {
      setLoading(false)
    }
  }
  console.log('ModuleSchema rendered with schema:', schema)

  return (
    <div className="space-y-6">
      {/* Function Selector */}
      <div className="flex flex-col space-y-2">
        <label className="text-gray-400">Select Function</label>
        <select
          value={selectedFunction}
          onChange={(e) => {
            setSelectedFunction(e.target.value)
            setParams({})
            setResponse(null)
          }}
          className="w-full px-4 py-2 bg-black/90 text-green-400 
                   border border-green-500/30 rounded-lg
                   focus:outline-none focus:border-green-400"
        >
          <option value="">Select a function</option>

          {Object.keys(schema).map(fn => (
            <option key={fn} value={fn}>{fn}</option>
          ))}
        </select>
      </div>

      {/* Parameters Input */}
      {selectedFunction && schema && (
        <div className="space-y-4">
          <h3 className="text-green-400">Parameters</h3>
          {Object.entries(schema[selectedFunction].input).map(([param, details]) => (
            <div key={param} className="space-y-1">
              <label className="text-sm text-gray-400">
                {param} ({details.type})
                {details.value !== '_empty' && (
                  <span className="text-gray-500"> - default: {String(details.value)}</span>
                )}
              </label>
              <input
                type="text"
                value={params[param] || ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param}`}
                className="w-full px-4 py-2 bg-black/90 text-green-400 
                         border border-green-500/30 rounded-lg
                         focus:outline-none focus:border-green-400"
              />
            </div>
          ))}

          <button
            onClick={executeFunction}
            disabled={loading}
            className="w-full px-4 py-2 bg-black/90 text-green-400 
                     border border-green-500/30 rounded-lg
                     hover:bg-green-900/20 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Executing...' : 'Execute Function'}
          </button>
        </div>
      )}

      {/* Response Display */}
      {(response || error) && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-green-400">Response</h3>
            <CopyButton code={JSON.stringify(response || error, null, 2)} />
          </div>
          <pre className="p-4 bg-black/90 border border-green-500/30 rounded-lg overflow-x-auto">
            <code className={`text-sm ${error ? 'text-red-400' : 'text-green-400'}`}>
              {JSON.stringify(response || error, null, 2)}
            </code>
          </pre>
        </div>
      )}
    </div>
  )
}

export default ModuleSchema