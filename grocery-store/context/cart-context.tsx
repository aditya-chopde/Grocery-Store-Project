"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "../types"
import { useToast } from "../components/ui/use-toast"
import { useAuth } from "./auth-context"

// Define and export cart item type
export interface CartItem {
  product: Product
  quantity: number
}

// Define cart context type
interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const { toast } = useToast()
  const { user } = useAuth()

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        localStorage.removeItem("cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Add product to cart
  const addToCart = (product: Product, quantity: number) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to add items to your cart",
        variant: "destructive"
      })
      return
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.product._id === product._id)

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += quantity
        return updatedCart
      } else {
        return [...prevCart, { product, quantity }]
      }
    })
  }

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to manage your cart",
        variant: "destructive"
      })
      return
    }
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId))
  }

  // Update product quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to manage your cart",
        variant: "destructive"
      })
      return
    }
    setCart((prevCart) => prevCart.map((item) => (item.product._id === productId ? { ...item, quantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to manage your cart",
        variant: "destructive"
      })
      return
    }
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
