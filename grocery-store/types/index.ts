// Product type
export interface Product {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  category: string
  image: string
  featured?: boolean
}

// Category type
export interface Category {
  id: string
  name: string
  image: string
}

