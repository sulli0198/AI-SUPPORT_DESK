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

  if (loading)
    return <div className="text-center mt-10">Loading ticket details...</div>
  
  if (!ticket) 
    return <div className="text-center mt-10">Ticket not found</div>

  return (
    <CheckAuth protected={true}>
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>
        <div className="card bg-gray-800 shadow p-4 space-y-4">
          <h3 className="text-xl font-semibold">{ticket.title}</h3>
          <p>{ticket.description}</p>
          
          {ticket.status && (
            <>
              <div className="divider">Metadata</div>
              <p>
                <strong>Status:</strong> {ticket.status}
              </p>
              {ticket.priority && (
                <p>
                  <strong>Priority:</strong> {ticket.priority}
                </p>
              )}
              {ticket.relatedSkills?.length > 0 && (
                <p>
                  <strong>Related Skills:</strong>{' '}
                  {ticket.relatedSkills.join(', ')}
                </p>
              )}
              {ticket.helpfulNotes && (
                <div>
                  <strong>Helpful Notes:</strong>
                  <div className="prose max-w-none rounded mt-2">
                    <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
                  </div>
                </div>
              )}
              {ticket.assignedTo && (
                <p>
                  <strong>Assigned To:</strong> {ticket.assignee?.email}
                </p>
              )}
              {ticket.createdAt && (
                <p className="text-sm text-gray-500 mt-2">
                  Created At: {new Date(ticket.createdAt).toLocaleString()}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </CheckAuth>
  )
}