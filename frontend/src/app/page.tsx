import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-slate-800 mb-4">
          AutoTrack
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl">
          AI-Powered Expense Tracker - Automatically extract and categorize expenses from receipts
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
