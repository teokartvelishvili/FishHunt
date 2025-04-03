"use client";

import { useUser } from "@/modules/auth/hooks/use-user";
import { redirect, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Role } from "@/types/role";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, error } = useUser();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isLoading && (!user || error)) {
    return redirect("/login");
  }

  const isProductRelatedPath = pathname?.includes('/products') ?? false;

  // Make role comparison case-insensitive
  const userRole = user?.role?.toLowerCase();
  const hasAccess = 
    userRole === Role.Admin.toLowerCase() || 
    (userRole === Role.Seller.toLowerCase() && isProductRelatedPath);

  if (!hasAccess) {
    console.log("Access denied:", {
      role: user?.role,
      normalizedRole: userRole,
      path: pathname,
      isProductPath: isProductRelatedPath,
      adminRole: Role.Admin.toLowerCase(),
      sellerRole: Role.Seller.toLowerCase()
    });
    return redirect("/login");
  }

  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
