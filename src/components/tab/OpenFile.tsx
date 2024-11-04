import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FolderOpen } from "lucide-react"

const OpenFile = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
      setPreview(null)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleOpenFile = () => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result
        if (typeof content === 'string') {
          if (file.type.startsWith('image/')) {
            setPreview(content)
          } else {
            setPreview(content.slice(0, 1000))
          }
        }
      }
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0])
      setPreview(null)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Open File</h2>
      <div 
        className={`flex items-center justify-center w-full ${isDragOver ? 'border-primary' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Label htmlFor="file-open" className="sr-only">
          Choose a file to open
        </Label>
        <Input
          id="file-open"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <Button
          onClick={handleButtonClick}
          className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm text-gray-600 transition-colors duration-200 ease-in-out ${isDragOver ? 'border-primary' : 'hover:border-primary'}`}
        >
          <FolderOpen className="w-8 h-8 mb-2" />
          <span>Click to open a file or drag and drop</span>
          <span className="mt-1 text-xs text-gray-500">Any file type</span>
        </Button>
      </div>
      {file && (
        <div className="text-sm text-gray-500 text-center">
          Selected file: {file.name}
        </div>
      )}
      <Button className="w-full" disabled={!file} onClick={handleOpenFile}>
        Open File
      </Button>
      {preview && (
        <div className="mt-4 p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">File Preview</h3>
          {file?.type.startsWith('image/') ? (
            <img src={preview} alt="File preview" className="max-w-full h-auto" />
          ) : (
            <pre className="whitespace-pre-wrap overflow-auto max-h-64">{preview}</pre>
          )}
        </div>
      )}
    </div>
  )
}

export default OpenFile