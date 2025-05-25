'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const newErrors = {
      firstname: form.firstname.trim() ? '' : 'First name is required.',
      lastname: form.lastname.trim() ? '' : 'Last name is required.',
      email: /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Valid email is required.',
      password: form.password.length >= 8 ? '' : 'Password must be at least 8 characters.',
    }

    setErrors(newErrors)
    return Object.values(newErrors).every((err) => err === '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')

    if (!validate()) return

    setLoading(true)
    try {
      await register({
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        password: form.password,
      })
      router.push('/')
    } catch {
      setServerError('Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Register</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">First Name</label>
          <input
            name="firstname"
            id="firstname"
            type="text"
            className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
            value={form.firstname}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">{errors.firstname}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">Last Name</label>
          <input
            name="lastname"
            id="lastname"
            type="text"
            className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
            value={form.lastname}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">{errors.lastname}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            name="email"
            id="email"
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={form.email}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">{errors.email}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            name="password"
            id="password"
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <div className="invalid-feedback">{errors.password}</div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {serverError && <div className="alert alert-danger mt-3">{serverError}</div>}
    </div>
  )
}
