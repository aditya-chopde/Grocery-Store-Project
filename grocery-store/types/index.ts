// Product type
export interface BaseProduct {
  _id: string
  id?: string
  name: string
  description: string
  price: number
  oldPrice?: number
  category: string
  image?: string
  featured?: boolean
  shopName?: string
}

export interface Product extends BaseProduct {
  image: string
  featured: boolean
  shopName: string
}

// Category type
export interface Category {
  id: string
  name: string
  image: string
}
