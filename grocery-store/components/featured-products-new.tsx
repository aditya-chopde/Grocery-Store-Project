'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import ProductCard from '../components/product-card'
import { useProducts } from '../context/product-context'
import type { BaseProduct, Product } from '../types'

export default function FeaturedProducts() {
  const { products: baseProducts, loading } = useProducts()
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(4)

  // Get featured products from context
  const featuredProducts = (baseProducts as BaseProduct[])
    .filter((p): p is Product => 
      p.featured === true && 
      typeof p.image === 'string' && 
      p.image.length > 0 &&
      typeof p.shopName === 'string'
    )
    .slice(0, 8)
  
  const totalPages = Math.ceil(featuredProducts.length / itemsPerPage)
  const currentProducts = featuredProducts.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  )

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1)
      else if (window.innerWidth < 768) setItemsPerPage(2)
      else if (window.innerWidth < 1024) setItemsPerPage(3)
      else setItemsPerPage(4)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const nextPage = () => setCurrentPage(prev => (prev + 1) % totalPages)
  const prevPage = () => setCurrentPage(prev => (prev - 1 + totalPages) % totalPages)

  if (loading) return <div>Loading featured products...</div>

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button variant="outline" size="icon" onClick={prevPage} className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i ? 'default' : 'outline'}
                size="icon"
                onClick={() => setCurrentPage(i)}
                className={`w-8 h-8 ${currentPage === i ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={nextPage} className="rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
