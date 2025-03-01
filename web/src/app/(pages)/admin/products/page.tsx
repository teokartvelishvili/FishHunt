import { ProductsList } from "@/modules/admin/components/products-list";
import { getProducts } from "@/modules/admin/api/get-products";
import { getVisiblePages } from "@/lib/utils";
import "./adminProduct.css";
import Link from "next/link";

// searchParams არ გამოიყენება, როგორც ეს იყო
interface AdminProductsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const { items: products, pages } = await getProducts(currentPage, 8);
  const visiblePages = getVisiblePages(currentPage, pages);

  return (
    <div className="admin-products-container">
      <div className="products-content">
        <ProductsList products={products} />

        {pages > 1 && (
          <nav className="pagination">
            <ul className="pagination-content">
              {/* Previous Button */}
              <li
                className={`pagination-item ${
                  currentPage > 1 ? "" : "disabled"
                }`}
              >
                <Link
                  href={`/admin/products?page=${currentPage - 1}`}
                  className="pagination-link"
                >
                  « Previous
                </Link>
              </li>

              {/* Page Numbers */}
              {visiblePages.map((pageNum, idx) =>
                pageNum === null ? (
                  <li
                    key={`ellipsis-${idx}`}
                    className="pagination-item pagination-ellipsis"
                  >
                    ...
                  </li>
                ) : (
                  <li
                    key={pageNum}
                    className={`pagination-item ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                  >
                    <Link
                      href={`/admin/products?page=${pageNum}`}
                      className="pagination-link"
                    >
                      {pageNum}
                    </Link>
                  </li>
                )
              )}

              {/* Next Button */}
              <li
                className={`pagination-item ${
                  currentPage < pages ? "" : "disabled"
                }`}
              >
                <Link
                  href={`/admin/products?page=${currentPage + 1}`}
                  className="pagination-link"
                >
                  Next »
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
