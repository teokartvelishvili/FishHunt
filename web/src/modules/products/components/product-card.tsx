"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./ProductCard.css";
import { Product } from "@/types";
// import { AddToCartButton } from "./AddToCartButton";
import noPhoto from "../../../assets/nophoto.webp";
// import Star from "../../../assets/Images/star.png";
// import Star2 from "../../../assets/Images/startHandMade.png";
import { useLanguage } from "@/hooks/LanguageContext";

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
  const { language } = useLanguage();
  const [quantity, setQuantity] = useState(1);

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

  const isDiscounted = hasActiveDiscount();
  const discountedPrice = calculateDiscountedPrice();

  console.log("Final values:", {
    isDiscounted,
    discountedPrice,
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

      <div className="product-info">
        <Link href={`/products/${product._id}`}>
          <h3 className="product-name">{displayName}</h3>
        </Link>

        <div className="product-rating">
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
        </div>

        <div className="product-details">
          <div className="priceAndRaiting">
            {isDiscounted ? (
              <div className="price-container">
                <span className="original-price">
                  {product.price.toFixed(2)}{" "}
                  {language === "en" ? "GEL" : "ლარი"}
                </span>
                <h3 className="product-price discounted-price">
                  {discountedPrice.toFixed(2)}{" "}
                  {language === "en" ? "GEL" : "ლარი"}
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
              className="quantity-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (quantity > 1) setQuantity(quantity - 1);
              }}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const value = parseInt(e.target.value) || 1;
                setQuantity(
                  Math.max(1, Math.min(value, product.countInStock || 1))
                );
              }}
              className="quantity-input"
              min="1"
              max={product.countInStock || 1}
            />
            <button
              className="quantity-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (quantity < (product.countInStock || 1))
                  setQuantity(quantity + 1);
              }}
            >
              +
            </button>
          </div>

          <button
            className="addButtonCart"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add to cart logic here
              console.log(`Add ${quantity} of ${product.name} to cart`);
            }}
          >
            Add to Cart 🛒
          </button>
        </div>
      </div>
    </div>
  );
}
