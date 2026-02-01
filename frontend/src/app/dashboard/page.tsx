'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ReceiptUpload from '@/components/upload/ReceiptUpload'
import TransactionForm from '@/components/ui/TransactionForm'
import SummaryCards from '@/components/ui/SummaryCards'
import TransactionList from '@/components/ui/TransactionList'
import SpendingCharts from '@/components/charts/SpendingCharts'
import type { Transaction, ExtractedData } from '@/types'

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExtract = (data: ExtractedData) => {
    setExtractedData(data)
    setShowForm(true)
  }

  const handleSaveTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            ...transaction,
            user_id: user.id,
          },
        ])

      if (error) throw error

      await loadTransactions()
      setShowForm(false)
      setExtractedData(null)
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert('Failed to save transaction. Please try again.')
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadTransactions()
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert('Failed to delete transaction. Please try again.')
    }
  }

  // Calculate summary stats
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)
  const transactionCount = transactions.length

  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'

  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }))

  // Calculate monthly data
  const monthlyTotals = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    acc[month] = (acc[month] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const monthlyData = Object.entries(monthlyTotals)
    .map(([month, total]) => ({ month, total }))
    .reverse()
    .slice(0, 6)
    .reverse()

  // Calculate monthly change (mock for now)
  const monthlyChange = monthlyData.length >= 2
    ? ((monthlyData[monthlyData.length - 1].total - monthlyData[monthlyData.length - 2].total) /
        monthlyData[monthlyData.length - 2].total) *
      100
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">Track and manage your expenses with AI-powered insights</p>
      </div>

      <SummaryCards
        totalSpent={totalSpent}
        transactionCount={transactionCount}
        topCategory={topCategory}
        monthlyChange={monthlyChange}
      />

      <SpendingCharts categoryData={categoryData} monthlyData={monthlyData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ReceiptUpload onExtract={handleExtract} />
        {showForm && (
          <TransactionForm
            extractedData={extractedData || undefined}
            onSave={handleSaveTransaction}
            onCancel={() => {
              setShowForm(false)
              setExtractedData(null)
            }}
          />
        )}
      </div>

      <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
    </div>
  )
}
