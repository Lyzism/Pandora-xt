import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FolderOpen, FileText, Image as ImageIcon, FileIcon, File } from "lucide-react"
import * as mammoth from 'mammoth/mammoth.browser';
import AlertMessage from "@/components/Alert/AlertMessage";

const OpenFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setAlertMessage('Please log in to access the files.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
      return;
    }

    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setAlertMessage('');
      setShowAlert(false);
      handleFilePreview(selectedFile);
    }
  };

  const handleButtonClick = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setAlertMessage('Please log in to access the files.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFilePreview = async (file: File) => {
    setAlertMessage('');
    setShowAlert(false);
    
    const token = sessionStorage.getItem('token');
    if (!token) {
      setAlertMessage('Please log in to access the files.');
      setShowAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/api/preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to preview file');
      }

      const blob = await response.blob();

      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await blob.arrayBuffer();
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer });
          if (result.messages.length > 0) {
            console.warn('Warnings while converting:', result.messages);
          }
          setPreview(result.value);
        } catch (err) {
          console.error('Error converting .docx file:', err);
          setAlertMessage('Failed to read Word document. Make sure the .docx file is valid.');
          setShowAlert(true);
          setPreview(null);
        }
      } else if (file.type === 'application/pdf') {
        const decryptedPdfUrl = URL.createObjectURL(blob);
        setPreview(decryptedPdfUrl);
      } else if (file.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(blob));
      } else {
        const text = await blob.text();
        setPreview(text);
      }
    } catch (error) {
      console.error('Error previewing file:', error);
      setAlertMessage('Failed to preview file. Please try again.');
      setShowAlert(true);
      setPreview(null);
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
    event.preventDefault();
    const token = sessionStorage.getItem('token');
    if (!token) {
      setAlertMessage('Please log in to access the files.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
      return;
    }
  
    setIsDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      setFile(droppedFile);
      setAlertMessage('');
      setShowAlert(false);
      handleFilePreview(droppedFile);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-12 h-12 text-blue-500" />
    if (fileType === 'application/pdf') return <FileText className="w-12 h-12 text-red-500" />
    if (fileType.includes('text/')) return <FileText className="w-12 h-12 text-green-500" />
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') 
      return <FileText className="w-12 h-12 text-blue-700" />
    return <FileIcon className="w-12 h-12 text-gray-500" />
  }

  return (
    <div className="space-y-4 bg-background text-foreground">
      <h2 className="text-2xl font-bold mb-4">Open File</h2>
      <div 
        className={`w-full h-32 flex items-center justify-center w-full border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out ${
          isDragOver ? 'border-primary' : 'border-gray-300 hover:border-primary'
        }`}
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
          accept=".txt,.pdf,.docx,.doc,.png,.jpg,.jpeg"
        />  
        <Button
          onClick={handleButtonClick}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-sm text-gray-600 transition-colors duration-200 ease-in-out hover:border-primary"
        >
          <FolderOpen className="w-8 h-8 mb-2" />
          <span>Click to open a file or drag and drop</span>
          <span className="mt-1 text-xs text-gray-500">Supported types: .txt, .pdf, .docx, images</span>
        </Button>
      </div>
      {file && (
        <div className="mt-8 border rounded-lg overflow-hidden">
          <div className="bg-muted p-4 flex items-center space-x-4">
            {getFileIcon(file.type)}
            <div>
              <h3 className="text-lg font-semibold">{file.name}</h3>
              <p className="text-sm text-muted-foreground">
                {file.type || 'Unknown file type'} - {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <div className="p-4">
            {preview ? (
              file.type.startsWith('image/') ? (
                <img src={preview} alt="File preview" className="max-w-full h-auto rounded-md" />
              ) : file.type === 'application/pdf' ? (
                <iframe 
                  src={preview} 
                  title="PDF preview" 
                  className="w-full h-[70vh] border-none rounded-md" 
                  style={{ backgroundColor: 'white' }}
                />
              ) : file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                <div 
                  className="prose prose-sm max-w-full h-[70vh] overflow-auto p-4 bg-white rounded-md [&>*]:w-full [&_p]:w-full [&_h1]:w-full [&_h2]:w-full [&_h3]:w-full"
                  dangerouslySetInnerHTML={{ __html: preview }} 
                />
              ) : (
                <pre className="whitespace-pre-wrap overflow-auto max-h-[70vh] p-4 bg-muted rounded-md text-sm">
                  {preview}
                </pre>
              )
            ) : (
              <div className="flex items-center justify-center h-[70vh] bg-muted rounded-md">
                <File className="w-16 h-16 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Preview not available</p>
              </div>
            )}
          </div>
        </div>
      )}
      <AlertMessage showAlert={showAlert} alertMessage={alertMessage} />
    </div>
  )
}

export default OpenFile;