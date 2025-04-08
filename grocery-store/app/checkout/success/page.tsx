"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"

export default function OrderSuccessPage() {
  const router = useRouter()
  const { cart } = useCart()

  // Generate a random order number
  const orderNumber = Math.floor(100000 + Math.random() * 900000)

  // Redirect if no order was placed (cart is not empty)
  useEffect(() => {
    if (cart.length > 0) {
      router.push("/checkout")
    }
  }, [cart, router])

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h2 className="font-medium mb-2">Order Details</h2>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600">Processing</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            We've sent a confirmation email to your email address with all the details of your order. You can also track
            your order status in your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

