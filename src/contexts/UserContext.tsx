'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import api from '@/services/apiClient'
import { useAuth } from './AuthContext'

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type UserContextType = {
  user: User | null
  loading: boolean
  fetchUser: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
  clearUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user on auth.jwt change
  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.jwt) {
        setUser(null)
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const res = await api.get<User>('/user/me')
        setUser(res.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [auth.jwt])

  const fetchUser = async () => {
    if (!auth.jwt) throw new Error('Not authenticated')
    const res = await api.get<User>('/user/me')
    setUser(res.data)
  }

  const updateUser = async (data: Partial<User>) => {
    if (!auth.jwt) throw new Error('Not authenticated')
    const res = await api.put<User>(`/user/updateUser/${user?.id}`, data)
    setUser(res.data)
  }

  const clearUser = () => setUser(null)

  return (
    <UserContext.Provider
      value={{ user, loading, fetchUser, updateUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
