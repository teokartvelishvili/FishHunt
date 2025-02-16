"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/modules/auth/hooks/use-user";
import { useLogout } from "@/modules/auth/hooks/use-auth";
import "./user-menu.css";
import { Role } from "@/types/role";

export default function UserMenu() {
  const { user, isLoading } = useUser();
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return <div className="loader"></div>;
  }

  if (!user) {
    return (
      <Link href="/login" className="button">
        <span className="icon">👤</span> Sign In
      </Link>
    );
  }

  return (
    <div className="dropdown">
      <button onClick={() => setIsOpen(!isOpen)} className="button">
        <span className="icon">👤</span> {user.name}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-label">My Account</div>
          <hr />
          <Link href="/profile" className="dropdown-item">
            Profile
          </Link>
          <Link href="/profile/orders" className="dropdown-item">
            Orders
          </Link>

          {(user.role === Role.Admin || user.role === Role.Seller) && (
            <>
              <hr />
              <div className="dropdown-label">Admin Dashboard</div>
              <Link href="/admin/products" className="dropdown-item">
                Products
              </Link>
            </>
          )}

          {user.role === Role.Admin && (
            <>
              <Link href="/admin/users" className="dropdown-item">
                Users
              </Link>
              <Link href="/admin/orders" className="dropdown-item">
                Orders
              </Link>
            </>
          )}

          <hr />
          <button onClick={() => logout.mutate()} className="dropdown-item">
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
