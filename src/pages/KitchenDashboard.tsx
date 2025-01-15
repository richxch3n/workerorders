import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChefHat, Clock, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Database } from '../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    meal: Database['public']['Tables']['meals']['Row']
  })[];
};

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            meal:meals (*)
          )
        `)
        .order('pickup_time', { ascending: true });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: Order['status']) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            Kitchen Dashboard
          </h2>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              Pending
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              Preparing
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              Ready
            </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No orders at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`border rounded-lg overflow-hidden ${
                  order.status === 'pending'
                    ? 'border-yellow-400'
                    : order.status === 'preparing'
                    ? 'border-blue-400'
                    : 'border-green-400'
                }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{order.user_name}</h3>
                      <p className="text-gray-600">Room: {order.room_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Pickup: {new Date(order.pickup_time).toLocaleTimeString()}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          order.status === 'pending'
                            ? 'text-yellow-600'
                            : order.status === 'preparing'
                            ? 'text-blue-600'
                            : 'text-green-600'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span>
                          {item.quantity}x {item.meal.name}
                        </span>
                        <span className="text-gray-600">
                          ${typeof item.meal.price === 'number' ? item.meal.price.toFixed(2) : '0.00'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.special_instructions && (
                    <p className="text-sm text-gray-600 mb-4">
                      Note: {order.special_instructions}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'picked_up')}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <XCircle className="h-4 w-4" />
                        Mark Picked Up
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}