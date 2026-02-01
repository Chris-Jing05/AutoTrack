'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Receipt } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

export default function DashboardNav({ user }: { user: User }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      alert('Failed to logout. Please try again.')
    }
  }

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Receipt className="w-8 h-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-800">AutoTrack</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
