'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@/contexts/UserContext' // Adjust to your user context/hook path

const Profile: React.FC = () => {
  const { user, updateUser } = useUser()

  // Local state for form fields
  const [form, setForm] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
  })

  // Sync user data into form when user changes
  useEffect(() => {
    if (user) {
      setForm({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateUser(form)
    alert('Profile saved!')
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="container py-4">
      <h2>Profile</h2>
      <form onSubmit={saveProfile}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            name="firstName"
            id="firstName"
            type="text"
            className="form-control"
            value={form.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            name="lastName"
            id="lastName"
            type="text"
            className="form-control"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  )
}

export default Profile
