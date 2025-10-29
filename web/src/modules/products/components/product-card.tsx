"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import "./ProductCard.css";
import { Product } from "@/types";
import noPhoto from "../../../assets/nophoto.webp";
import { useLanguage } from "@/hooks/LanguageContext";
import { useCart } from "@/modules/cart/context/cart-context";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

const FLOATING_REMINDER_ID = "floating-cart-reminder";
const FLOATING_REMINDER_NAV_EVENT = "floating-cart-reminder:navigate";
let floatingReminderInterval: number | null = null;
let floatingReminderListenerCount = 0;

type FloatingCartReminderConfig = {
  label: string;
  message: string;
};

const makeElementDraggable = (element: HTMLElement, handle?: HTMLElement) => {
  const dragHandle = handle ?? element;
  let isDragging = false;
  let pointerId: number | null = null;
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let offsetY = 0;
  let hasMoved = false;

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    pointerId = event.pointerId;
    isDragging = true;
    hasMoved = false;
    startX = event.clientX;
    startY = event.clientY;
    const rect = element.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    dragHandle.setPointerCapture(pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!isDragging || pointerId !== event.pointerId) return;
    if (!hasMoved) {
      const deltaX = Math.abs(event.clientX - startX);
      const deltaY = Math.abs(event.clientY - startY);
      hasMoved = deltaX > 3 || deltaY > 3;
    }

    if (!hasMoved) return;

    const proposedLeft = event.clientX - offsetX;
    const proposedTop = event.clientY - offsetY;
    const maxLeft = window.innerWidth - element.offsetWidth - 8;
    const maxTop = window.innerHeight - element.offsetHeight - 8;

    element.style.left = `${Math.min(Math.max(8, proposedLeft), maxLeft)}px`;
    element.style.top = `${Math.min(Math.max(8, proposedTop), maxTop)}px`;
    element.style.right = "auto";
    element.style.bottom = "auto";
  };

  const stopDragging = (event: PointerEvent) => {
    if (!isDragging || pointerId !== event.pointerId) return;
    dragHandle.releasePointerCapture(pointerId);
    isDragging = false;
    pointerId = null;
    if (hasMoved) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  dragHandle.addEventListener("pointerdown", onPointerDown);
  dragHandle.addEventListener("pointermove", onPointerMove);
  dragHandle.addEventListener("pointerup", stopDragging);
  dragHandle.addEventListener("pointercancel", stopDragging);
};

const ensureFloatingCartReminder = () => {
  if (typeof window === "undefined") return null;
  const doc = window.document;
  let container = doc.getElementById(
    FLOATING_REMINDER_ID
  ) as HTMLElement | null;

  if (!container) {
    container = doc.createElement("div");
    container.id = FLOATING_REMINDER_ID;
    container.className = "floating-cart-reminder";
    container.style.bottom = "24px";
    container.style.right = "16px";

    const button = doc.createElement("button");
    button.type = "button";
    button.className = "floating-cart-reminder-button";
    button.innerHTML = `
      <span class="floating-cart-reminder-icon" aria-hidden="true">
        <svg
          class="floating-cart-reminder-icon-svg"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </span>
      <span class="floating-cart-reminder-label"></span>
    `;

    const message = doc.createElement("div");
    message.className = "floating-cart-reminder-message";
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");

    container.appendChild(button);
    container.appendChild(message);
    doc.body.appendChild(container);

    button.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent(FLOATING_REMINDER_NAV_EVENT));
    });

    makeElementDraggable(container, button);
  }

  return container;
};

const triggerFloatingCartMessage = (
  container: HTMLElement,
  messageEl: HTMLElement,
  message: string
) => {
  messageEl.textContent = message;
  messageEl.classList.add("visible");
  container.classList.add("pulse");
  window.setTimeout(() => {
    messageEl.classList.remove("visible");
    container.classList.remove("pulse");
  }, 2400);
};

const useFloatingCartReminder = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    floatingReminderListenerCount += 1;
    const handler = () => router.push("/cart");
    window.addEventListener(FLOATING_REMINDER_NAV_EVENT, handler);
    return () => {
      window.removeEventListener(FLOATING_REMINDER_NAV_EVENT, handler);
      floatingReminderListenerCount = Math.max(
        0,
        floatingReminderListenerCount - 1
      );
      if (floatingReminderListenerCount === 0 && floatingReminderInterval) {
        window.clearInterval(floatingReminderInterval);
        floatingReminderInterval = null;
      }
    };
  }, [router]);

  const showReminder = useCallback((config: FloatingCartReminderConfig) => {
    if (typeof window === "undefined") return;
    const container = ensureFloatingCartReminder();
    if (!container) return;

    const buttonEl = container.querySelector(
      ".floating-cart-reminder-button"
    ) as HTMLButtonElement | null;
    const labelEl = container.querySelector(
      ".floating-cart-reminder-label"
    ) as HTMLElement | null;
    const messageEl = container.querySelector(
      ".floating-cart-reminder-message"
    ) as HTMLElement | null;

    if (labelEl) {
      labelEl.textContent = config.label;
    }

    if (buttonEl) {
      buttonEl.setAttribute("aria-label", config.label);
      buttonEl.title = config.label;
    }

    container.classList.add("visible");
    container.dataset.reminderMessage = config.message;

    if (messageEl) {
      triggerFloatingCartMessage(container, messageEl, config.message);
      if (floatingReminderInterval) {
        window.clearInterval(floatingReminderInterval);
      }
      floatingReminderInterval = window.setInterval(() => {
        triggerFloatingCartMessage(container, messageEl, config.message);
      }, 15000);
    }
  }, []);

  const hideReminder = useCallback(() => {
    if (typeof window === "undefined") return;
    const container = window.document.getElementById(
      FLOATING_REMINDER_ID
    ) as HTMLElement | null;
    if (!container) return;

    const messageEl = container.querySelector(
      ".floating-cart-reminder-message"
    ) as HTMLElement | null;

    container.classList.remove("visible", "pulse");
    if (messageEl) {
      messageEl.classList.remove("visible");
    }

    if (floatingReminderInterval) {
      window.clearInterval(floatingReminderInterval);
      floatingReminderInterval = null;
    }
  }, []);

  return { showReminder, hideReminder };
};

interface ProductCardProps {
  product: Product;
  className?: string;
  theme?: "default" | "handmade-theme";
}

export function ProductCard({
  product,
  className = "",
  theme = "default",
}: ProductCardProps) {
  let t: (key: string, values?: Record<string, string | number>) => string;
  let language: string;

  try {
    const languageContext = useLanguage();
    t = languageContext.t;
    language = languageContext.language;
  } catch {
    // Fallback if hook is not available
    t = (key: string) => key;
    language = "ge";
  }

  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const { addToCart, totalItems } = useCart();
  const { showReminder, hideReminder } = useFloatingCartReminder();

  // ვამოწმებთ სურათის ვალიდურობას
  const productImage = product.images?.[0] || noPhoto.src;

  // Display name based on selected language
  const displayName =
    language === "en" && product.nameEn ? product.nameEn : product.name;

  // Check if product has active discount
  const hasActiveDiscount = () => {
    console.log("Product discount data:", {
      discountPercentage: product.discountPercentage,
      discountStartDate: product.discountStartDate,
      discountEndDate: product.discountEndDate,
    });

    if (!product.discountPercentage || product.discountPercentage <= 0) {
      console.log("No discount percentage or <= 0");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If no start/end dates specified, discount is always active
    if (!product.discountStartDate && !product.discountEndDate) {
      console.log("No dates specified, discount is active");
      return true;
    }

    // Check date range if specified
    const startDate = product.discountStartDate
      ? new Date(product.discountStartDate)
      : null;
    const endDate = product.discountEndDate
      ? new Date(product.discountEndDate)
      : null;

    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    const isAfterStart = !startDate || today >= startDate;
    const isBeforeEnd = !endDate || today <= endDate;

    console.log("Date check:", {
      today,
      startDate,
      endDate,
      isAfterStart,
      isBeforeEnd,
      result: isAfterStart && isBeforeEnd,
    });

    return isAfterStart && isBeforeEnd;
  };

  // Calculate discounted price
  const calculateDiscountedPrice = () => {
    if (!hasActiveDiscount()) return product.price;
    const discountAmount = (product.price * product.discountPercentage!) / 100;
    return product.price - discountAmount;
  };

  const finalPrice = calculateDiscountedPrice();
  const isDiscounted = hasActiveDiscount();

  useEffect(() => {
    // დროებით გამორთულია floating cart reminder
    /*
    if (totalItems > 0) {
      if (!floatingReminderShownInitial) {
        showReminder({
          label: t("product.openCart") || "კალათში გადასვლა",
          message:
            t("product.cartReminderMessage") ||
            "გადადით კალათში, რომ დაასრულოთ შეკვეთა.",
        });
        floatingReminderShownInitial = true;
      }
    } else {
      hideReminder();
      floatingReminderShownInitial = false;
    }
    */
  }, [totalItems, showReminder, hideReminder, t]);

  // Add to cart handler
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setPending(true);
    try {
      await addToCart(
        product._id,
        quantity,
        "", // size
        "", // color
        "", // ageGroup
        finalPrice // use discounted price if available
      );

      toast({
        title: t("product.addedToCart") || "დამატებულია კალათში",
        description: `${displayName} - ${quantity} ცალი`,
      });

      // დროებით გამორთულია floating cart reminder
      /*
      showReminder({
        label: t("product.openCart") || "კალათში გადასვლა",
        message:
          t("product.cartReminderMessage") ||
          "გადადით კალათში, რომ დაასრულოთ შეკვეთა.",
      });
      */

      setQuantity(1); // Reset quantity after successful add
    } catch (error) {
      console.error("Add to cart error:", error);

      const errorMessage = error instanceof Error ? error.message : "";
      if (errorMessage !== "User not authenticated") {
        toast({
          title: t("product.errorTitle") || "შეცდომა",
          description:
            error instanceof Error
              ? error.message
              : t("product.addToCartError") || "კალათში დამატება ვერ მოხერხდა",
          variant: "destructive",
        });
      }
    } finally {
      setPending(false);
    }
  };

  console.log("Final values:", {
    isDiscounted,
    finalPrice,
    originalPrice: product.price,
  });

  return (
    <div className={`product-card ${theme} ${className}`}>
      {/* Discount badge */}
      {isDiscounted && (
        <div className="discount-badge">-{product.discountPercentage}%</div>
      )}

      <Link href={`/products/${product._id}`}>
        <div className="product-image">
          <Image
            src={productImage}
            alt={displayName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="image"
          />
        </div>
      </Link>

      <div className="productCard-info">
        <Link href={`/products/${product._id}`}>
          <h3 className="product-name">{displayName}</h3>
        </Link>

        {/* <div className="product-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`star ${
                  i < Math.floor(product.rating || 0) ? "filled" : "empty"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-text">
            {(product.rating || 0).toFixed(1)} ({product.numReviews || 0})
          </span>
        </div> */}

        <div className="productCard-details">
          <div className="priceAndRaiting">
            {isDiscounted ? (
              <div className="price-container">
                <span className="original-price">
                  {product.price.toFixed(2)}{" "}
                  {language === "en" ? "GEL" : "ლარი"}
                </span>
                <h3 className="product-price discounted-price">
                  {finalPrice.toFixed(2)} {language === "en" ? "GEL" : "ლარი"}
                </h3>
              </div>
            ) : (
              <h3 className="product-price">
                {product.price.toFixed(2)} {language === "en" ? "GEL" : "ლარი"}
              </h3>
            )}
          </div>
        </div>

        <div className="cart-actions">
          <div className="quantity-container">
            <button
              className="quantity-button quantity-decrease"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (quantity > 1) setQuantity(quantity - 1);
              }}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="quantity-display">{quantity}</span>
            <button
              className="quantity-button quantity-increase"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (quantity < (product.countInStock || 1))
                  setQuantity(quantity + 1);
              }}
              disabled={quantity >= (product.countInStock || 1)}
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>

          <button
            className="addButtonCart"
            onClick={handleAddToCart}
            disabled={pending || product.countInStock === 0}
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : product.countInStock === 0 ? (
              t("shop.outOfStock") || "არ არის მარაგში"
            ) : (
              <>
                <span className="add-to-cart-text">
                  {t("product.addToCart")}
                  <ShoppingCart size={16} />
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
