'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import apiClient from '../lib/api-client'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  shopName: string
  image?: string
}

interface ProductContextType {
  products: Product[]
  loading: boolean
  error: string | null
  refreshProducts: () => Promise<void>
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: true,
  error: null,
  refreshProducts: async () => {}
})

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get<Product[]>('/api/products')
      setProducts(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <ProductContext.Provider value={{ products, loading, error, refreshProducts: fetchProducts }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductContext)
}
