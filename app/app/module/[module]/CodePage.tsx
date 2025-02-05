'use client'

import { useState } from 'react'
import { CopyButton } from '@/app/components/CopyButton'

interface CodePageProps {
  code: string
  language?: string
}

export const CodePage = ({ code, path}: CodePageProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex-1 text-left px-2 py-1 text-green-400 hover:bg-green-900/20"
        >
          {isCollapsed ? '[+] ' : '[-] '}{path}
        </button>
        <CopyButton code={code} />
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