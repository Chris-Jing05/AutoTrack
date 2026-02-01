export interface Transaction {
  id: string
  user_id: string
  vendor: string
  category: string
  amount: number
  date: string
  description: string
  created_at: string
}

export interface ExtractedData {
  vendor: string
  amount: number
  date: string
  category: string
  description: string
  confidence: number
}

export interface MonthlySummary {
  total_spent: number
  transaction_count: number
  top_category: string
  spending_by_category: { [key: string]: number }
  monthly_totals: Array<{ month: string; total: number }>
  insights: string[]
}

export interface User {
  id: string
  email: string
  created_at: string
}

export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Travel',
  'Other'
] as const

export type Category = typeof CATEGORIES[number]
