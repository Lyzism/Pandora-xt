import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileIcon, FileText, Image as ImageIcon, X } from "lucide-react";
import AlertMessage from "@/components/Alert/AlertMessage";
import { useFileStore } from '@/stores/fileStore';

const UploadFile = () => {
  const { 
    uploadedFile, 
    setUploadedFile, 
    clearUploadedFile,
    isFileInvalid,
    setFileInvalid
  } = useFileStore();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-12 h-12 text-blue-500" />;
    if (fileType === 'application/pdf') return <FileText className="w-12 h-12 text-red-500" />;
    if (fileType.includes('text/')) return <FileText className="w-12 h-12 text-green-500" />;
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') 
      return <FileText className="w-12 h-12 text-blue-700" />;
    return <FileIcon className="w-12 h-12 text-gray-500" />;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setAlertMessage("Please log in to upload files.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
      return;
    }

    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
      setFileInvalid(false);
    }
  };

  const handleButtonClick = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setAlertMessage("Please log in to upload files.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const token = sessionStorage.getItem('token');
    if (!token) {
      setAlertMessage("Please log in to upload files.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
      return;
    }

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setUploadedFile(event.dataTransfer.files[0]);
      setFileInvalid(false);
    }
  };
  
  const handleUpload = async () => {
    const token = sessionStorage.getItem('token');
  
    if (!token) {
      setAlertMessage("Please log in to upload files.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
      return;
    }
  
    if (uploadedFile) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
      if (!allowedTypes.includes(uploadedFile.type)) {
        setAlertMessage("Only PDF and Word files are allowed.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 10000);
        setFileInvalid(true);
        return;
      }
  
      setFileInvalid(false);

      const formData = new FormData();
      formData.append('file', uploadedFile);
  
      try {
        const response = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
  
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = uploadedFile.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
  
          setAlertMessage("File uploaded and encrypted successfully!");
        } else {
          setAlertMessage("Failed to upload and encrypt file. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setAlertMessage("An error occurred. Please try again.");
      } finally {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 10000);
      }
    } else {
      setAlertMessage("No file selected. Please choose a file first.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 10000);
    }
  };

  const handleCancelFile = () => {
    clearUploadedFile();
    setFileInvalid(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Upload File</h2>
      <div 
        className="flex items-center justify-center w-full" 
        onDragOver={handleDragOver} 
        onDrop={handleDrop}
      >
        <Label htmlFor="file-upload" className="sr-only">
          Choose a file
        </Label>
        <Input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <Button
          onClick={handleButtonClick}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-sm text-gray-600 transition-colors duration-200 ease-in-out hover:border-primary"
        >
          <Upload className="w-8 h-8 mb-2" />
          <span>Click to upload or drag and drop</span>
          <span className="mt-1 text-xs text-gray-500">WORD & PDF</span>
        </Button>
      </div>
      {uploadedFile && (
        <div
        className={`mt-4 border rounded-lg overflow-hidden ${
          isFileInvalid ? 'bg-red-100 border-red-500' : 'bg-muted'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getFileIcon(uploadedFile.type)}
            <div>
              <h3 className="text-lg font-semibold">{uploadedFile.name}</h3>
              <p className="text-sm text-muted-foreground">
                {uploadedFile.type || 'Unknown file type'} - {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancelFile}
            aria-label="Cancel file selection"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      )}
      <Button className="w-full" disabled={!uploadedFile} onClick={handleUpload}>
        Upload File
      </Button>
      <AlertMessage showAlert={showAlert} alertMessage={alertMessage} />
    </div>
  );
}

export default UploadFile;