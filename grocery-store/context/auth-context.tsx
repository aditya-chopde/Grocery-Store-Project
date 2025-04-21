"use client"

import { useRouter } from "next/router"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define user type
interface User {
  email: string
  name: string
  role: "user" | "admin" | "shop"
  token: string
}

// Define auth context type
interface AuthContextType {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  register: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Load user and token from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const savedToken = localStorage.getItem("token")
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
        setToken(savedToken)
      } catch (error) {
        console.error("Failed to parse auth data:", error)
        clearAuthData()
      }
    }
  }, [])

  // Clear auth data
  const clearAuthData = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
  }

  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    if (!token || !user) return false
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }

  // Login function
  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", authToken)
  }

  // Register function
  const register = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", authToken)
  }

  // Logout function
  const logout = () => {
    clearAuthData()
    const router = useRouter();
    router.push("/auth/login");
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token,
        login, 
        register, 
        logout,
        isAuthenticated 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

