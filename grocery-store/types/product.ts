export interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock?: number
  oldPrice?: number
  category: string
  shopName: string
  shopLocation?: {
    latitude: number
    longitude: number
  }
  image: string
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
