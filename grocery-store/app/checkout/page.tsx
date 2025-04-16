"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/cart-context";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/context/auth-context";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailClient, setEmailClient] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");

  // Must be declared outside conditional render
  const [orderError, setOrderError] = useState<string | null>(null);

  const fetchAddressDetails = async (email: string) => {
    await apiClient.get(`/api/orders/get/address/${email}`).then((data) => {
      console.log(data);
      if (data.success === true) {
        const addressDetails = data.address;
        console.log(addressDetails);
        setFirstName(addressDetails.firstName);
        setLastName(addressDetails.lastName);
        setStreetAddress(addressDetails.streetAddress);
        setApartment(addressDetails.apartment || "");
        setCity(addressDetails.city);
        setState(addressDetails.state);
        setZipCode(addressDetails.zipCode);
        setPhone(addressDetails.phone || "");
      } else {
        console.log("Address Not Found");
      }
    });
  };

  useEffect(() => {
    if (user?.email) {
      setEmailClient(user.email);
      fetchAddressDetails(user.email); // update to pass email
    }
  }, [user]);

  const email = user?.email || "";

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.post("/api/orders", {
        email,
        products: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          status: "pending",
        })),
        totalPrice: total,
        shippingAddress: {
          firstName: firstName,
          lastName: lastName,
          address: streetAddress,
          city: city,
          state: state,
          zipCode: zipCode,
        },
        paymentMethod: "card",
      });

      const setAddress = await apiClient.post("/api/orders/add/address", {
        firstName,
        lastName,
        email,
        phone,
        streetAddress,
        apartment,
        city,
        state,
        zipCode,
      });
      console.log(setAddress);

      await clearCart();
      router.push("/checkout/success");
    } catch (error: any) {
      if (error.response?.data?.message?.includes("insufficient stock")) {
        const outOfStockItems = error.response.data.outOfStockItems || [];
        toast({
          title: "Insufficient Stock",
          description: (
            <div className="space-y-2">
              <p>
                Some items in your cart are no longer available in the requested
                quantities:
              </p>
              <ul className="list-disc pl-5">
                {outOfStockItems.map((item: any) => (
                  <li key={item.productId}>
                    {item.productName} - Only {item.availableStock} available
                  </li>
                ))}
              </ul>
              <p>Please adjust your quantities and try again.</p>
            </div>
          ),
          variant: "destructive",
          duration: 10000,
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred while processing your order",
          variant: "destructive",
        });
      }

      setOrderError(`Order submission error: ${error.message}`);
      console.error("Order submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to checkout</h1>
        <p className="text-gray-500 mb-8">
          You need to be logged in to complete your purchase.
        </p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/auth/login">Login Now</Link>
        </Button>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">
          You need to add items to your cart before checking out.
        </p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Contact Information */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={emailClient}
                      onChange={(e) => setEmailClient(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartment">
                      Apartment, suite, etc. (optional)
                    </Label>
                    <Input
                      id="apartment"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        required
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Method</h2>
                <RadioGroup defaultValue="standard">
                  <div className="flex items-center justify-between border rounded-md p-4 mb-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard">
                        Standard Shipping (3-5 business days)
                      </Label>
                    </div>
                    <span>
                      {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border rounded-md p-4 mb-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express">
                        Express Shipping (1-2 business days)
                      </Label>
                    </div>
                    <span>₹12.99</span>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <Tabs defaultValue="card">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="card">Credit Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    <TabsTrigger value="apple">Apple Pay</TabsTrigger>
                  </TabsList>
                  <TabsContent value="card" className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input id="nameOnCard" required />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="paypal" className="pt-4">
                    <div className="text-center p-6">
                      <p className="mb-4">
                        You will be redirected to PayPal to complete your
                        payment.
                      </p>
                      <Button className="w-full">Continue with PayPal</Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="apple" className="pt-4">
                    <div className="text-center p-6">
                      <p className="mb-4">
                        You will be redirected to Apple Pay to complete your
                        payment.
                      </p>
                      <Button className="w-full bg-black hover:bg-black/80">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay with Apple Pay
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : `Complete Order • ₹${total.toFixed(2)}`}
            </Button>
          </form>
          {orderError && (
            <div className="mb-6 rounded-md my-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3">
              {orderError}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-4">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <Image
                        src={
                          item.product.image ||
                          "/placeholder.svg?height=60&width=60"
                        }
                        alt={item.product.name}
                        width={60}
                        height={60}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.product.name}</span>
                        <span>
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo */}
              <div className="mt-6 bg-green-50 p-3 rounded-md flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    Free shipping on orders over ₹50
                  </p>
                  <p className="text-xs text-gray-600">
                    Your order qualifies for free shipping!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
