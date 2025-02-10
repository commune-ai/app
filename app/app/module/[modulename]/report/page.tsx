"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, AlertTriangle, ChevronRight, ChevronLeft } from "lucide-react"
import { SimpleHubNavbar } from "@/components/navbar/hub-navbar-simple"
import { Footer } from "@/components/footer/hub-footer"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function ReportModulePage() {
  const router = useRouter()
  const params = useParams()
  const [problem, setProblem] = useState("")
  const [vote, setVote] = useState<"up" | "down" | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the report data to your backend
    console.log("Report submitted:", { problem, vote })
    // After submission, navigate back to the module page
    router.push(`/module/${params.moduleNname}`)
  }

  const handleStake = () => {
    // Implement staking logic here
    console.log("Staking initiated")
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#03040B] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <SimpleHubNavbar/>
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronLeft className="h-4 w-4" />
              </BreadcrumbSeparator>
                <BreadcrumbLink onClick={()=>{router.push(`/`)}} className="text-sm text-gray-400 hover:text-white">
                  Modules
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronLeft className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={()=>{router.push(`/module/${params.modulename}`)}} className="text-sm text-gray-400 hover:text-white">
                  {params.modulename}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-sm text-white hover:text-white">Report</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Card className="w-full max-w-md bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-red-400" />
              Report Module
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="problem" className="block text-sm font-medium text-gray-200 mb-1">
                  Describe the problem
                </label>
                <Textarea
                  id="problem"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full bg-white/5 border-white/10 text-white"
                  placeholder="What issues are you experiencing with this module?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Vote</label>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={vote === "up" ? "default" : "outline"}
                    className={`flex-1 ${
                      vote === "up"
                        ? "bg-green-500 text-white"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={() => setVote("up")}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Upvote
                  </Button>
                  <Button
                    type="button"
                    variant={vote === "down" ? "default" : "outline"}
                    className={`flex-1 ${
                      vote === "down"
                        ? "bg-red-500 text-white"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={() => setVote("down")}
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Downvote
                  </Button>
                </div>
              </div>
              <Button type="button" onClick={handleStake} className="w-full bg-blue-500 text-white hover:bg-blue-600">
                Stake
              </Button>
              <p className="my-1 text-xs">Staked Amount: </p>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" onClick={handleSubmit} className="w-full bg-blue-500 text-white hover:bg-blue-600">
              Submit Report
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

