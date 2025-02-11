import { OrderDetails } from "@/modules/orders/components/order-details";
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { Order } from "@/types/order";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const response = await fetchWithAuth(`/orders/${id}`);

  const order: Order = await response.json();

  return (
    <div className="Container">
      <div className="max-w-7xl mx-auto py-10">
        <OrderDetails order={order} />
      </div>
    </div>
  );
}
