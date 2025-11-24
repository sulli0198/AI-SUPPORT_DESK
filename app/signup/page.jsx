'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CheckAuth from '@/components/CheckAuth'

export default function SignupPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/tickets')
      } else {
        alert(data.error || 'Signup failed')
      }
    } catch (err) {
      alert('Something went wrong')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CheckAuth protected={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
        <div className="card w-full max-w-md shadow-2xl bg-base-300 border border-gray-700">
          <div className="card-body p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-gray-400">Join our AI Support Desk platform</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              {/* Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-300">Email Address</span>
                </label>
                <div className="relative">
                  <svg className="w-5 h-5 text-gray-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full pl-10 pr-4 py-3 bg-base-200 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-300">Password</span>
                </label>
                <div className="relative">
                  <svg className="w-5 h-5 text-gray-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    className="input input-bordered w-full pl-10 pr-4 py-3 bg-base-200 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-control mt-8">
                <button
                  type="submit"
                  className="btn btn-primary w-full py-3 text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="text-center mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400">
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="text-primary hover:text-primary-focus font-semibold transition-colors duration-200"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </CheckAuth>
  )
}