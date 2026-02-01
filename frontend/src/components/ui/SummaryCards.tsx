import { DollarSign, Receipt, TrendingUp, Tag } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface SummaryCardsProps {
  totalSpent: number
  transactionCount: number
  topCategory: string
  monthlyChange: number
}

export default function SummaryCards({
  totalSpent,
  transactionCount,
  topCategory,
  monthlyChange,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Total Spent</span>
          <DollarSign className="w-5 h-5 text-indigo-600" />
        </div>
        <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalSpent)}</p>
        <p className={`text-sm mt-1 ${monthlyChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
          {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}% from last month
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Transactions</span>
          <Receipt className="w-5 h-5 text-indigo-600" />
        </div>
        <p className="text-2xl font-bold text-slate-800">{transactionCount}</p>
        <p className="text-sm text-slate-500 mt-1">This month</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Top Category</span>
          <Tag className="w-5 h-5 text-indigo-600" />
        </div>
        <p className="text-2xl font-bold text-slate-800">{topCategory || 'N/A'}</p>
        <p className="text-sm text-slate-500 mt-1">Most spending</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Avg Transaction</span>
          <TrendingUp className="w-5 h-5 text-indigo-600" />
        </div>
        <p className="text-2xl font-bold text-slate-800">
          {formatCurrency(transactionCount > 0 ? totalSpent / transactionCount : 0)}
        </p>
        <p className="text-sm text-slate-500 mt-1">Per transaction</p>
      </div>
    </div>
  )
}
