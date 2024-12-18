"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { Upload, X } from 'lucide-react'

interface FileUploaderProps {
  acceptedFileTypes: string[]
  maxFileSizeInBytes: number
  label: string
  updateFilesCbAction: (files: File[]) => void
}

export function FileUploader({ acceptedFileTypes, maxFileSizeInBytes, label, updateFilesCbAction }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => file.size <= maxFileSizeInBytes)
    if (validFiles.length < acceptedFiles.length) {
      toast.error(`Noen filer ble ikke lastet opp fordi de overstiger maksimal filstørrelse på ${maxFileSizeInBytes / 1024 / 1024}MB`)
    }
    setFiles(prevFiles => [...prevFiles, ...validFiles])
    updateFilesCbAction([...files, ...validFiles])

    // Simulate upload progress
    validFiles.forEach(file => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }))
        if (progress >= 100) {
          clearInterval(interval)
          toast.success(`${file.name} lastet opp`)
        }
      }, 500)
    })
  }, [maxFileSizeInBytes, files, updateFilesCbAction])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxSize: maxFileSizeInBytes
  })

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove))
    updateFilesCbAction(files.filter(file => file !== fileToRemove))
    setUploadProgress(prev => {
      const { [fileToRemove.name]: _, ...rest } = prev; 
      return rest
    })
    toast.info(`${fileToRemove.name} fjernet`)
  }

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">{label}</p>
        <p className="text-xs text-gray-500 mt-1">
          Dra og slipp filer her, eller klikk for å velge filer
        </p>
      </div>
      {files.length > 0 && (
        <ul className="mt-4 space-y-4">
          {files.map((file, index) => (
            <li key={index} className="bg-gray-50 rounded-md p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{file.name}</span>
                <Button variant="ghost" size="sm" onClick={() => removeFile(file)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={uploadProgress[file.name] || 0} className="mt-2" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

