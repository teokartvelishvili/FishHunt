"use client";

import { AuthLayout } from "@/modules/auth/layouts/auth-layout";
import { SellerRegisterForm } from "@/modules/auth/components/seller-register-form";
import { useLanguage } from "@/hooks/LanguageContext";

export default function SellerRegisterPage() {
  const { t } = useLanguage();
  
  return (
    <AuthLayout
      title={t("auth.sellerRegistration")}
      subtitle={t("auth.registerStoreAndStartSelling")}
    >
      <SellerRegisterForm />
    </AuthLayout>
  );
} 