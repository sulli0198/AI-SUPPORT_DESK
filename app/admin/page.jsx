'use client'
import { useEffect, useState } from 'react'
import CheckAuth from '@/components/CheckAuth'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ role: '', skills: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, admins: 0, moderators: 0, users: 0 })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const res = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (res.ok) {
        setUsers(data)
        setFilteredUsers(data)
        calculateStats(data)
      } else {
        console.error(data.error)
      }
    } catch (err) {
      console.error('Error fetching users', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (users) => {
    const stats = {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      moderators: users.filter(u => u.role === 'moderator').length,
      users: users.filter(u => u.role === 'user').length
    }
    setStats(stats)
  }

  const handleEditClick = (user) => {
    setEditingUser(user.email)
    setFormData({
      role: user.role || 'user',
      skills: user.skills?.join(', ') || '',
    })
  }

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: editingUser,
          role: formData.role,
          skills: formData.skills
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to update user')
        return
      }

      setEditingUser(null)
      setFormData({ role: '', skills: '' })
      fetchUsers()
    } catch (err) {
      alert('Update failed')
      console.error('Update failed', err)
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    setFilteredUsers(
      users.filter((user) => user.email.toLowerCase().includes(query))
    )
  }

  const getRoleColor = (role) => {
    const colors = {
      admin: 'badge-error',
      moderator: 'badge-warning',
      user: 'badge-info'
    }
    return colors[role] || 'badge-neutral'
  }

  if (loading) {
    return (
      <CheckAuth protected={true}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-gray-400 mt-4">Loading admin panel...</p>
          </div>
        </div>
      </CheckAuth>
    )
  }

  return (
    <CheckAuth protected={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            </div>
            <p className="text-gray-400">Manage users and their permissions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card bg-base-300 border border-gray-700">
              <div className="card-body p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Users</div>
              </div>
            </div>
            <div className="card bg-base-300 border border-gray-700">
              <div className="card-body p-4 text-center">
                <div className="text-2xl font-bold text-error">{stats.admins}</div>
                <div className="text-sm text-gray-400">Admins</div>
              </div>
            </div>
            <div className="card bg-base-300 border border-gray-700">
              <div className="card-body p-4 text-center">
                <div className="text-2xl font-bold text-warning">{stats.moderators}</div>
                <div className="text-sm text-gray-400">Moderators</div>
              </div>
            </div>
            <div className="card bg-base-300 border border-gray-700">
              <div className="card-body p-4 text-center">
                <div className="text-2xl font-bold text-info">{stats.users}</div>
                <div className="text-sm text-gray-400">Users</div>
              </div>
            </div>
          </div>

          {/* Search and User List */}
          <div className="card bg-base-300 shadow-xl border border-gray-700">
            <div className="card-body">
              {/* Search Bar */}
              <div className="form-control">
                <div className="relative">
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 bg-base-200 border-gray-600 text-white placeholder-gray-500"
                    placeholder="Search users by email..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>

              {/* Users List */}
              <div className="space-y-4 mt-6">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="card bg-base-200 border border-gray-600 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
                  >
                    <div className="card-body p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white text-lg break-words">
                                {user.email}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <div className={`badge ${getRoleColor(user.role)} badge-lg capitalize`}>
                                  {user.role || 'user'}
                                </div>
                                {user.createdAt && (
                                  <span className="text-xs text-gray-500">
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Skills */}
                          {user.skills && user.skills.length > 0 && (
                            <div className="mt-3">
                              <label className="text-sm text-gray-400 font-medium mb-2 block">Skills</label>
                              <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill, index) => (
                                  <span key={index} className="badge badge-primary badge-sm bg-primary/80 text-white border-0">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Edit Section */}
                        <div className="lg:w-64">
                          {editingUser === user.email ? (
                            <div className="space-y-3">
                              <select
                                className="select select-bordered w-full bg-base-300 border-gray-600 text-white"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                              >
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                              </select>

                              <input
                                type="text"
                                placeholder="Skills (comma separated)"
                                className="input input-bordered w-full bg-base-300 border-gray-600 text-white placeholder-gray-500"
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                              />

                              <div className="flex gap-2">
                                <button
                                  className="btn btn-success btn-sm flex-1"
                                  onClick={handleUpdate}
                                >
                                  Save
                                </button>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => setEditingUser(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="btn btn-primary w-full lg:w-auto"
                              onClick={() => handleEditClick(user)}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit User
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <p className="text-gray-400 text-lg">No users found</p>
                    <p className="text-gray-600 text-sm mt-2">
                      {searchQuery ? 'Try a different search term' : 'No users in the system'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CheckAuth>
  )
}