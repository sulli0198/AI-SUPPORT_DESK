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
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-sm shadow-xl bg-base-100">
          <form onSubmit={handleSignup} className="card-body">
            <h2 className="card-title justify-center">Sign Up</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered"
              value={form.password}
              onChange={handleChange}
              required
            />
            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CheckAuth>
  )
}