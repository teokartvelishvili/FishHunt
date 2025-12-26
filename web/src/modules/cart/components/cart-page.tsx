"use client";

import { useCart } from "../context/cart-context";
import { CartEmpty } from "./cart-empty";
import { CartItem } from "./cart-item";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import "./cart-page.css";
import { Color } from "@/types";

export function CartPage() {
  const { items, loading } = useCart();
  const router = useRouter();
  const { t, language } = useLanguage(); // Added language here

  // Fetch all colors for proper nameEn support
  const { data: availableColors = [] } = useQuery<Color[]>({
    queryKey: ["colors"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth("/categories/attributes/colors");
        if (!response.ok) {
          return [];
        }
        return response.json();
      } catch {
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  }); // Get localized color name based on current language (exact same logic as product-details.tsx)
  const getLocalizedColorName = (colorName: string): string => {
    if (language === "en") {
      // Find the color in availableColors to get its English name
      const colorObj = availableColors.find(
        (color) => color.name === colorName
      );
      return colorObj?.nameEn || colorName;
    }
    return colorName;
  };

  if (loading) {
    return <div>{t("shop.loading")}</div>;
  }

  if (items.length === 0) {
    return <CartEmpty />;
  }

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  // Show shipping info (exact price calculated at checkout when city is known)
  // Tbilisi: free from 50₾, otherwise 5₾
  // Regions: free from 100₾, otherwise 15₾
  const shipping = 0; // Will be calculated at checkout
  const tax = Number((0.02 * subtotal).toFixed(2));
  const total = subtotal + shipping + tax;

  // Calculate amounts needed for free shipping
  const amountForFreeTbilisi = subtotal >= 50 ? 0 : 50 - subtotal;
  const amountForFreeRegions = subtotal >= 100 ? 0 : 100 - subtotal;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">{t("cart.yourCart")}</h1>
        <p className="cart-items-count">
          {items.length} {t("cart.items")}
        </p>
      </div>

      <div className="cart-content">
        {" "}
        <div className="cart-items">
          {items.map((item) => {
            return (
              <CartItem
                key={`${item.productId}-${item.color ?? "c"}-${
                  item.size ?? "s"
                }-${item.ageGroup ?? "a"}`}
                item={item}
                getLocalizedColorName={getLocalizedColorName}
              />
            );
          })}
        </div>
        <div className="order-summary">
          <div className="summary-card">
            <h2 className="summary-title">{t("cart.checkout")}</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span className="summary-label">{t("cart.total")}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {/* Shipping info message */}
              <div className="shipping-info text-sm space-y-1 py-2">
                {amountForFreeTbilisi > 0 ? (
                  <p className="text-orange-600 dark:text-orange-400">
                    🚚 {t("cart.addMoreForFreeShipping")}{" "}
                    {formatPrice(amountForFreeTbilisi)} (
                    {t("cart.shippingTbilisi")})
                  </p>
                ) : (
                  <p className="text-green-600 dark:text-green-400">
                    ✓ {t("cart.freeShippingTbilisi")}
                  </p>
                )}
                {amountForFreeRegions > 0 ? (
                  <p className="text-orange-600 dark:text-orange-400">
                    🚛 {t("cart.addMoreForFreeShipping")}{" "}
                    {formatPrice(amountForFreeRegions)} (
                    {t("cart.shippingRegions")})
                  </p>
                ) : (
                  <p className="text-green-600 dark:text-green-400">
                    ✓ {t("cart.freeShippingRegions")}
                  </p>
                )}
              </div>

              <div className="summary-row">
                <span className="summary-label">{t("cart.commission")}</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <hr className="separator" />
              <div className="summary-row total">
                <span>{t("cart.totalCost")}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button
                className="checkout-button"
                onClick={() => router.push("/checkout/shipping")}
              >
                {t("cart.checkout")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
