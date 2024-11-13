import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileIcon, FileText, Image as ImageIcon } from "lucide-react";
import AlertMessage from "@/components/Alert/AlertMessage";

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null);
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
      setFile(event.target.files[0]);
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
      setFile(event.dataTransfer.files[0]);
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
  
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
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
          link.download = file.name;  // Menggunakan nama asli file
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
          <span className="mt-1 text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</span>
        </Button>
      </div>
      {file && (
        <div className="mt-4 border rounded-lg overflow-hidden">
          <div className="bg-muted p-4 flex items-center space-x-4">
            {getFileIcon(file.type)}
            <div>
              <h3 className="text-lg font-semibold">{file.name}</h3>
              <p className="text-sm text-muted-foreground">
                {file.type || 'Unknown file type'} - {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        </div>
      )}
      <Button className="w-full" disabled={!file} onClick={handleUpload}>
        Upload File
      </Button>
      <AlertMessage showAlert={showAlert} alertMessage={alertMessage} />
    </div>
  );
};

export default UploadFile;