"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { deleteProduct } from "@/modules/admin/api/delete-product";
import type { Product } from "@/types";
import "./productActions.css";

interface ProductsActionsProps {
  product: Product;
}

export function ProductsActions({ product }: ProductsActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!product._id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid product ID. Please refresh the page.",
      });
      return;
    }

    if (confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(product._id);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    }
  };

  return (
    <div className="space-x-2">
      <button
        onClick={() => router.push(`/admin/products/${product._id}/edit`)}
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        className="text-red-500 hover:text-red-600"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
