"use client"

import { useState } from "react"
import { Eye, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

// Mock orders data
const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    date: "2023-06-15",
    total: 78.99,
    status: "completed",
    items: [
      { id: "1", name: "Organic Apples", price: 4.99, quantity: 2 },
      { id: "2", name: "Whole Grain Bread", price: 3.49, quantity: 1 },
      { id: "3", name: "Free Range Eggs", price: 5.99, quantity: 1 },
    ],
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2023-06-14",
    total: 45.5,
    status: "processing",
    items: [
      { id: "4", name: "Organic Milk", price: 3.99, quantity: 2 },
      { id: "5", name: "Fresh Strawberries", price: 6.99, quantity: 1 },
    ],
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    email: "robert@example.com",
    date: "2023-06-13",
    total: 124.75,
    status: "shipped",
    items: [
      { id: "6", name: "Grass-Fed Beef", price: 15.99, quantity: 2 },
      { id: "7", name: "Organic Spinach", price: 3.99, quantity: 1 },
      { id: "8", name: "Sourdough Bread", price: 4.99, quantity: 1 },
    ],
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    email: "emily@example.com",
    date: "2023-06-12",
    total: 67.25,
    status: "cancelled",
    items: [
      { id: "9", name: "Avocados", price: 6.99, quantity: 3 },
      { id: "10", name: "Organic Chicken", price: 12.99, quantity: 1 },
    ],
  },
  {
    id: "ORD-005",
    customer: "Michael Wilson",
    email: "michael@example.com",
    date: "2023-06-11",
    total: 89.99,
    status: "completed",
    items: [
      { id: "11", name: "Wild Salmon", price: 18.99, quantity: 1 },
      { id: "12", name: "Organic Broccoli", price: 3.99, quantity: 2 },
      { id: "13", name: "Almond Milk", price: 4.99, quantity: 1 },
    ],
  },
]

export default function AdminOrdersTab() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null)

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle view order details
  const handleViewOrder = (order: (typeof orders)[0]) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  // Handle update order status
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    toast({
      title: "Order status updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    })
    setIsViewDialogOpen(false)
  }

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>
      case "shipped":
        return <Badge className="bg-yellow-500">Shipped</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Manage Orders</h2>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search orders..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p>{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No orders found. Try adjusting your search or filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Order Dialog */}
      {selectedOrder && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
              <DialogDescription>View and manage order information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                  <p className="font-medium">{selectedOrder.customer}</p>
                  <p className="text-sm">{selectedOrder.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Information</h3>
                  <p className="font-medium">Date: {selectedOrder.date}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm">Status:</p>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">${selectedOrder.total.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Update Status</h3>
                <div className="flex gap-2">
                  <Select defaultValue={selectedOrder.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "completed")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

