'use client'
import { Toaster } from '../components/ui/sonner'
import { ThemeProvider } from '../components/theme-provider'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { CartProvider } from '../context/cart-context'
import { AuthProvider } from '../context/auth-context'
import { ProductProvider } from '../context/product-context'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <ProductProvider>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </ProductProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
