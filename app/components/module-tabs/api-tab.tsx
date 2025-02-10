"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal } from "lucide-react"


interface InputField {
  value: string
  type: string
}

interface Schema {
  [key: string]: {
    input: {
      [key: string]: InputField
    }
    output: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any
      type: string
    }
  }
}

interface ApiTabProps {
  schema?: Schema
}

const schemaDefault: Schema = {
  "defaultFunction": {
    "input": {
      "self": {
        "value": "_empty",
        "type": "_empty"
      },
      "module": {
        "value": "_empty",
        "type": "_empty"
      },
      "key": {
        "value": "_empty",
        "type": "_empty"
      }
    },
    "output": {
      "value": null,
      "type": "None"
    }
  }
}

export function ApiTab({ schema=schemaDefault }: ApiTabProps) {
  const [selectedFunction, setSelectedFunction] = useState<string>(Object.keys(schema)[0])
  const [params, setParams] = useState<{ [key: string]: string }>({})
  const [executionResult, setExecutionResult] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const handleParamChange = (param: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      [param]: value,
    }))
  }

  const handleExecute = async () => {
    setIsExecuting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setExecutionResult("Function executed successfully")
    setIsExecuting(false)
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="rounded-lg border border-[#30363D] bg-[#0D1117] overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Select Function</label>
            <Select value={selectedFunction} onValueChange={setSelectedFunction}>
              <SelectTrigger className="w-full bg-[#0D1117] border-[#30363D] text-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0D1117] border-[#30363D]">
                {Object.keys(schema).map((func) => (
                  <SelectItem key={func} value={func} className="text-gray-300 hover:bg-[#30363D]">
                    {func}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm text-gray-400">Parameters</h3>
            {Object.entries(schema[selectedFunction].input).map(([param, field]) => (
              <div key={param} className="space-y-2">
                <label className="text-sm text-gray-400">
                  {param} <span className="text-gray-500">({field.type})</span>
                </label>
                <Input
                  placeholder={`Enter ${param}`}
                  value={params[param] || field.value}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                  className="bg-[#0D1117] border-[#30363D] text-gray-300 placeholder:text-gray-600"
                />
              </div>
            ))}
          </div>

          <Button
            onClick={handleExecute}
            disabled={isExecuting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            Execute Function
          </Button>
        </div>
      </div>

      {executionResult && (
        <div className="rounded-lg border border-[#30363D] bg-[#0D1117] overflow-hidden">
          <div className="border-b border-[#30363D] p-4">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="bg-transparent border-b border-[#30363D]">
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-transparent data-[state=active]:text-white text-gray-400"
                >
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="json"
                  className="data-[state=active]:bg-transparent data-[state=active]:text-white text-gray-400"
                >
                  JSON
                </TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4">
                <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-400">
                  <div className="text-center space-y-4">
                    <Terminal className="w-12 h-12 mx-auto text-blue-500" />
                    <div className="text-lg">Ready to Drop In</div>
                    <Button variant="outline" className="border-[#30363D] text-gray-300 hover:bg-[#30363D]">
                      Vlim
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 border-t border-[#30363D] pt-4">
                  <div className="text-sm text-gray-500">Time: -</div>
                  <div className="text-sm text-gray-500">Tokens/s: -</div>
                  <div className="text-sm text-gray-500">Tokens: -</div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Terminal className="w-4 h-4 mr-2" />
                  Miner Logs will Drop Here
                </div>
              </TabsContent>
              <TabsContent value="json" className="mt-4">
                <pre className="text-sm text-gray-300">
                  <code>{JSON.stringify({ result: executionResult }, null, 2)}</code>
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}
