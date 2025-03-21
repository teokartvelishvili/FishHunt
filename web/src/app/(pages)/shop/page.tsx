"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/modules/products/components/product-grid";
import { getProducts } from "@/modules/products/api/get-products";
import { getVisiblePages } from "@/lib/utils";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["products", currentPage],
    queryFn: async () => {
      const response = await getProducts(currentPage, 10);
      return response;
    },
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.history.pushState(null, '', `/shop/?page=${newPage}`);
  };

  if (isLoading) return <div>Loading...</div>;

  const { items: products, pages } = data || { items: [], pages: 0 };
  const visiblePages = getVisiblePages(currentPage, pages);

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

            {visiblePages.map((pageNum, idx) =>
              pageNum === null ? (
                <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`pagination-btn ${
                    currentPage === pageNum ? "active" : ""
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

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
