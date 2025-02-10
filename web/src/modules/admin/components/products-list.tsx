"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { ProductsActions } from "./products-actions";
import { Sparkles, Plus } from "lucide-react";
import "./productList.css";

interface ProductsListProps {
  products: Product[];
}

export function ProductsList({ products }: ProductsListProps) {
  return (
    <div className="prd-card">
      <div className="prd-header">
        <h1 className="prd-title">Products</h1>
        <div className="prd-actions">
          <Link href="/admin/products/create">
            <button className="prd-btn-outline">
              <Plus className="prd-icon" />
              Add Product
            </button>
          </Link>
          <Link href="/admin/products/ai">
            <button className="prd-btn">
              <Sparkles className="prd-icon" />
              Create Products with AI
            </button>
          </Link>
        </div>
      </div>
      <table className="prd-table">
        <thead>
          <tr className="prd-thead-row">
            <th className="prd-th">ID</th>
            <th className="prd-th">IMAGE</th>
            <th className="prd-th">NAME</th>
            <th className="prd-th">PRICE</th>
            <th className="prd-th">CATEGORY</th>
            <th className="prd-th">STOCK</th>
            <th className="prd-th prd-th-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="prd-tr">
              <td className="prd-td prd-td-bold">#{product._id}</td>
              <td className="prd-td">
                <div className="prd-img-wrapper">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="prd-img"
                  />
                </div>
              </td>
              <td className="prd-td">{product.name}</td>
              <td className="prd-td">${product.price}</td>
              <td className="prd-td">{product.category}</td>
              <td className="prd-td">{product.countInStock}</td>
              <td className="prd-td prd-td-right">
                <ProductsActions product={product} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
