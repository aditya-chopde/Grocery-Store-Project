"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { products } from "@/data/products"
import RelatedProducts from "@/components/related-products"

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)

  // Find the product by ID
  const product = products.find((p) => p.id === id)

  // Handle if product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/products")}>Back to Products</Button>
      </div>
    )
  }

  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</span>
            {product.oldPrice && <span className="text-gray-500 line-through">${product.oldPrice.toFixed(2)}</span>}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-4 font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={increaseQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" className="flex-1">
              <Heart className="mr-2 h-5 w-5" />
              Add to Wishlist
            </Button>
          </div>

          {/* Product Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Category:</span>
              <span>{product.category}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Availability:</span>
              <span className="text-green-600">In Stock</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">SKU:</span>
              <span>{product.id}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Facts</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="p-4">
          <h3 className="text-lg font-medium mb-2">Product Description</h3>
          <p className="text-gray-600">
            {product.description}
            {/* Extended description would go here */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl vel ultricies
            lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies
            lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
          </p>
        </TabsContent>
        <TabsContent value="nutrition" className="p-4">
          <h3 className="text-lg font-medium mb-2">Nutrition Information</h3>
          <div className="border rounded-md p-4">
            <div className="flex justify-between py-2 border-b">
              <span>Calories</span>
              <span>120</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Total Fat</span>
              <span>5g</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Sodium</span>
              <span>150mg</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Total Carbohydrates</span>
              <span>20g</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Protein</span>
              <span>3g</span>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="p-4">
          <h3 className="text-lg font-medium mb-2">Customer Reviews</h3>
          <p className="text-gray-600 mb-4">This product has 4 reviews with an average rating of 4.5 stars.</p>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">John D.</span>
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <p className="text-gray-600">Great product! Fresh and delicious.</p>
            </div>
            <div className="border-b pb-4">
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">Sarah M.</span>
                <span className="text-yellow-500">★★★★☆</span>
              </div>
              <p className="text-gray-600">Good quality but arrived a bit bruised.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </section>
    </div>
  )
}

