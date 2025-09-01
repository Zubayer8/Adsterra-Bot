import React, { useState, useCallback, useRef } from 'react';

interface FileUploadProps {
  label: string;
  onFileLoad: (content: string) => void;
  onError: (message: string | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onFileLoad, onError }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.txt')) {
        onError(`Invalid file type: "${file.name}". Please upload a .txt file.`);
        setFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the input so the user can select the same file again if needed
        }
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileLoad(content);
      };
      reader.readAsText(file);
    }
  }, [onFileLoad, onError]);

  const handleClick = () => {
    // Clear previous errors when the user tries to upload a new file
    onError(null);
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
      <label className="block text-lg font-semibold text-gray-300 mb-3">{label}</label>
      <div 
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 hover:bg-gray-700/50 transition-colors"
        onClick={handleClick}
      >
        <input
          type="file"
          accept=".txt"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center">
          <svg className="w-12 h-12 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          <p className="text-gray-400">
            {fileName ? `File: ${fileName}` : 'Click to upload a .txt file'}
          </p>
          <p className="text-xs text-gray-500 mt-1">One entry per line</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;