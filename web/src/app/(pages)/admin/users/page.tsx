import React from "react";
import "./loading.css";
import { UsersList } from "@/modules/admin/components/users-list";
import { getUsers } from "@/modules/admin/api/get-users";
import { getVisiblePages } from "@/lib/utils";

interface AdminUsersPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const { items: users, pages } = await getUsers(currentPage, 10);

  const visiblePages = getVisiblePages(currentPage, pages);

  return (
    <div className="container">
      <div className="admin-users-wrapper">
        <UsersList users={users} />
        <div className="pagination-wrapper">
          {pages > 1 && (
            <div className="pagination">
              <a
                href={`/admin/users?page=${currentPage - 1}`}
                className={`pagination-prev ${
                  currentPage > 1 ? "active" : "disabled"
                }`}
              >
                Previous
              </a>

              {visiblePages.map((pageNum, idx) =>
                pageNum === null ? (
                  <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                    ...
                  </span>
                ) : (
                  <a
                    key={pageNum}
                    href={`/admin/users?page=${pageNum}`}
                    className={`pagination-link ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                  >
                    {pageNum}
                  </a>
                )
              )}

              <a
                href={`/admin/users?page=${currentPage + 1}`}
                className={`pagination-next ${
                  currentPage < pages ? "active" : "disabled"
                }`}
              >
                Next
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
