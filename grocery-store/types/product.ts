export interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  shopName: string
  image?: string
  createdAt?: string
  updatedAt?: string
  featured?: boolean
}

export interface Category {
  id: string
  name: string
}

export interface ApiResponse<T> {
  data: T
  status: number
  statusText: string
  headers: any
  config: any
}
