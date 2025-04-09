"use client";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { Order } from "@/types";
import { OrderCard } from "@/components/order-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const dataOfUser = localStorage.getItem("user");
        const user = JSON.parse(dataOfUser || "");
        const userEmail = user.email;
        
        if (!userEmail) {
          throw new Error("User email not found");
        }

        const response = await apiClient.get<{ orders: Order[] }>(
          `/api/orders/user/${userEmail}`
        );
        // Ensure each item has a status
        const ordersWithStatus = response.data.orders.map(order => ({
          ...order,
          products: order.products.map(item => ({
            ...item,
            status: item.status || 'pending'
          }))
        }));
        setOrders(ordersWithStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container py-8 w-[75%] mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
