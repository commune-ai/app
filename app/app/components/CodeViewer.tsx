
'use client'

import { useState } from 'react'
import { CopyButton } from './CopyButton'

interface CodeViewerProps {
  code: string
  path?: string
  language?: string
}

export const CodeViewer = ({ code, path}: CodeViewerProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="text-green-400">{path}</div>
        <div className="flex gap-2">
          <CopyButton code={code} />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-2 py-1 text-xs border border-green-500/30 
                     hover:bg-green-900/20 text-green-400"
          >
            {isCollapsed ? '[+] Expand' : '[-] Collapse'}
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="relative group rounded-lg overflow-hidden border border-green-500/30">
          <pre className="p-6 bg-black/50 overflow-x-auto">
            <code className="text-green-400 text-sm">{code}</code>
          </pre>
        </div>
      )}
    </div>
  )
}