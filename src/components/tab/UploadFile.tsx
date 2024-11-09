import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
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
        <div className="text-sm text-gray-500 text-center">
          Selected file: {file.name}
        </div>
      )}
      <Button className="w-full" disabled={!file}>
        Upload File
      </Button>
    </div>
  );
};

export default UploadFile;