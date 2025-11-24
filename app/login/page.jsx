'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CheckAuth from '@/components/CheckAuth'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
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
        
        // Success animation before redirect
        setTimeout(() => {
          router.push('/tickets')
        }, 500)
      } else {
        setShake(true)
        setTimeout(() => setShake(false), 500)
        alert(data.error || 'Login failed')
      }
    } catch (err) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      alert('Something went wrong')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CheckAuth protected={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-300 to-base-400">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className={`card w-full max-w-md shadow-2xl bg-base-100/80 backdrop-blur-sm border border-base-300 transform transition-all duration-300 hover:scale-105 ${
          shake ? 'animate-shake' : ''
        }`}>
          <div className="card-body p-8">
            {/* Header with animation */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-base-content/70 mt-2">Sign in to your AI Support Desk</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input with focus effects */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full pl-10 transition-all duration-300 group-hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Input with focus effects */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="input input-bordered w-full pl-10 transition-all duration-300 group-hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button with loading animation */}
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary w-full transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    loading ? 'loading' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-base-300">
              <p className="text-base-content/70">
                Don't have an account?{' '}
                <a 
                  href="/signup" 
                  className="link link-primary font-semibold hover:underline transition-all duration-300"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </CheckAuth>
  )
}