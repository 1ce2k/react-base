// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      router.push('/')
    } catch(e) {
      alert('Login failed: ' + e)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <form className="w-100" style={{ maxWidth: 400 }} onSubmit={handleSubmit}>
        <h3 className="mb-3">Login</h3>
        <input
          className="form-control mb-2"
          placeholder="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-control mb-3"
          placeholder="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
    </div>
  )
}
