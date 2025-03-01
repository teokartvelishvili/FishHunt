"use client";

import { ProductsList } from "@/modules/admin/components/products-list";

export default function AdminProductsPage() {
  return (
    <div className="admin-products-container">
      <div className="products-content">
        <ProductsList />
      </div>
    </div>
  );
}
