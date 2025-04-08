"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  // Handle quantity update with debounce
  const handleQuantityUpdate = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(true)
    updateQuantity(productId, newQuantity)

    // Simulate network request
    setTimeout(() => {
      setIsUpdating(false)
      toast({
        title: "Cart updated",
        description: "Your cart has been updated successfully",
      })
    }, 500)
  }

  // Handle item removal
  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId)
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart`,
    })
  }

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-medium">Cart Items ({cart.length})</h2>
            </div>

            {cart.map((item) => (
              <div key={item.product.id} className="p-4 border-b last:border-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={item.product.image || "/placeholder.svg?height=100&width=100"}
                      alt={item.product.name}
                      width={100}
                      height={100}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium hover:text-green-600 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <div className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</div>
                    </div>

                    <p className="text-gray-500 text-sm mb-4">{item.product.category}</p>

                    <div className="flex justify-between items-center">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleQuantityUpdate(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleQuantityUpdate(item.product.id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                clearCart()
                toast({
                  title: "Cart cleared",
                  description: "All items have been removed from your cart",
                })
              }}
            >
              Clear Cart
            </Button>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">We Accept</h3>
            <div className="flex gap-2">
              <div className="bg-white p-2 rounded border">
                <Image src="/placeholder.svg?height=30&width=40" alt="Visa" width={40} height={30} />
              </div>
              <div className="bg-white p-2 rounded border">
                <Image src="/placeholder.svg?height=30&width=40" alt="Mastercard" width={40} height={30} />
              </div>
              <div className="bg-white p-2 rounded border">
                <Image src="/placeholder.svg?height=30&width=40" alt="PayPal" width={40} height={30} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

