import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/ui/DashboardNav'
import ErrorBoundary from '@/components/ErrorBoundary'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  )
}
