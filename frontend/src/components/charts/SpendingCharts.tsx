'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1']

interface SpendingChartsProps {
  categoryData: Array<{ name: string; value: number }>
  monthlyData: Array<{ month: string; total: number }>
}

export default function SpendingCharts({ categoryData, monthlyData }: SpendingChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Spending by Category</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            No data available
          </div>
        )}
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Monthly Spending Trend</h3>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: '#4f46e5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            No data available
          </div>
        )}
      </div>

      {/* Category Bar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Category Comparison</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            No data available
          </div>
        )}
      </div>
    </div>
  )
}
