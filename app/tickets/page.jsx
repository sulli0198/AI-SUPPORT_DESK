'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import CheckAuth from '@/components/CheckAuth'

export default function TicketsPage() {
  const [form, setForm] = useState({ title: '', description: '' })
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/tickets', {
        headers: { Authorization: `Bearer ${token}` },
        method: 'GET',
      })
      const data = await res.json()
      setTickets(data || [])
    } catch (err) {
      console.error('Failed to fetch tickets:', err)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setForm({ title: '', description: '' })
        fetchTickets()
      } else {
        alert(data.error || 'Ticket creation failed')
      }
    } catch (err) {
      alert('Error creating ticket')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      open: 'badge-success',
      in_progress: 'badge-warning',
      resolved: 'badge-info',
      closed: 'badge-neutral'
    }
    return colors[status] || 'badge-neutral'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'badge-outline',
      medium: 'badge-warning',
      high: 'badge-error',
      urgent: 'badge-error animate-pulse'
    }
    return colors[priority] || 'badge-outline'
  }

  return (
    <CheckAuth protected={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Support Tickets</h1>
            <p className="text-gray-400">Create and manage your support requests</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Create Ticket Form */}
            <div className="lg:col-span-1">
              <div className="card bg-base-300 shadow-xl border border-gray-700 sticky top-8">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h2 className="card-title text-white">Create New Ticket</h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300 font-semibold">Title</span>
                      </label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Brief description of your issue"
                        className="input input-bordered w-full bg-base-200 border-gray-600 text-white placeholder-gray-500"
                        required
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300 font-semibold">Description</span>
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Detailed description of the problem you're facing..."
                        className="textarea textarea-bordered w-full h-32 bg-base-200 border-gray-600 text-white placeholder-gray-500"
                        required
                      ></textarea>
                    </div>
                    
                    <button 
                      className="btn btn-primary w-full mt-4 py-3 font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Creating Ticket...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Submit Ticket
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Tickets List */}
            <div className="lg:col-span-2">
              <div className="card bg-base-300 shadow-xl border border-gray-700">
                <div className="card-body">
                  {/* Header with ticket count */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Your Tickets</h2>
                    <div className="badge badge-primary badge-lg">
                      {tickets.length} {tickets.length === 1 ? 'Ticket' : 'Tickets'}
                    </div>
                  </div>

                  {/* Tickets Grid */}
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <Link
                        key={ticket.id}
                        href={`/ticket/${ticket.id}`}
                        className="block transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="card bg-base-200 border border-gray-600 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
                          <div className="card-body p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-start gap-3 mb-2">
                                  <h3 className="font-bold text-lg text-white flex-1">
                                    {ticket.title}
                                  </h3>
                                  <div className="flex gap-2 flex-wrap">
                                    {ticket.status && (
                                      <div className={`badge ${getStatusColor(ticket.status)} badge-sm capitalize`}>
                                        {ticket.status.replace('_', ' ')}
                                      </div>
                                    )}
                                    {ticket.priority && (
                                      <div className={`badge ${getPriorityColor(ticket.priority)} badge-sm capitalize`}>
                                        {ticket.priority}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <p className="text-gray-400 line-clamp-2 mb-3">
                                  {ticket.description}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                  </span>
                                  {ticket.assignedModerator && (
                                    <span className="flex items-center gap-1">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      {ticket.assignedModerator.name}
                                    </span>
                                  )}
                                  {ticket.category && (
                                    <span className="badge badge-outline badge-sm">
                                      {ticket.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    
                    {tickets.length === 0 && (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-400 text-lg">No tickets yet</p>
                        <p className="text-gray-600 text-sm mt-2">
                          Create your first ticket to get started with AI-powered support!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CheckAuth>
  )
}