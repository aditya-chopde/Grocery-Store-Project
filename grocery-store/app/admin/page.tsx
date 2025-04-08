"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, Package, ShoppingCart, Users } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import AdminProductsTab from "@/components/admin/admin-products-tab"
import AdminOrdersTab from "@/components/admin/admin-orders-tab"
import AdminCustomersTab from "@/components/admin/admin-customers-tab"
import AdminDashboardTab from "@/components/admin/admin-dashboard-tab"

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuth()

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  // If no user or not admin, show loading
  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p>Checking permissions...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold">$12,426.50</h3>
                <p className="text-xs text-green-600 mt-1">+16% from last month</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold">142</h3>
                <p className="text-xs text-green-600 mt-1">+8% from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <h3 className="text-2xl font-bold">86</h3>
                <p className="text-xs text-green-600 mt-1">+12 new products</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <h3 className="text-2xl font-bold">2,845</h3>
                <p className="text-xs text-green-600 mt-1">+24 new customers</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdminDashboardTab />
        </TabsContent>

        <TabsContent value="products">
          <AdminProductsTab />
        </TabsContent>

        <TabsContent value="orders">
          <AdminOrdersTab />
        </TabsContent>

        <TabsContent value="customers">
          <AdminCustomersTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

