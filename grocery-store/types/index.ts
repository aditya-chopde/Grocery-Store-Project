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
  stock: number
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

// Order types
export interface OrderItem {
  productId: Product
  quantity: number
  price: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
}

export interface Order {
  _id: string
  email: string
  products: OrderItem[]
  totalPrice: number
  shippingAddress: ShippingAddress
  paymentMethod: string
  status: string
  createdAt: string
  updatedAt: string
}
