"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { CheckCircle, XCircle, ExternalLink, Filter, Search, X } from "lucide-react"
import Image from "next/image"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DialogTitle } from "@radix-ui/react-dialog"
import { HistoryTableSkeleton } from "../skeleton/history-table-skeleton"
import { useAppHistoryStore } from "@/store/use-app-history-state"

export default function HistoryTab({ moduleid }: { moduleid: string }) {
  const [filterWorking, setFilterWorking] = useState<string | null>(null)
  const [filterCheckedByDOA, setFilterCheckedByDOA] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { appHistory, fetchAppHistory } = useAppHistoryStore();
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetchAppHistory(moduleid);
          if (!response.success) {
            setError(response.error ?? null);
          }
        } catch (err) {
          setError(String(err))
        } finally {
          setIsLoading(false);
          hasFetched.current = true;
        }
      };
      fetchData();
    }
  }, [fetchAppHistory, moduleid]);

  const resetFilters = () => {
    setFilterWorking(null)
    setFilterCheckedByDOA(null)
    setSearchTerm("")
  }

  const filteredLogs = appHistory.filter(
    (log) =>
      (filterWorking === null ||
        filterWorking === "all" ||
        (filterWorking === "working" && log.moduleworking) ||
        (filterWorking === "notWorking" && !log.moduleworking)) &&
      (filterCheckedByDOA === null ||
        filterCheckedByDOA === "all" ||
        (filterCheckedByDOA === "checked" && log.checkedByDOA) ||
        (filterCheckedByDOA === "notChecked" && !log.checkedByDOA)) &&
      (log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipfs_cid.toLowerCase().includes(searchTerm.toLowerCase())),
  )
  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-gray-100 py-8">
      <main className="container mx-auto px-4">
        <Card className="bg-[#1E1E1E] border-gray-800 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-8 bg-[#2A2A2A] border-gray-700 text-gray-100 placeholder-gray-400 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gray-700 text-gray-100 hover:bg-[#2A2A2A] hover:text-gray-100"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-[#2A2A2A] border-gray-700">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none text-gray-100">Module Status</h4>
                        <Select onValueChange={(value) => setFilterWorking(value === "all" ? null : value)}>
                          <SelectTrigger className="bg-[#1E1E1E] border-gray-700 text-gray-100">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2A2A2A] border-gray-700">
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="working">Working</SelectItem>
                            <SelectItem value="notWorking">Not Working</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none text-gray-100">DOA Check</h4>
                        <Select onValueChange={(value) => setFilterCheckedByDOA(value === "all" ? null : value)}>
                          <SelectTrigger className="bg-[#1E1E1E] border-gray-700 text-gray-100">
                            <SelectValue placeholder="Select DOA status" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2A2A2A] border-gray-700">
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="checked">Checked</SelectItem>
                            <SelectItem value="notChecked">Not Checked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={resetFilters} variant="outline" className="mt-2">
                        <X className="mr-2 h-4 w-4" />
                        Reset Filters
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <HistoryTableSkeleton />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-[#2A2A2A]">
                      <TableHead className="text-gray-400">Evidence</TableHead>
                      <TableHead className="text-gray-400">Description</TableHead>
                      <TableHead className="text-gray-400">IPFS</TableHead>
                      <TableHead className="text-gray-400">Created At</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Checked by DOA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow className="border-gray-700">
                        <TableCell colSpan={6} className="text-center text-gray-400">
                          No Interaction found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id} className="border-gray-700 hover:bg-[#2A2A2A]">
                          <TableCell className="font-medium">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="p-0 h-16 w-16 bg-[#2A2A2A] border-gray-700 hover:bg-[#3A3A3A]"
                                >
                                  <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${log.evidenceImage_url}` ||
                                      "/sample.png"}
                                    alt="Evidence"
                                    width={64}
                                    height={64}
                                    className="object-cover rounded-sm"
                                  />
                                </Button>
                              </DialogTrigger>
                              <DialogTitle className="text-gray-100 text-lg font-semibold hidden">Evidence</DialogTitle>
                              <DialogContent className="bg-[#2A2A2A] border-gray-700 w-[600px] h-[500px] flex flex-col">
                                <div className="flex-grow flex flex-col space-y-4 overflow-hidden">
                                  <div className="flex justify-center items-center flex-grow">
                                    <Image
                                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${log.evidenceImage_url}` ||
                                        "/sample.png"}
                                      alt="Evidence"
                                      width={800}
                                      height={800}
                                      className="max-w-full max-h-[400px] object-contain rounded-md"
                                    />
                                  </div>
                                  <div className="bg-[#1E1E1E] p-4 rounded-md">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-100">Description</h3>
                                    <p className="tex</div>t-gray-300">{log.description}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-white">{log.description}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="bg-[#2A2A2A] border-gray-700 text-gray-100 hover:bg-[#3A3A3A] hover:text-gray-100"
                            >
                              <a href={`https://gateway.lighthouse.storage/ipfs/${log.ipfs_cid}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                IPFS
                              </a>
                            </Button>
                          </TableCell>
                          <TableCell className="text-white">{format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                          <TableCell>
                            <Badge
                              variant={log.moduleworking ? "default" : "destructive"}
                              className={
                                log.moduleworking ? "bg-green-700 hover:bg-green-600" : "bg-red-700 hover:bg-red-600"
                              }
                            >
                              {log.moduleworking ? (
                                <CheckCircle className="w-4 h-4 mr-1" />
                              ) : (
                                <XCircle className="w-4 h-4 mr-1" />
                              )}
                              {log.moduleworking ? "Working" : "Not Working"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={log.checkedByDOA ? "default" : "secondary"}
                              className={
                                log.checkedByDOA ? "bg-green-700 hover:bg-green-600" : "bg-gray-700 hover:bg-gray-600 text-white"
                              }
                            >
                              {log.checkedByDOA ? "Checked" : "Unchecked"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

