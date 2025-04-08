import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-xl font-bold text-green-600">
                Fresh<span className="text-gray-800 dark:text-white">Mart</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your one-stop shop for fresh groceries and household essentials. We deliver quality products right to your
              doorstep.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">123 Grocery St, Fresh City, FC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">support@freshmart.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex space-x-2">
              <Input placeholder="Your email" className="bg-white dark:bg-gray-800" />
              <Button className="bg-green-600 hover:bg-green-700">Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FreshMart. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/privacy" className="hover:text-green-600 dark:hover:text-green-500">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-green-600 dark:hover:text-green-500">
              Terms of Service
            </Link>
            <Link href="/shipping" className="hover:text-green-600 dark:hover:text-green-500">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

