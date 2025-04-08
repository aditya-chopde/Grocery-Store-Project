"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { products } from "@/data/products"

export default function FeaturedProducts() {
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(4)

  // Get featured products
  const featuredProducts = products.filter((product) => product.featured).slice(0, 8)

  // Calculate total pages
  const totalPages = Math.ceil(featuredProducts.length / itemsPerPage)

  // Get current products
  const currentProducts = featuredProducts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  // Handle window resize to adjust items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1)
      } else if (window.innerWidth < 768) {
        setItemsPerPage(2)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(3)
      } else {
        setItemsPerPage(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle page change
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Navigation Buttons */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button variant="outline" size="icon" onClick={prevPage} className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(index)}
                className={`w-8 h-8 ${currentPage === index ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={nextPage} className="rounded-full">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}
    </div>
  )
}

