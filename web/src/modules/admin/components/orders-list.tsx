"use client";

import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { Order } from "@/types/order";
import "./orders-list.css";

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const { toast } = useToast();
  const router = useRouter();

  const markAsDelivered = async (orderId: string) => {
    try {
      await apiClient.put(`/orders/${orderId}/deliver`);
      toast({
        title: "Success",
        description: "Order marked as delivered",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to mark order as delivered",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">Orders</h1>
      </div>
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th className="orders-actions">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="order-id">#{order._id}</td>
              <td>{order.user.email}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>
                {order.isPaid ? (
                  <span className="order-badge paid">
                    <CheckCircle2 className="icon" />
                    {new Date(order.paidAt!).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="order-badge not-paid">
                    <XCircle className="icon" />
                    Not Paid
                  </span>
                )}
              </td>
              <td>
                {order.isDelivered ? (
                  <span className="order-badge delivered">
                    <CheckCircle2 className="icon" />
                    {new Date(order.deliveredAt!).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="order-badge not-delivered">
                    <XCircle className="icon" />
                    Not Delivered
                  </span>
                )}
              </td>
              <td className="orders-actions">
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="order-view-button"
                >
                  View
                </Link>
                {order.isPaid && !order.isDelivered && (
                  <button
                    className="order-deliver-button"
                    onClick={() => markAsDelivered(order._id)}
                  >
                    Mark Delivered
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
