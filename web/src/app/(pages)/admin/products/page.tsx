"use client";

import { ProductsList } from "@/modules/admin/components/products-list";
import "./adminProduct.css";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/LanguageContext";

export default function AdminProductsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated before rendering
    if (!isAuthenticated()) {
      router.push("/login?redirect=/admin/products");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div className="loading-container">{t("shop.loading")}</div>;
  }

  return (
    <div
      className="responsive-container"
      style={{
        maxWidth: "90%",
        margin: "0 auto",
        overflowX: "auto",
        width: "100%",
      }}
    >
      <ProductsList />
    </div>
  );
}
