"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "./user-menu.css";
import { Role } from "@/types/role";
import hunterIcon from "../../assets/icons/hunter.png";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";

export default function UserMenu() {
  const { user, isLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <div className="loader"></div>;
  }

  if (!user) {
    return (
      <Link href="/login" className="button">
        <span className="icon">
          {/* 👤 */}
          <Image src={hunterIcon} alt="hunterIcon" width={28} height={28} />
          </span> Sign In
      </Link>
    );
  }

  return (
    <div className="dropdown" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="button"
        aria-label="Toggle user menu"
      >
        <span className="icon">
          <Image src={hunterIcon} alt="hunterIcon" width={42} height={42} />
          
          {/* 👤 */}
          </span>  {user.name || 'მომხმარებელი'}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-label">My Account</div>
          <hr />
          <Link href="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
            Profile
          </Link>
          <Link href="/profile/orders" className="dropdown-item" onClick={() => setIsOpen(false)}>
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
               <Link href="/admin/users" className="dropdown-item" onClick={() => setIsOpen(false)}>
                Users
              </Link>
              <Link href="/admin/orders" className="dropdown-item" onClick={() => setIsOpen(false)}>
                Orders
              </Link>
            </>
          )}

          <hr />
          <button 
            onClick={() => {
              setIsOpen(false);
              logout();
            }} 
            className="dropdown-item logout-button"
          >
            გასვლა
          </button>
        </div>
      )}
    </div>
  );
}
