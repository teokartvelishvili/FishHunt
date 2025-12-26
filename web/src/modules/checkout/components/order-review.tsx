"use client";

import { useCheckout } from "../context/checkout-context";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { TAX_RATE } from "@/config/constants";
import { useLanguage } from "@/hooks/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import "./order-review.css";
import { useCart } from "@/modules/cart/context/cart-context";

// Helper function to check if city is Tbilisi
const isTbilisi = (city: string): boolean => {
  const tbilisiVariants = ["tbilisi", "თბილისი", "тбилиси"];
  return tbilisiVariants.includes(city.toLowerCase().trim());
};

// Calculate shipping price based on city and items total
const calculateShipping = (
  city: string,
  itemsPrice: number
): { price: number; freeThreshold: number; amountToFree: number } => {
  const isTbilisiCity = isTbilisi(city);
  const threshold = isTbilisiCity ? 50 : 100;
  const basePrice = isTbilisiCity ? 5 : 15;

  if (itemsPrice >= threshold) {
    return { price: 0, freeThreshold: threshold, amountToFree: 0 };
  }

  return {
    price: basePrice,
    freeThreshold: threshold,
    amountToFree: Number((threshold - itemsPrice).toFixed(2)),
  };
};

export function OrderReview() {
  const { shippingAddress: shippingDetails, paymentMethod } = useCheckout();
  const { items, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const itemsPrice = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingInfo = useMemo(() => {
    if (!shippingDetails?.city) {
      return { price: 0, freeThreshold: 50, amountToFree: 0 };
    }
    return calculateShipping(shippingDetails.city, itemsPrice);
  }, [shippingDetails?.city, itemsPrice]);

  const shippingPrice = shippingInfo.price;
  const taxPrice = Number((itemsPrice * TAX_RATE).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handlePlaceOrder = async () => {
    if (isLoading) return; // Prevent double submission

    setIsLoading(true);
    try {
      const orderItems = items.map((item) => ({
        name: item.name,
        nameEn: item.nameEn,
        qty: item.qty,
        image: item.image,
        price: item.price,
        productId: item.productId,
        size: item.size,
        color: item.color,
        ageGroup: item.ageGroup,
      }));

      const response = await apiClient.post("/orders", {
        orderItems,
        shippingDetails,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      await clearCart();
      router.push(`/orders/${response.data._id}`);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error placing order",
        description: "Please try again.",
        variant: "destructive",
      });
      setIsLoading(false); // Re-enable on error
    }
  };

  return (
    <div className="order-review-grid">
      <div className="order-details col-span-8 space-y-6">
        {/* Shipping Address */}
        <div className="card p-6">
          <h2 className="section-title">Shipping</h2>
          <p className="address-details">
            <strong>Address: </strong>
            {shippingDetails?.address}, {shippingDetails?.city},{" "}
            {shippingDetails?.postalCode}, {shippingDetails?.country}
          </p>
        </div>

        {/* Payment Method */}
        <div className="card p-6">
          <h2 className="section-title">Payment</h2>
          <p className="payment-method">
            <strong>Method: </strong>
            {paymentMethod}
          </p>
        </div>

        {/* Order Items */}
        <div className="card p-6">
          <h2 className="section-title">Order Items</h2>
          <div className="order-items space-y-4">
            {items.map((item) => {
              // Display name based on selected language
              const displayName =
                language === "en" && item.nameEn ? item.nameEn : item.name;

              return (
                <div
                  key={`${item.productId}-${item.color ?? "c"}-${
                    item.size ?? "s"
                  }-${item.ageGroup ?? "a"}`}
                  className="order-item flex items-center space-x-4"
                >
                  <div className="image-container relative h-20 w-20">
                    <Image
                      src={item.image}
                      alt={displayName}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="order-item-details flex-1">
                    <Link
                      href={`/products/${item.productId}`}
                      className="item-name font-medium hover:underline"
                    >
                      {displayName}
                    </Link>
                    <p className="item-price text-sm text-muted-foreground">
                      {item.qty} x {item.price} ₾ = {item.qty * item.price} ₾
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="order-summary col-span-4">
        <div className="card p-6">
          <h2 className="section-title">Order Summary</h2>
          <div className="summary-details space-y-4">
            <div className="summary-row flex justify-between">
              <span className="summary-label text-muted-foreground">
                {t("cart.total")}
              </span>
              <span>{itemsPrice.toFixed(2)} ₾</span>
            </div>
            <div className="summary-row flex justify-between">
              <span className="summary-label text-muted-foreground">
                {shippingDetails?.city && isTbilisi(shippingDetails.city)
                  ? t("cart.shippingTbilisi")
                  : t("cart.shippingRegions")}
              </span>
              <span>
                {shippingPrice === 0
                  ? t("cart.free")
                  : `${shippingPrice.toFixed(2)} ₾`}
              </span>
            </div>
            {shippingInfo.amountToFree > 0 && (
              <div className="text-sm text-orange-600 dark:text-orange-400">
                💡 {t("cart.addMoreForFreeShipping")}{" "}
                {shippingInfo.amountToFree.toFixed(2)} ₾
              </div>
            )}
            <div className="summary-row flex justify-between">
              <span className="summary-label text-muted-foreground">
                {t("cart.commission")}
              </span>
              <span>{taxPrice.toFixed(2)} ₾</span>
            </div>
            <div className="separator" />
            <div className="summary-row flex justify-between font-medium">
              <span>{t("cart.totalCost")}</span>
              <span>{totalPrice.toFixed(2)} ₾</span>
            </div>
            <button
              className="place-order-button w-full"
              onClick={handlePlaceOrder}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 inline mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  გთხოვთ დაელოდოთ...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
