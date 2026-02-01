'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { createWorker } from 'tesseract.js'
import type { ExtractedData } from '@/types'

interface ReceiptUploadProps {
  onExtract: (data: ExtractedData) => void
}

export default function ReceiptUpload({ onExtract }: ReceiptUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [textInput, setTextInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mode, setMode] = useState<'upload' | 'text'>('upload')

  const processOCR = async (imageFile: File) => {
    setLoading(true)
    setProgress(0)

    let worker = null

    try {
      // Create worker with local paths to avoid CDN/CORS issues
      console.log('Creating Tesseract worker...')
      worker = await createWorker('eng', 1, {
        workerPath: '/tesseract/worker.min.js',
        langPath: '/tesseract/',
        corePath: '/tesseract/',
        gzip: true,
        logger: (m) => {
          console.log('Tesseract logger:', m)
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        },
        errorHandler: (err) => {
          console.error('Tesseract error handler:', err)
        },
      })
      console.log('Worker created successfully')

      const { data: { text } } = await worker.recognize(imageFile)

      if (!text || text.trim().length === 0) {
        throw new Error('No text could be extracted from the image. Please ensure the image is clear and contains readable text.')
      }

      await worker.terminate()
      worker = null

      // Send extracted text to backend for NLP processing
      await processText(text)
    } catch (error) {
      console.error('OCR Error:', error)

      // Clean up worker if it exists
      if (worker) {
        try {
          await worker.terminate()
        } catch (terminateError) {
          console.error('Error terminating worker:', terminateError)
        }
      }

      let errorMessage = 'Failed to process receipt'

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as any).message)
      }

      // Don't show alert if processText already showed one
      if (!errorMessage.includes('backend') && !errorMessage.includes('extract') && !errorMessage.includes('connect to the backend')) {
        alert(`${errorMessage}. Please try again.`)
      }
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  const processText = async (text: string) => {
    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`Failed to extract data: ${response.status} - ${errorText}`)
      }

      const extractedData: ExtractedData = await response.json()
      onExtract(extractedData)

      // Reset form
      setFile(null)
      setTextInput('')
    } catch (error) {
      console.error('Extraction Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        alert('Cannot connect to the backend server. Please make sure the backend is running on http://localhost:8000')
      } else {
        alert(`Failed to extract expense data: ${errorMessage}. Please try again.`)
      }
      throw error // Re-throw so calling function knows it failed
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    try {
      await processOCR(file)
    } catch (error) {
      console.error('Upload handler error:', error)
      // processOCR already handles and displays errors
      setLoading(false)
    }
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return
    try {
      await processText(textInput)
    } catch (error) {
      console.error('Text submit handler error:', error)
      // processText already handles and displays errors
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Add Expense</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            mode === 'upload'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Upload Receipt
        </button>
        <button
          onClick={() => setMode('text')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            mode === 'text'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Paste Text
        </button>
      </div>

      {mode === 'upload' ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={loading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <span className="text-slate-700">{file.name}</span>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600">Click to upload receipt image</p>
                  <p className="text-sm text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
            </label>
          </div>

          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-indigo-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing receipt... {progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Process Receipt'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste receipt text or email content here..."
            rows={8}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black placeholder:text-slate-900"
            disabled={loading}
          />

          {loading && (
            <div className="flex items-center justify-center gap-2 text-indigo-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Extracting data...</span>
            </div>
          )}

          <button
            onClick={handleTextSubmit}
            disabled={!textInput.trim() || loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Extract Data'}
          </button>
        </div>
      )}
    </div>
  )
}
