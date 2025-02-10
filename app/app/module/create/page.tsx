"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer/hub-footer"
import {
    Upload,
    X,
    User,
    Link,
    Code,
    Network,
    FileText,
    Tag,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ImageIcon,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { SimpleHubNavbar } from "@/components/navbar/hub-navbar-simple"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"

interface NewModule {
    name: string
    url: string
    codeLocation: string
    network: string
    description: string
    tags: string[]
    image: File | null
}

interface FormErrors {
    name?: string
    codelocation?: string
    url?: string
    description?: string
    tags?: string
}

const steps = [
    { icon: ImageIcon, label: "Basic Info" },
    { icon: FileText, label: "Details" },
    { icon: Tag, label: "Tags" },
]

export default function CreateModulePage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [name, setName] = useState("")
    const [url, setUrl] = useState("")
    const [codeLocation, setCodeLocation] = useState("https://github.com/")
    const [network, setNetwork] = useState("commune")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [currentTag, setCurrentTag] = useState("")
    const [errors, setErrors] = useState<FormErrors>({})
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && currentTag.trim() !== "") {
            e.preventDefault()
            setTags([...tags, currentTag.trim()])
            setCurrentTag("")
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const validateStep = (currentStep: number): boolean => {
        const newErrors: FormErrors = {}
        switch (currentStep) {
            case 1:
                if (!name.trim()) newErrors.name = "Name is required"
                if (!codeLocation.trim()) newErrors.codelocation = "code location is required"
                break
            case 2:
                if (!description.trim()) newErrors.description = "Description is required"
                if (!url.trim()) newErrors.url = "URL is required"
                break
            case 3:
                if (tags.length === 0) newErrors.tags = "At least one tag is required"
                break
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1)
        }
    }

    const handlePrevious = () => {
        setStep(step - 1)
    }

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateStep(step)) {
            const newModule: NewModule = {
                name,
                url,
                codeLocation,
                network,
                description,
                tags,
                image,
            }
            console.log("New module created:", newModule)
            // Here you would typically send this data to your backend
            // For now, we'll just redirect to the home page
            router.push("/")
        }
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-sm font-medium text-gray-200">
                                    Module Image:
                                </Label>
                                <div className="flex items-center space-x-4">
                                    <label
                                        htmlFor="image"
                                        className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors duration-200"
                                    >
                                        {imagePreview ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={imagePreview || "/placeholder.svg"}
                                                    alt="Module Image preview"
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded-lg"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                                <p className="text-xs text-gray-400">Upload image</p>
                                            </div>
                                        )}
                                        <input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            ref={fileInputRef}
                                        />
                                    </label>
                                    {imagePreview && (
                                        <div className="flex items-center space-x-4">
                                            <div className="flex flex-col items-center">
                                                <Avatar className="w-20 h-20">
                                                    <AvatarImage src={imagePreview} alt="Circular preview" />
                                                    <AvatarFallback>CP</AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs text-gray-400 mt-2">Circular</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={imagePreview || "/placeholder.svg"}
                                                        alt="Rectangular preview"
                                                        width={80}
                                                        height={80}
                                                        objectFit="cover"
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-400 mt-2">Rectangular</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-200">
                                    Name:
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                                        placeholder="Enter module name"
                                        required
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="codeLocation" className="text-sm font-medium text-gray-200">
                                    Code Location:
                                </Label>
                                <div className="relative">
                                    <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        id="codeLocation"
                                        value={codeLocation}
                                        defaultValue={"https://github.com/"}
                                        onChange={(e) => setCodeLocation(e.target.value)}
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                                        placeholder="https://github.com/username/repo"
                                    />
                                </div>
                                {errors.codelocation && <p className="text-red-500 text-xs mt-1">{errors.codelocation}</p>}
                            </div>
                        </div>
                    </>
                )
            case 2:
                return (
                    <>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="url" className="text-sm font-medium text-gray-200">
                                    URL:
                                </Label>
                                <div className="relative">
                                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        id="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                                        placeholder="https://example.com"
                                        required
                                    />
                                </div>
                                {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="network" className="text-sm font-medium text-gray-200">
                                    Network:
                                </Label>
                                <div className="relative">
                                    <Network className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        id="network"
                                        value={network}
                                        onChange={(e) => setNetwork(e.target.value)}
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                                        placeholder="Enter network name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-gray-200">
                                    Description:
                                </Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                                        placeholder="Describe your module's capabilities and purpose"
                                        required
                                    />
                                </div>
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                        </div>
                    </>
                )
            case 3:
                return (
                    <>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="tags" className="text-sm font-medium text-gray-200">
                                        Tags:
                                    </Label>
                                </div>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        id="tags"
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder="Press Enter to add tag"
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map((tag, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-sm"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-2 text-blue-300 hover:text-red-300 transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags}</p>}
                            </div>
                        </div>
                    </>
                )
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#03040B] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            <SimpleHubNavbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="w-full max-w-2xl mx-auto">
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/20 text-red-400">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>Please correct the errors in the form before proceeding.</AlertDescription>
                        </Alert>
                    )}
                    <Card className="bg-white/5 border-white/10 text-white">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        onClick={() => router.push("/")}
                                        className="cursor-pointer text-sm text-gray-400 hover:text-white my-2 flex items-center gap-1 ml-2"
                                    >
                                        <ChevronLeft className="h-4 w-4" /> Back to Modules
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Create New Module</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-8">
                                <div className="flex justify-between items-center">
                                    {steps.map((s, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                            <div
                                                className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                                                    step > index
                                                        ? "bg-blue-500 text-white"
                                                        : step === index + 1
                                                            ? "bg-blue-200 text-blue-800"
                                                            : "bg-gray-200 text-gray-400",
                                                )}
                                            >
                                                <s.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs text-gray-400">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 h-2 bg-gray-200 rounded-full">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
                                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-6">
                                {renderStep()}
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrevious}
                                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Previous
                                </Button>
                            )}
                            {step < steps.length ? (
                                <Button type="button" onClick={handleNext} className="bg-blue-500 text-white hover:bg-blue-600 ml-auto">
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    onClick={handleCreate}
                                    className="bg-blue-500 text-white hover:bg-blue-600 ml-auto"
                                >
                                    Create Module
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}

