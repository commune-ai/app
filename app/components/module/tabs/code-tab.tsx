'use client';

import { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CopyIcon, Check } from 'lucide-react';
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-python"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
type CodeContent = Record<string, string>;

interface CodeTabProps {
  code?: CodeContent;
}

const defaultCode: CodeContent = {
  'error.py': 'code file not found',
};

export function CodeTab({ code = defaultCode }: CodeTabProps) {
  const [selectedFile, setSelectedFile] = useState(() => Object.keys(code)[0] || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  }, []);

  const filteredFiles = useMemo(
    () =>
      Object.keys(code).filter((file) => file.toLowerCase().includes(searchQuery.toLowerCase())),
    [code, searchQuery]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleFileSelect = useCallback((file: string) => {
    setSelectedFile(file);
  }, []);

  const getLanguage = (filename: string) => {
    const extension = filename.split(".").pop()
    switch (extension) {
      case "py":
        return "python"
      case "js":
        return "javascript"
      case "ts":
        return "typescript"
      case "jsx":
        return "jsx"
      case "tsx":
        return "tsx"
      default:
        return "javascript"
    }
  }

  const highlightedCode = useMemo(() => {
    const language = getLanguage(selectedFile)
    return Prism.highlight(code[selectedFile] || "", Prism.languages[language], language)
  }, [selectedFile, code])

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <Input
            placeholder="Search in files..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-[#0D1117] border-[#30363D] pl-10 text-gray-300 placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* File Explorer */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#30363D] overflow-y-auto p-1 md:p-1">
          {filteredFiles.map((file) => (
            <button
              key={file}
              onClick={() => handleFileSelect(file)}
              className={`w-full flex items-center px-4 py-2 text-sm hover:bg-[#30363D] rounded-sm ${selectedFile === file ? 'bg-blue-500 text-white' : 'text-gray-300'
                }`}
            >
              {file}
            </button>
          ))}
        </div>

        {/* Code Viewer */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute right-4 top-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopyCode(code[selectedFile] || '')}
              className="h-8 w-8 rounded-md border border-[#30363D] bg-[#0D1117] hover:bg-[#30363D] transition-all duration-200"
            >
              {copied ? (
                <Check className="h-4 w-4 text-blue-500" />
              ) : (
                <CopyIcon className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
          <pre className="text-sm font-mono p-4 overflow-x-auto">
            <code
              className={`language-${getLanguage(selectedFile)}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
      </div>
    </div>
    </div >
  );
}
