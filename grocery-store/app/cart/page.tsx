"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, LogIn, MapPin } from "lucide-react";

// Import from local paths
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { useCart, type CartItem } from "../../context/cart-context";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from "../../context/auth-context";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <LogIn className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">
          Please login to view your cart
        </h1>
        <p className="text-gray-500 mb-8">
          You need to be logged in to access your shopping cart.
        </p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/auth/login">Login Now</Link>
        </Button>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cart.reduce(
    (total: number, item: CartItem) =>
      total + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  // Handle quantity update
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    updateQuantity(productId, newQuantity);
    setIsUpdating(false);
  };

  // Handle remove item
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };

  // Handle clear cart
  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item: CartItem) => (
            <Card key={item.product._id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 rounded-md overflow-hidden">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>{item.product.shopName || "Our Store"}</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {item.product.category}
                    </p>
                    <p className="font-bold text-green-600 mt-1">
                      ₹{item.product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1 || isUpdating}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                        disabled={isUpdating}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 mt-2"
                      onClick={() => handleRemoveItem(item.product._id)}
                      disabled={isUpdating}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleClearCart}
              disabled={isUpdating}
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isUpdating}
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
