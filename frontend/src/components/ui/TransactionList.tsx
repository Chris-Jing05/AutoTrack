'use client'

import { Trash2, Edit } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Transaction } from '@/types'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-slate-500">No transactions yet. Upload a receipt to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                  {transaction.vendor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                  {transaction.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
