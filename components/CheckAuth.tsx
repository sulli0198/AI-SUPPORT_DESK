'use client'
import { useEffect, useState, ReactNode  } from 'react'
import { useRouter } from 'next/navigation'

interface CheckAuthProps {
  children: ReactNode
  protected: boolean
}

export default function CheckAuth({ children, protected: protectedRoute }: CheckAuthProps ) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (protectedRoute) {
      // Protected route - requires login
      if (!token) {
        router.push('/login')
      } else {
        setLoading(false)
      }
    } else {
      // Public route - requires logout  
      if (token) {
        router.push('/tickets')  // Changed from '/' to '/tickets'
      } else {
        setLoading(false)
      }
    }
  }, [router, protectedRoute])
  

  if (loading) {
    return <div>Loading...</div>
  }
  
  return children
}