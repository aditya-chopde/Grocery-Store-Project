'use client'

import { ShoppingBag, Leaf, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">About Our Grocery Store</h1>
        <p className="text-lg text-gray-600">
          We're committed to bringing you the freshest, highest quality groceries while supporting local farmers and producers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <ShoppingBag className="h-10 w-10 mx-auto mb-4 text-green-600" />
          <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
          <p className="text-gray-600">
            10,000+ products from local and international brands
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <Leaf className="h-10 w-10 mx-auto mb-4 text-green-600" />
          <h3 className="text-xl font-semibold mb-2">Fresh & Organic</h3>
          <p className="text-gray-600">
            Sourced daily from trusted local farmers
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <Truck className="h-10 w-10 mx-auto mb-4 text-green-600" />
          <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p className="text-gray-600">
            Same-day delivery available in most areas
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <Shield className="h-10 w-10 mx-auto mb-4 text-green-600" />
          <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
          <p className="text-gray-600">
            100% satisfaction or your money back
          </p>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
        <p className="text-gray-700 mb-4">
          Founded in 2020, we started as a small local market with a mission to make fresh, healthy groceries accessible to everyone. 
          Today, we've grown into a trusted online grocery service while staying true to our roots.
        </p>
        <p className="text-gray-700">
          We partner directly with farmers and producers to bring you the best quality at fair prices, while supporting our local community.
        </p>
      </div>
    </div>
  )
}
