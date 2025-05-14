import { Metadata } from "next";
import { OrdersClient } from "./orders-client";

export const metadata: Metadata = {
  title: "Order History | Soul Art",
  description: "View your order history",
};

export default function OrdersPage() {
  return (
    <div className="container py-8">
      <OrdersClient />
    </div>
  );
}
