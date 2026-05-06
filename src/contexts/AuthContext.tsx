import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored authentication on mount
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // TODO: Replace with actual API call
    // For MVP, we'll simulate authentication
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful login
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
        }
        setUser(mockUser)
        localStorage.setItem('user', JSON.stringify(mockUser))
        resolve()
      }, 500)
    })
  }

  const signup = async (name: string, email: string, password: string) => {
    // TODO: Replace with actual API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          email,
          name,
        }
        setUser(mockUser)
        localStorage.setItem('user', JSON.stringify(mockUser))
        resolve()
      }, 500)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}



