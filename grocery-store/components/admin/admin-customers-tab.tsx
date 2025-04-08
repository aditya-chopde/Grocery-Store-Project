"use client"

import { useState } from "react"
import { Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Mock customers data
const customers = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    orders: 12,
    totalSpent: 456.78,
    status: "active",
    joinDate: "2023-01-15",
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543",
    orders: 8,
    totalSpent: 324.5,
    status: "active",
    joinDate: "2023-02-20",
  },
  {
    id: "CUST-003",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "+1 (555) 456-7890",
    orders: 5,
    totalSpent: 189.99,
    status: "inactive",
    joinDate: "2023-03-10",
  },
  {
    id: "CUST-004",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 (555) 234-5678",
    orders: 15,
    totalSpent: 678.25,
    status: "active",
    joinDate: "2023-01-05",
  },
  {
    id: "CUST-005",
    name: "Michael Wilson",
    email: "michael@example.com",
    phone: "+1 (555) 876-5432",
    orders: 3,
    totalSpent: 124.75,
    status: "active",
    joinDate: "2023-04-18",
  },
]

export default function AdminCustomersTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof customers)[0] | null>(null)

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle view customer details
  const handleViewCustomer = (customer: (typeof customers)[0]) => {
    setSelectedCustomer(customer)
    setIsViewDialogOpen(true)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Manage Customers</h2>
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search customers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{getStatusBadge(customer.status)}</TableCell>
                <TableCell className="text-right">{customer.orders}</TableCell>
                <TableCell className="text-right">${customer.totalSpent.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleViewCustomer(customer)}>
                    <User className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No customers found. Try adjusting your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Customer Dialog */}
      {selectedCustomer && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>View detailed information about this customer.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-800">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedCustomer.name}</h3>
                  <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Customer ID</h4>
                  <p>{selectedCustomer.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Join Date</h4>
                  <p>{selectedCustomer.joinDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p>{selectedCustomer.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="mt-1">{getStatusBadge(selectedCustomer.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h4>
                  <p className="text-2xl font-bold">{selectedCustomer.orders}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Total Spent</h4>
                  <p className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span>Placed order #ORD-123</span>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span>Updated account details</span>
                    <span className="text-sm text-gray-500">1 week ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span>Placed order #ORD-122</span>
                    <span className="text-sm text-gray-500">2 weeks ago</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

