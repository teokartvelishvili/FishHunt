"use client";

import { useForm, Controller } from "react-hook-form";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useCheckout } from "../context/checkout-context";
import { getCountries } from "@/lib/countries";
import { useLanguage } from "@/hooks/LanguageContext";
import { useCart } from "@/modules/cart/context/cart-context";
import { getAccessToken } from "@/lib/auth";
import { useState, useMemo } from "react";
import { TAX_RATE } from "@/config/constants";
import Image from "next/image";

import "./shipping-form.css";

interface ShippingFormData {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

// Helper function to check if city is Tbilisi
const isTbilisi = (city: string): boolean => {
  const tbilisiVariants = ["tbilisi", "თბილისი", "тбилиси"];
  return tbilisiVariants.includes(city.toLowerCase().trim());
};

// Calculate shipping price based on city and items total
const calculateShipping = (city: string, itemsPrice: number): number => {
  const isTbilisiCity = isTbilisi(city);
  const threshold = isTbilisiCity ? 50 : 100;
  const basePrice = isTbilisiCity ? 5 : 15;

  return itemsPrice >= threshold ? 0 : basePrice;
};

export function ShippingForm() {
  const { setShippingAddress } = useCheckout();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { items, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm<ShippingFormData>();

  const watchCity = watch("city", "");

  const itemsPrice = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = useMemo(() => {
    return watchCity ? calculateShipping(watchCity, itemsPrice) : 0;
  }, [watchCity, itemsPrice]);
  const taxPrice = Number((itemsPrice * TAX_RATE).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const onSubmit = async (data: ShippingFormData) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Save shipping details
      await apiClient.post("/cart/shipping", data);
      setShippingAddress(data);

      // 2. Create order with BOG payment method
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

      const finalShippingPrice = calculateShipping(data.city, itemsPrice);
      const finalTotalPrice = itemsPrice + finalShippingPrice + taxPrice;

      const orderResponse = await apiClient.post("/orders", {
        orderItems,
        shippingDetails: data,
        paymentMethod: "BOG",
        itemsPrice,
        taxPrice,
        shippingPrice: finalShippingPrice,
        totalPrice: finalTotalPrice,
      });

      const orderId = orderResponse.data._id;
      const order = orderResponse.data;

      // 3. Clear cart
      await clearCart();

      // 4. Initiate BOG payment
      const token = getAccessToken();
      const paymentData = {
        customer: {
          firstName: "Customer",
          lastName: "Customer",
          personalId: "",
          address: data.address,
          phoneNumber: data.phone,
          email: order.user?.email || "",
        },
        product: {
          productName: `შეკვეთა #${orderId}`,
          productId: orderId,
          unitPrice: finalTotalPrice,
          quantity: 1,
          totalPrice: finalTotalPrice,
        },
        successUrl: `${window.location.origin}/checkout/success?orderId=${orderId}`,
        failUrl: `${window.location.origin}/checkout/fail?orderId=${orderId}`,
      };

      const paymentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/bog/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!paymentResponse.ok) {
        throw new Error("გადახდის ინიცირება ვერ მოხერხდა");
      }

      const paymentResult = await paymentResponse.json();

      if (paymentResult.redirect_url) {
        window.location.href = paymentResult.redirect_url;
      } else {
        throw new Error("გადახდის ბმული არ მოიძებნა");
      }
    } catch (error: unknown) {
      console.error(error);

      // Extract error message from backend response
      let errorMessage = t("checkout.tryAgain");
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: t("checkout.orderError"),
        description: errorMessage,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="shipping-form-card">
      <div className="shipping-form-header">
        <h1>{t("checkout.shippingAddress")}</h1>
        <p>{t("checkout.enterShippingDetails")}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="shipping-form">
        <div className="shipping-form-field">
          <label htmlFor="address">{t("checkout.streetAddress")}</label>
          <input
            id="address"
            {...register("address", {
              required: t("checkout.addressRequired"),
            })}
            placeholder={t("checkout.streetAddress")}
          />
          {errors.address && (
            <p className="error-text">{errors.address.message}</p>
          )}
        </div>

        <div className="shipping-form-field">
          <label htmlFor="city">{t("checkout.city")}</label>
          <input
            id="city"
            {...register("city", { required: t("checkout.cityRequired") })}
            placeholder={t("checkout.city")}
          />
          {errors.city && <p className="error-text">{errors.city.message}</p>}
        </div>

        <div className="shipping-form-field">
          <label htmlFor="postalCode">{t("checkout.postalCode")}</label>
          <input
            id="postalCode"
            {...register("postalCode", {
              required: t("checkout.postalCodeRequired"),
            })}
            placeholder={t("checkout.postalCode")}
          />
          {errors.postalCode && (
            <p className="error-text">{errors.postalCode.message}</p>
          )}
        </div>

        <div className="shipping-form-field">
          <label htmlFor="phone">{t("checkout.phone")}</label>
          <input
            id="phone"
            type="tel"
            {...register("phone", {
              required: t("checkout.phoneRequired"),
              pattern: {
                value: /^[+]?[0-9\s\-()]{9,20}$/,
                message: t("checkout.phoneInvalid"),
              },
            })}
            placeholder="+995 555 123 456"
          />
          {errors.phone && <p className="error-text">{errors.phone.message}</p>}
        </div>

        <div className="shipping-form-field">
          <label htmlFor="country">{t("checkout.country")}</label>
          <Controller
            name="country"
            control={control}
            rules={{ required: t("checkout.countryRequired") }}
            render={({ field }) => (
              <select {...field} defaultValue="">
                <option value="" disabled>
                  {t("checkout.selectCountry")}
                </option>
                {getCountries().map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.country && (
            <p className="error-text">{errors.country.message}</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="order-summary-mini">
          <h3>{t("checkout.orderSummary")}</h3>

          {/* Products List */}
          <div className="order-products-list">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="order-product-item"
              >
                <div className="order-product-image">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </div>
                <div className="order-product-info">
                  <span className="order-product-name">{item.name}</span>
                  <span className="order-product-details">
                    {item.size && <span>{item.size}</span>}
                    {item.color && <span> • {item.color}</span>}
                  </span>
                </div>
                <div className="order-product-qty">x{item.qty}</div>
                <div className="order-product-price">
                  {(item.price * item.qty).toFixed(2)} ₾
                </div>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>{t("cart.total")}</span>
            <span>{itemsPrice.toFixed(2)} ₾</span>
          </div>
          <div className="summary-row">
            <span>{t("cart.delivery")}</span>
            <span>
              {shippingPrice === 0
                ? t("cart.free")
                : `${shippingPrice.toFixed(2)} ₾`}
            </span>
          </div>
          <div className="summary-row total">
            <span>{t("cart.totalCost")}</span>
            <span>{totalPrice.toFixed(2)} ₾</span>
          </div>
        </div>

        <button
          type="submit"
          className="shipping-form-button"
          disabled={isSubmitting || isProcessing}
        >
          {isSubmitting || isProcessing ? (
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
              {t("checkout.processingPayment")}
            </>
          ) : (
            <>
              🔒 {t("checkout.payWithCard")} - {totalPrice.toFixed(2)} ₾
            </>
          )}
        </button>

        <p className="payment-note">{t("checkout.securePaymentNote")}</p>
      </form>
    </div>
  );
}
