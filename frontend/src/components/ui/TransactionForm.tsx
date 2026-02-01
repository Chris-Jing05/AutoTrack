'use client'

import { useState, useEffect } from 'react'
import { CATEGORIES } from '@/types'
import type { ExtractedData, Transaction } from '@/types'
import { X } from 'lucide-react'

interface TransactionFormProps {
  extractedData?: ExtractedData
  onSave: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => void
  onCancel: () => void
}

export default function TransactionForm({ extractedData, onSave, onCancel }: TransactionFormProps) {
  const [vendor, setVendor] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (extractedData) {
      setVendor(extractedData.vendor)
      setAmount(extractedData.amount.toString())
      setDate(extractedData.date)
      setCategory(extractedData.category)
      setDescription(extractedData.description)
    }
  }, [extractedData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      vendor,
      amount: parseFloat(amount),
      date,
      category,
      description,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Review & Save Transaction</h3>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {extractedData && extractedData.confidence < 0.8 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
          Low confidence extraction. Please verify the details below.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Vendor
          </label>
          <input
            type="text"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black placeholder:text-slate-900"
            placeholder="Starbucks"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black placeholder:text-slate-900"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black placeholder:text-slate-900"
            placeholder="Additional notes..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Save Transaction
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
