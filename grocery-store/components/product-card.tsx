'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin } from 'lucide-react'
import { Button } from './ui/button'
import { useCart } from '../context/cart-context'
import { useAuth } from '../context/auth-context'
import type { Product } from '../types'

interface ProductCardProps {
  product: {
    _id: string
    name: string
    description: string
    price: number
    stock: number
    oldPrice?: number
    category: string
    image: string
    featured?: boolean
    shopName?: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      category: product.category,
      image: product.image,
      featured: product.featured || false,
      shopName: product.shopName || ''
    }, 1)
  }

  return (
    <div className="group relative flex flex-col gap-4 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
      <Link href={`/products/${product._id}`} className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover transition-all group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{product.name}</h3>
          {product.shopName && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3 w-3" />
              <span>{product.shopName}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.8</span>
          </div>

          <div className="flex flex-col items-end">
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        <Button 
          onClick={(e) => {
            if (product.stock <= 0) {
              e.preventDefault()
              alert('This product is out of stock')
              return
            }
            handleAddToCart()
          }}
          disabled={!user || product.stock <= 0}
          className="mt-2 w-full"
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  )
}
