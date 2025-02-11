
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { AdminOrderDetails } from '@/modules/admin/components/admin-order-details';
import { Order } from '@/types/order';

interface AdminOrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const { id } = await params;
  const response = await fetchWithAuth(`/orders/${id}`);
  const order: Order = await response.json();

  return (
    <div className='orderPage'>
      <div className="max-w-7xl mx-auto py-10">
        <AdminOrderDetails order={order} />
      </div>
    </div>
  );
}
