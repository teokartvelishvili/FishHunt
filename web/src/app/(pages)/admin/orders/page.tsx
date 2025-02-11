import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { OrdersList } from "@/modules/admin/components/orders-list";
import { Order } from "@/types/order";

export default async function AdminOrdersPage() {
  const orders = await fetchWithAuth("/orders");
  const ordersData: Order[] = await orders.json();

  return (
    <div>
      <div className="py-10">
        <OrdersList orders={ordersData} />
      </div>
    </div>
  );
}
