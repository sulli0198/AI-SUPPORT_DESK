'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import CheckAuth from '@/components/CheckAuth'

export default function TicketDetailsPage() {
  const params = useParams()
  const id = params.id
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/tickets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (res.ok) {
          setTicket(data.ticket)
        } else {
          alert(data.error || 'Failed to fetch ticket')
        }
      } catch (err) {
        console.error(err)
        alert('Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchTicket()
  }, [id])

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

  // Function to format long URLs in markdown content
  const formatHelpfulNotes = (notes) => {
    if (!notes) return notes;
    
    // Replace long URLs with shorter display text
    return notes.replace(
      /(https?:\/\/[^\s]+)/g, 
      (url) => {
        const displayText = '🔗 Resource Link';
        return `[${displayText}](${url})`;
      }
    );
  }

  if (loading) {
    return (
      <CheckAuth protected={true}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-gray-400 mt-4">Loading ticket details...</p>
          </div>
        </div>
      </CheckAuth>
    )
  }
  
  if (!ticket) {
    return (
      <CheckAuth protected={true}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">Ticket Not Found</h2>
            <p className="text-gray-400">The requested ticket could not be found.</p>
          </div>
        </div>
      </CheckAuth>
    )
  }

  return (
    <CheckAuth protected={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-4 px-3 sm:py-8 sm:px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-3xl font-bold text-white truncate">Ticket Details</h1>
              <p className="text-gray-400 text-sm sm:text-base truncate">Support request analysis and information</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Main Ticket Content */}
            <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
              {/* Ticket Card */}
              <div className="card bg-base-300 shadow-xl border border-gray-700">
                <div className="card-body p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-2xl font-bold text-white break-words min-w-0">
                      {ticket.title}
                    </h2>
                    <div className="flex gap-2 flex-wrap">
                      {ticket.status && (
                        <div className={`badge ${getStatusColor(ticket.status)} badge-sm sm:badge-lg capitalize truncate max-w-[120px] sm:max-w-none`}>
                          {ticket.status.replace('_', ' ')}
                        </div>
                      )}
                      {ticket.priority && (
                        <div className={`badge ${getPriorityColor(ticket.priority)} badge-sm sm:badge-lg capitalize`}>
                          {ticket.priority}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Description
                    </h3>
                    <div className="bg-base-200 rounded-lg p-3 sm:p-4 border border-gray-600">
                      <p className="text-gray-300 whitespace-pre-wrap text-sm sm:text-base break-words">
                        {ticket.description}
                      </p>
                    </div>
                  </div>

                  {/* Helpful Notes */}
                  {ticket.helpfulNotes && (
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        AI Analysis & Notes
                      </h3>
                      <div className="bg-base-200 rounded-lg p-3 sm:p-4 border border-gray-600">
                        <div className="prose prose-sm sm:prose-invert max-w-none text-sm sm:text-base break-words overflow-hidden">
                          <ReactMarkdown
                            components={{
                              a: ({node, ...props}) => (
                                <a 
                                  {...props} 
                                  className="text-primary hover:text-primary-focus break-all" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                />
                              ),
                              p: ({node, ...props}) => (
                                <p {...props} className="break-words overflow-hidden" />
                              )
                            }}
                          >
                            {formatHelpfulNotes(ticket.helpfulNotes)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Metadata */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="card bg-base-300 shadow-xl border border-gray-700 lg:sticky lg:top-8">
                <div className="card-body p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ticket Information
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="min-w-0">
                        <label className="text-xs sm:text-sm text-gray-400 font-medium block truncate">Status</label>
                        <div className={`badge ${getStatusColor(ticket.status)} w-full justify-center mt-1 text-xs truncate max-w-full`}>
                          {ticket.status?.replace('_', ' ') || 'Unknown'}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <label className="text-xs sm:text-sm text-gray-400 font-medium block truncate">Priority</label>
                        <div className={`badge ${getPriorityColor(ticket.priority)} w-full justify-center mt-1 text-xs truncate max-w-full`}>
                          {ticket.priority || 'Unknown'}
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    {ticket.category && (
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400 font-medium block">Category</label>
                        <div className="badge badge-outline w-full justify-center mt-1 text-xs truncate">
                          {ticket.category}
                        </div>
                      </div>
                    )}

                    {/* Related Skills */}
                    {ticket.relatedSkills?.length > 0 && (
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400 font-medium mb-1 block">
                          Related Skills
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {ticket.relatedSkills.map((skill, index) => (
                            <span 
                              key={index} 
                              className="badge badge-primary badge-xs text-xs truncate max-w-[100px] bg-primary/80 text-white border-0"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assigned Moderator */}
                    {ticket.assignedTo && (
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400 font-medium block">Assigned To</label>
                        <div className="flex items-center gap-2 mt-1 p-2 bg-base-200 rounded-lg">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-white text-xs sm:text-sm truncate min-w-0">{ticket.assignee?.email}</span>
                        </div>
                      </div>
                    )}

                    {/* Creation Date */}
                    {ticket.createdAt && (
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400 font-medium block">Created</label>
                        <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-300">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 ml-5 sm:ml-6">
                          {new Date(ticket.createdAt).toLocaleTimeString()}
                        </div>
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