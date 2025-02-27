export const dynamic = "force-dynamic";

import { OrderHistory } from "@/modules/profile/components/order-history";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { Order } from "@/types/order";

export default async function OrderHistoryPage() {
  const response = await fetchWithAuth("/orders/myorders");
  const orders: Order[] = await response.json();

  return (
    <div className="">
      <div className="max-w-7xl mx-auto py-10">
        <OrderHistory orders={orders} />
      </div>
    </div>
  );
}
