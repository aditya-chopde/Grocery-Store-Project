"use client";

import { useState } from "react";
import { Eye, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import apiClient from "@/lib/api-client";

interface Order {
  _id: string;
  email: string;
  products: {
    productId: {
      _id: string;
      name: string;
      price: number;
      shopName: string;
    };
    quantity: number;
    status: string;
  }[];
  totalPrice: number;
  createdAt: string;
  status: string;
  shops: string[];
}

export default function AdminOrdersTab() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      // try {
      // let url = '/api/orders'
      // if (user?.role === 'shop') {
      const dataUser = localStorage.getItem("user");
      const user = JSON.parse(dataUser || "{}");
      const shopName = user.name;
      console.log(user);
      // For shop users, get their orders using the shop-specific endpoint
      const response = await apiClient.get(`/api/orders/shop/${shopName}`);
      console.log(response.data.orders);
      setOrders(response.data.orders || []);
      // } else {
      // For admins, get all orders
      // const { data } = await apiClient.get(url)
      // setOrders(data.orders || data.data?.orders || [])
      // }
      // } catch (error: any) {
      //   console.error('Error fetching orders:', error)
      //   toast({
      //     title: "Error",
      //     description: error.response?.data?.message || "Failed to fetch orders",
      //     variant: "destructive"
      //   })
      // } finally {
      setLoading(false);
      // }
    };

    fetchOrders();
  }, [user]);

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle view order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  // Handle update order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { data: updatedOrder } = await apiClient.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus }
      );

      setOrders(
        orders.map((order) =>
          order._id === orderId ? updatedOrder.order : order
        )
      );
      setIsViewDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  // Handle update item status
  const handleUpdateItemStatus = async (
    orderId: string,
    productId: string,
    newStatus: string
  ) => {
    try {
      const { data } = await apiClient.put(
        `/api/orders/${orderId}/items/${productId}/status`,
        {
          status: newStatus,
        }
      );

      // ✅ Fix: assume data contains the updated order directly
      const updatedOrder = data.order || data; // fallback in case it's directly returned

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );

      toast({
        title: "Status Updated",
        description: `Item status changed to ${newStatus}`,
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error updating item status:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update item status",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    // Normalize status to lowercase for comparison
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
      case "completed":
      case "complete":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "processing":
      case "process":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "shipped":
      case "ship":
        return <Badge className="bg-yellow-500">Shipped</Badge>;
      case "cancelled":
      case "cancel":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "pending":
        return <Badge className="bg-gray-500">Pending</Badge>;
      case "delivered":
        return <Badge className="bg-purple-500">Delivered</Badge>;
      default:
        console.warn("Unknown order status:", status);
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

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
              <TableRow key={order._id}>
                <TableCell className="font-medium">
                  {order._id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-500">{order.email}</p>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right">
                ₹{order.totalPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                  >
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
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>
                Order Details - {selectedOrder._id.substring(0, 8)}...
              </DialogTitle>
              <DialogDescription>
                View and manage order information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Customer Information
                  </h3>
                  <p className="text-sm">{selectedOrder.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Order Information
                  </h3>
                  <p className="font-medium">
                    Date: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm">Status:</p>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  {selectedOrder.shops && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-500">
                        Shops:
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedOrder.shops.map((shop) => (
                          <Badge key={shop} variant="outline">
                            {shop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Order Items
                </h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Shop</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.products.map((item) => (
                        <TableRow key={item.productId._id}>
                          <TableCell>{item.productId.name}</TableCell>
                          <TableCell>{item.productId.shopName}</TableCell>
                          <TableCell>
                            <Select
                              value={item.status}
                              onValueChange={(value) =>
                                handleUpdateItemStatus(
                                  selectedOrder._id,
                                  item.productId._id,
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">
                                  Processing
                                </SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">
                                  Delivered
                                </SelectItem>
                                <SelectItem value="cancelled">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{item.productId.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{(item.productId.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-right font-medium"
                        >
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ₹{selectedOrder.totalPrice.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Update Status
                </h3>
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
                    onClick={() =>
                      handleUpdateStatus(selectedOrder._id, "completed")
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Update
                  </Button>
                </div>
              </div> */}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
