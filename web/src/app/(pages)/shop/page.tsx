"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/modules/products/components/product-grid";
import { getProducts } from "@/modules/products/api/get-products";
import { Product } from "@/types";

export default function Home() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(searchParams.get('page')) || 1;
  });

  useEffect(() => {
    async function fetchProducts() {
      const { items, pages } = await getProducts(currentPage, 10);
      setProducts(items);
      setPages(pages);
    }
    fetchProducts();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.history.pushState(null, '', `/shop/?page=${newPage}`);
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Latest Products</h1>

        <ProductGrid products={products} />

        {/* პაგინაცია */}
        {pages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {pages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(Math.min(pages, currentPage + 1))}
              disabled={currentPage === pages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
