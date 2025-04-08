import ProductCard from "@/components/product-card"
import { products } from "@/data/products"

interface RelatedProductsProps {
  currentProductId: string
  category: string
}

export default function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  // Get related products (same category, different ID)
  const relatedProducts = products
    .filter((product) => product.category === category && product.id !== currentProductId)
    .slice(0, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

