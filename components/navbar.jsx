'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Only access localStorage on client side
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    setToken(storedToken)
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsMenuOpen(false)
    router.push('/login')
  }

  const handleNavClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="navbar bg-base-300 border-b border-gray-700 px-4 sm:px-6">
      {/* Left side - Logo */}
      <div className="flex-1">
        <Link 
          href="/" 
          className="btn btn-ghost text-xl normal-case hover:bg-base-200 transition-all duration-200"
          onClick={handleNavClick}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="hidden sm:inline">AI Support Desk</span>
          <span className="sm:hidden">Support AI</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-2">
        {!token ? (
          <>
            <Link href="/signup" className="btn btn-ghost btn-sm hover:bg-base-200 transition-colors">
              Sign Up
            </Link>
            <Link href="/login" className="btn btn-primary btn-sm text-white hover:shadow-lg hover:shadow-primary/25 transition-all">
              Login
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3 bg-base-200 rounded-full py-1 px-3 border border-gray-600">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm text-gray-300 max-w-[120px] truncate">
                {user?.email}
              </span>
              {user?.role && (
                <div className={`badge badge-xs capitalize ${
                  user.role === 'admin' ? 'badge-error' : 
                  user.role === 'moderator' ? 'badge-warning' : 'badge-info'
                }`}>
                  {user.role}
                </div>
              )}
            </div>

            {/* Admin Button */}
            {user && user?.role === 'admin' && (
              <Link 
                href="/admin" 
                className="btn btn-ghost btn-sm hover:bg-base-200 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </Link>
            )}

            {/* Logout Button */}
            <button 
              onClick={logout} 
              className="btn btn-ghost btn-sm hover:bg-error hover:text-error-content transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="flex md:hidden">
        <button 
          className="btn btn-ghost btn-square"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-base-300 border-b border-gray-700 shadow-lg md:hidden">
          <div className="px-4 py-3 space-y-3">
            {!token ? (
              <>
                <Link 
                  href="/signup" 
                  className="btn btn-ghost btn-block justify-start hover:bg-base-200 transition-colors"
                  onClick={handleNavClick}
                >
                  Sign Up
                </Link>
                <Link 
                  href="/login" 
                  className="btn btn-primary btn-block text-white hover:shadow-lg hover:shadow-primary/25 transition-all"
                  onClick={handleNavClick}
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                {/* User Info Mobile */}
                <div className="flex items-center gap-3 bg-base-200 rounded-lg p-3 border border-gray-600 mb-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.email}
                    </p>
                    {user?.role && (
                      <div className={`badge badge-xs capitalize mt-1 ${
                        user.role === 'admin' ? 'badge-error' : 
                        user.role === 'moderator' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {user.role}
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Button Mobile */}
                {user && user?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="btn btn-ghost btn-block justify-start hover:bg-base-200 transition-colors flex items-center gap-3"
                    onClick={handleNavClick}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Panel
                  </Link>
                )}

                {/* Logout Button Mobile */}
                <button 
                  onClick={logout} 
                  className="btn btn-ghost btn-block justify-start hover:bg-error hover:text-error-content transition-colors flex items-center gap-3 text-error"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}