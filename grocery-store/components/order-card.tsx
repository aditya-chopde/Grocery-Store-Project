import { Order } from '../types';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Order #{order._id.slice(-6).toUpperCase()}</h3>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'delivered' 
                ? 'bg-green-100 text-green-800' 
                : order.status === 'cancelled' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-blue-100 text-blue-800'
            }`}>
              {order.status}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t">
            <div className="space-y-4">
              {order.products.map((item) => (
                <div key={item.productId._id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <Image
                      src={item.productId.image || '/placeholder.jpg'}
                      alt={item.productId.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.productId.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : item.status === 'cancelled' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status || 'pending'}
                    </span>
                  </div>
                  <div className="font-medium">
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between mt-2 font-medium">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
