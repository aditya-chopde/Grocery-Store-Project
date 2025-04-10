import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FeaturedProducts from "@/components/featured-products"
import CategoryList from "@/components/category-list"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent z-10" />
        <Image
          src="/hero_image.jpg?height=500&width=1200"
          alt="Fresh groceries delivered to your door"
          width={1200}
          height={500}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute top-0 left-0 z-20 p-8 md:p-12 flex flex-col h-full justify-center max-w-lg">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Fresh Groceries Delivered to Your Door
          </h1>
          <p className="text-white/90 mb-6 text-sm md:text-base">
            Shop from our wide selection of fresh produce, pantry staples, and household essentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              View Deals
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {/* <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link href="/products" className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <CategoryList />
      </section> */}

      {/* Featured Products Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <FeaturedProducts />
      </section>

      {/* Promo Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Free delivery on orders over $50"
              width={600}
              height={300}
              className="w-full h-[200px] object-cover"
            />
            <div className="absolute top-0 left-0 z-20 p-6 flex flex-col h-full justify-center">
              <h3 className="text-xl font-bold text-white mb-2">Free Delivery</h3>
              <p className="text-white/90 text-sm mb-4">On orders over $50</p>
              <Button
                variant="outline"
                size="sm"
                className="w-fit bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Shop Now
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-900/70 to-transparent z-10" />
            <Image
              src="/placeholder.svg?height=300&width=600"
              alt="20% off fresh produce"
              width={600}
              height={300}
              className="w-full h-[200px] object-cover"
            />
            <div className="absolute top-0 left-0 z-20 p-6 flex flex-col h-full justify-center">
              <h3 className="text-xl font-bold text-white mb-2">20% Off Fresh Produce</h3>
              <p className="text-white/90 text-sm mb-4">Limited time offer</p>
              <Button
                variant="outline"
                size="sm"
                className="w-fit bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                View Deals
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* App Download Section */}
      <section className="bg-green-50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 md:mr-6">
          <h2 className="text-2xl font-bold mb-2">Download Our App</h2>
          <p className="text-gray-600 mb-4 max-w-md">
            Get exclusive deals and track your orders in real-time with our mobile app.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-black hover:bg-black/80 text-white">
              <ShoppingBag className="mr-2 h-5 w-5" /> App Store
            </Button>
            <Button className="bg-black hover:bg-black/80 text-white">
              <ShoppingBag className="mr-2 h-5 w-5" /> Google Play
            </Button>
          </div>
        </div>
        <Image
          src="/logo.png?height=300&width=300"
          alt="Mobile app"
          width={300}
          height={300}
          className="w-full max-w-[200px] h-auto"
        />
      </section>
    </div>
  )
}

