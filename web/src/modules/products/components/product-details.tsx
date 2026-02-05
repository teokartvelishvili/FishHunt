"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react"; // Added X icon for close button
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import "./productDetails.css";
import "./videoTabs.css"; // Import new pd-tabs styles
import { Product } from "@/types";
import { ShareButtons } from "@/components/share-buttons/share-buttons";
import { useLanguage } from "@/hooks/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { Color, AgeGroupItem } from "@/types";

import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

import { ProductCard } from "./product-card";
import { useCart } from "@/modules/cart/context/cart-context";
import { ReviewForm } from "./review-form";
import { ProductReviews } from "./product-reviews";
import ProductSchema from "@/components/ProductSchema";

// Custom AddToCartButton component that uses the cart context
function AddToCartButton({
  productId,
  countInStock = 0,
  className = "",
  selectedSize = "",
  selectedColor = "",
  selectedAgeGroup = "",
  quantity = 1,
  disabled = false,
  price, // Add pd-price parameter
}: {
  productId: string;
  countInStock?: number;
  className?: string;
  selectedSize?: string;
  selectedColor?: string;
  selectedAgeGroup?: string;
  quantity?: number;
  disabled?: boolean;
  price?: number; // Add pd-price parameter type
}) {
  const [pending, setPending] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const handleClick = async () => {
    setPending(true);
    try {
      // Add variant info including ageGroup if available
      await addToCart(
        productId,
        quantity,
        selectedSize,
        selectedColor,
        selectedAgeGroup,
        price // Pass the discounted price
      );

      // მხოლოდ წარმატებული დამატების შემდეგ ვაჩვენოთ success message
      // თუ addToCart error-ს მისცემს (არაავტორიზებული), ეს კოდი არ შესრულდება
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Add to cart error:", error);

      // არ ვაჩვენოთ error toast არაავტორიზებული მომხმარებლისთვის
      // რადგან ისედაც redirect მოხდება
      const errorMessage = error instanceof Error ? error.message : "";
      if (errorMessage !== "User not authenticated") {
        toast({
          title: t("product.errorTitle"),
          description:
            error instanceof Error
              ? error.message
              : t("product.addToCartError"),
          variant: "destructive",
        });
      }
    } finally {
      setPending(false);
    }
  };

  if (countInStock === 0 || disabled) {
    return (
      <button
        className={`pd-add-to-cart-btn out-of-stock ${className}`}
        disabled
      >
        {t("shop.outOfStock") || "არ არის მარაგში"}
      </button>
    );
  }
  return (
    <>
      {/* Success Message */}
      {showSuccessMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "15px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontSize: "16px",
            fontWeight: "500",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          ✅ {t("product.addToCartSuccess")}
        </div>
      )}

      <button
        className={`pd-add-to-cart-btn ${className}`}
        onClick={handleClick}
        disabled={pending}
      >
        {pending ? (
          <Loader2 className="animate-spin" />
        ) : (
          t("cart.addToCart") || "კალათაში დამატება"
        )}
      </button>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// Similar Products Component
function SimilarProducts({
  currentProductId,
  subCategoryId,
}: {
  currentProductId: string;
  subCategoryId: string;
}) {
  const { t } = useLanguage();

  // Fetch products filtered by subcategory using the same API as the shop page
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["similarProducts", subCategoryId],
    queryFn: async () => {
      try {
        if (!subCategoryId) {
          return { items: [] };
        }

        // Use the same getProducts API that the shop page uses
        const searchParams = new URLSearchParams({
          page: "1",
          limit: "10", // Fetch more than 3 in case current product is included
          subCategory: subCategoryId,
        });

        const response = await fetchWithAuth(
          `/products?${searchParams.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching similar products:", error);
        return { items: [] };
      }
    },
    enabled: !!subCategoryId, // Only run query if subCategoryId exists
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Filter out current product and take only 3
  const allProducts = productsResponse?.items || [];
  const similarProducts = allProducts
    .filter((product: Product) => product._id !== currentProductId)
    .slice(0, 3);

  // Don't render if loading
  if (isLoading) {
    return (
      <div className="pd-similar-products-section">
        <h2 className="pd-similar-products-title">
          {t("product.similarProducts")}
        </h2>
        <div className="pd-similar-products-loading">
          <p>{t("shop.loading")}</p>
        </div>
      </div>
    );
  }

  // Don't render if no subcategory or no similar products found
  if (!subCategoryId || similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="pd-similar-products-section">
      <h2 className="pd-similar-products-title">
        {t("product.similarProducts")}
      </h2>{" "}
      <div className="pd-similar-products-grid">
        {similarProducts.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

interface ProductDetailsProps {
  product: Product;
}

// Default color hex codes mapping for Georgian color names
const defaultColorHexMap: Record<string, string> = {
  // Georgian
  შავი: "#000000",
  თეთრი: "#FFFFFF",
  წითელი: "#E53935",
  ლურჯი: "#1E88E5",
  მწვანე: "#43A047",
  ყვითელი: "#FDD835",
  ნარინჯისფერი: "#FB8C00",
  იასამნისფერი: "#8E24AA",
  ვარდისფერი: "#EC407A",
  ყავისფერი: "#795548",
  ნაცრისფერი: "#9E9E9E",
  ოქროსფერი: "#FFD700",
  ვერცხლისფერი: "#C0C0C0",
  ბეჟი: "#D7CCC8",
  ტურქუაზი: "#00BCD4",
  // English
  black: "#000000",
  white: "#FFFFFF",
  red: "#E53935",
  blue: "#1E88E5",
  green: "#43A047",
  yellow: "#FDD835",
  orange: "#FB8C00",
  purple: "#8E24AA",
  pink: "#EC407A",
  brown: "#795548",
  gray: "#9E9E9E",
  grey: "#9E9E9E",
  gold: "#FFD700",
  silver: "#C0C0C0",
  beige: "#D7CCC8",
  turquoise: "#00BCD4",
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const currentImageIndex_state = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = currentImageIndex_state;
  const [quantity, setQuantity] = useState(1);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("");
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");
  const [brandLogoError, setBrandLogoError] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "video">(
    "description"
  ); // Active tab state

  // Create combined images array including color images
  const allImages = useMemo(() => {
    const images = [...product.images];
    // Add color images that are not already in the main images
    if (product.colorImages && product.colorImages.length > 0) {
      product.colorImages.forEach((ci) => {
        if (!images.includes(ci.image)) {
          images.push(ci.image);
        }
      });
    }
    return images;
  }, [product.images, product.colorImages]);

  // Get image for a specific color from colorImages
  const getColorImage = useCallback(
    (color: string): string | null => {
      if (!product.colorImages || product.colorImages.length === 0) {
        return null;
      }
      const colorImage = product.colorImages.find((ci) => ci.color === color);
      return colorImage?.image || null;
    },
    [product.colorImages]
  );

  // Handle color selection - changes image if color has a specific image
  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);
      const colorImage = getColorImage(color);
      if (colorImage) {
        // Find if this color image is in allImages array
        const imageIndex = allImages.findIndex((img) => img === colorImage);
        if (imageIndex !== -1) {
          setCurrentImageIndex(imageIndex);
        }
      }
    },
    [getColorImage, allImages, setCurrentImageIndex]
  );

  // Extract sizes, colors, ageGroups from variants if product-level arrays are empty
  const availableSizes = useMemo(() => {
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes;
    }
    if (product.variants && product.variants.length > 0) {
      const sizesFromVariants = product.variants
        .map((v) => v.size)
        .filter((s): s is string => !!s);
      return [...new Set(sizesFromVariants)];
    }
    return [];
  }, [product.sizes, product.variants]);

  const availableColorsFromProduct = useMemo(() => {
    if (product.colors && product.colors.length > 0) {
      return product.colors;
    }
    if (product.variants && product.variants.length > 0) {
      const colorsFromVariants = product.variants
        .map((v) => v.color)
        .filter((c): c is string => !!c);
      return [...new Set(colorsFromVariants)];
    }
    return [];
  }, [product.colors, product.variants]);

  const availableAgeGroupsFromProduct = useMemo(() => {
    if (product.ageGroups && product.ageGroups.length > 0) {
      return product.ageGroups;
    }
    if (product.variants && product.variants.length > 0) {
      const ageGroupsFromVariants = product.variants
        .map((v) => v.ageGroup)
        .filter((ag): ag is string => !!ag);
      return [...new Set(ageGroupsFromVariants)];
    }
    return [];
  }, [product.ageGroups, product.variants]);

  // Get available variant attributes from product variants
  const availableAttributesFromProduct = useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      const attributesFromVariants = product.variants
        .map((v) => v.attribute)
        .filter((a): a is string => !!a);
      return [...new Set(attributesFromVariants)];
    }
    return [];
  }, [product.variants]);

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
  });
  // Fetch all age groups for proper nameEn support
  const { data: availableAgeGroups = [] } = useQuery<AgeGroupItem[]>({
    queryKey: ["ageGroups"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth(
          "/categories/attributes/age-groups"
        );
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
  });
  // Get localized color name based on current language
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

  // Get localized age group name based on current language
  const getLocalizedAgeGroupName = (ageGroupName: string): string => {
    if (language === "en") {
      // Find the age group in availableAgeGroups to get its English name
      const ageGroupObj = availableAgeGroups.find(
        (ageGroup) => ageGroup.name === ageGroupName
      );
      return ageGroupObj?.nameEn || ageGroupName;
    }
    return ageGroupName;
  };

  // Check if product has active discount
  const hasActiveDiscount = () => {
    if (!product.discountPercentage || product.discountPercentage <= 0) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If no start/end dates specified, discount is always active
    if (!product.discountStartDate && !product.discountEndDate) {
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

    return isAfterStart && isBeforeEnd;
  };

  // Get the selected variant (if any)
  const selectedVariant = useMemo(() => {
    // If no variants exist, return null
    if (!product.variants || product.variants.length === 0) return null;

    // Find a matching variant based on selected attributes
    // Only match on attributes that exist in the variants
    const variant = product.variants.find((v) => {
      // Check if size matches (only if variant has size and sizes are available)
      const sizeMatches = !v.size || !selectedSize || v.size === selectedSize;
      // Check if color matches (only if variant has color and colors are available)
      const colorMatches =
        !v.color || !selectedColor || v.color === selectedColor;
      // Check if ageGroup matches (only if variant has ageGroup and ageGroups are available)
      const ageGroupMatches =
        !v.ageGroup || !selectedAgeGroup || v.ageGroup === selectedAgeGroup;
      // Check if attribute matches (only if variant has attribute)
      const attributeMatches =
        !v.attribute || !selectedAttribute || v.attribute === selectedAttribute;

      return sizeMatches && colorMatches && ageGroupMatches && attributeMatches;
    });

    return variant || null;
  }, [selectedSize, selectedColor, selectedAgeGroup, selectedAttribute, product.variants]);

  // Get the base price (variant price if exists, otherwise product price)
  const basePrice = useMemo(() => {
    if (selectedVariant?.price !== undefined && selectedVariant.price > 0) {
      return selectedVariant.price;
    }
    return product.price;
  }, [selectedVariant, product.price]);

  // Calculate discounted pd-price
  const calculateDiscountedPrice = () => {
    if (!hasActiveDiscount()) return basePrice;
    const discountAmount = (basePrice * product.discountPercentage!) / 100;
    return basePrice - discountAmount;
  };

  const isDiscounted = hasActiveDiscount();
  const finalPrice = calculateDiscountedPrice();

  const availableQuantity = useMemo(() => {
    // Calculate available quantity based on selected attributes
    let stock = product.countInStock || 0;

    // If product has variants and we have a selected variant, use variant stock
    if (selectedVariant && selectedVariant.stock !== undefined) {
      stock = selectedVariant.stock;
    } else if (product.variants && product.variants.length > 0) {
      // If variants exist but no specific one is selected, calculate total available stock
      // from all variants that match current selections
      const matchingVariants = product.variants.filter((v) => {
        const sizeMatches = !selectedSize || !v.size || v.size === selectedSize;
        const colorMatches =
          !selectedColor || !v.color || v.color === selectedColor;
        const ageGroupMatches =
          !selectedAgeGroup || !v.ageGroup || v.ageGroup === selectedAgeGroup;
        return sizeMatches && colorMatches && ageGroupMatches;
      });

      if (matchingVariants.length > 0) {
        stock = matchingVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
      }
    }

    return stock;
  }, [
    selectedVariant,
    selectedSize,
    selectedColor,
    selectedAgeGroup,
    product.countInStock,
    product.variants,
  ]);

  const router = useRouter();
  const { t, language } = useLanguage();

  // Display name and description based on selected language
  const displayName =
    language === "en" && product.nameEn ? product.nameEn : product.name;

  const displayDescription =
    language === "en" && product.descriptionEn
      ? product.descriptionEn
      : product.description;

  // Check if a specific size has any stock (with current color and ageGroup selections)
  const isSizeAvailable = (size: string): boolean => {
    if (!product.variants || product.variants.length === 0) return true;

    const matchingVariants = product.variants.filter((v) => {
      const sizeMatches = v.size === size;
      const colorMatches =
        !selectedColor || !v.color || v.color === selectedColor;
      const ageGroupMatches =
        !selectedAgeGroup || !v.ageGroup || v.ageGroup === selectedAgeGroup;
      return sizeMatches && colorMatches && ageGroupMatches;
    });

    return matchingVariants.some((v) => (v.stock || 0) > 0);
  };

  // Check if a specific color has any stock (with current size and ageGroup selections)
  const isColorAvailable = (color: string): boolean => {
    if (!product.variants || product.variants.length === 0) return true;

    const matchingVariants = product.variants.filter((v) => {
      const colorMatches = v.color === color;
      const sizeMatches = !selectedSize || !v.size || v.size === selectedSize;
      const ageGroupMatches =
        !selectedAgeGroup || !v.ageGroup || v.ageGroup === selectedAgeGroup;
      return colorMatches && sizeMatches && ageGroupMatches;
    });

    return matchingVariants.some((v) => (v.stock || 0) > 0);
  };

  // Check if a specific ageGroup has any stock (with current size and color selections)
  const isAgeGroupAvailable = (ageGroup: string): boolean => {
    if (!product.variants || product.variants.length === 0) return true;

    const matchingVariants = product.variants.filter((v) => {
      const ageGroupMatches = v.ageGroup === ageGroup;
      const sizeMatches = !selectedSize || !v.size || v.size === selectedSize;
      const colorMatches =
        !selectedColor || !v.color || v.color === selectedColor;
      return ageGroupMatches && sizeMatches && colorMatches;
    });

    return matchingVariants.some((v) => (v.stock || 0) > 0);
  };

  // Initialize default selections based on product data (extracted from variants if needed)
  useEffect(() => {
    // Set default size if sizes array exists
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }

    // Set default color if colors array exists
    if (availableColorsFromProduct.length > 0) {
      setSelectedColor(availableColorsFromProduct[0]);
    }

    // Set default age group if ageGroups array exists
    if (availableAgeGroupsFromProduct.length > 0) {
      setSelectedAgeGroup(availableAgeGroupsFromProduct[0]);
    }
  }, [
    availableSizes,
    availableColorsFromProduct,
    availableAgeGroupsFromProduct,
  ]);

  // Function to open fullscreen image
  const openFullscreen = () => {
    setIsFullscreenOpen(true);
  };

  // Function to close fullscreen image
  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
  };

  return (
    <div className="pd-container">
      {/* SEO Product Schema */}
      <ProductSchema product={product} productId={product._id} />

      <div className="pd-grid">
        {/* Left Column - Main Image with Thumbnails below */}
        <div className="pd-image-section">
          <div className="pd-image-container">
            {/* Discount Badge */}
            {isDiscounted && product.discountPercentage && (
              <div className="pd-discount-badge">
                -{product.discountPercentage}%
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="pd-image-wrapper"
                onClick={openFullscreen} // Add click handler to open fullscreen
              >
                <Image
                  src={allImages[currentImageIndex] || product.images[0]}
                  alt={displayName}
                  fill
                  quality={90}
                  priority
                  className="pd-details-image"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnails below main image */}
          <div className="pd-thumbnail-container">
            {allImages.map((image, index) => (
              <motion.button
                key={image}
                onClick={() => setCurrentImageIndex(index)}
                className={`pd-thumbnail ${
                  index === currentImageIndex ? "active" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={image}
                  alt={`${displayName} view ${index + 1}`}
                  fill
                  className="pd-object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="pd-product-info-details">
          {/* Brand Container */}
          <div
            className="pd-brand-container cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2"
            onClick={() =>
              product.user?.storeSlug &&
              router.push(`/store/${product.user.storeSlug}`)
            }
          >
            <div className="pd-brand-details">
              {!brandLogoError &&
                (product.brandLogo || product.user?.storeLogo) && (
                  <div className="pd-brand-logo">
                    <Image
                      src={product.brandLogo || product.user?.storeLogo || ""}
                      alt={`${product.brand || "Brand"} logo`}
                      width={40}
                      height={40}
                      className="pd-brand-logo-image"
                      onError={() => setBrandLogoError(true)}
                      unoptimized
                    />
                  </div>
                )}
              <div className="pd-brand-info">
                <div className="pd-brand-label">
                  {language === "en" ? "Brand" : "ბრენდი"}
                </div>
                <div className="pd-brand-name">
                  {product.brand ||
                    (language === "en"
                      ? "Unknown Brand"
                      : language === "ru"
                      ? "Неизвестный бренд"
                      : "უცნობი ბრენდი")}
                </div>
                {/* Seller Info */}
                {product.user && (
                  <div className="pd-seller-info">
                    <div className="pd-seller-label">
                      {language === "en"
                        ? "Seller"
                        : language === "ru"
                        ? "Продавец"
                        : "გამყიდველი"}
                    </div>
                    <div className="pd-seller-name">
                      {product.user.ownerFirstName && product.user.ownerLastName
                        ? `${product.user.ownerFirstName} ${product.user.ownerLastName}`
                        : product.user.name}
                    </div>
                    {/* Seller Address */}
                    {product.user.storeAddress && (
                      <div className="pd-seller-address">
                        <span className="pd-seller-address-icon">📍</span>
                        <span>{product.user.storeAddress}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <h1 className="pd-product-title">{displayName}</h1>{" "}
          <div className="pd-price-section">
            {isDiscounted ? (
              <div className="pd-price-container">
                <span className="pd-original-price-details">
                  {basePrice.toFixed(2)} {language === "en" ? "GEL" : "ლარი"}
                </span>
                <span className="pd-price pd-discounted-price-details">
                  {finalPrice.toFixed(2)} {language === "en" ? "GEL" : "ლარი"}
                </span>
              </div>
            ) : (
              <span className="pd-price">
                {basePrice.toFixed(2)} {language === "en" ? "GEL" : "ლარი"}
              </span>
            )}
          </div>
          <ShareButtons
            url={typeof window !== "undefined" ? window.location.href : ""}
            title={`Check out ${displayName} by ${product.brand} on FishHunt`}
          />
          <div className="pd-product-options-container">
            {/* Age Group Selector - Button Style */}
            {availableAgeGroupsFromProduct.length > 0 && (
              <div className="pd-variant-group">
                <label className="pd-variant-label">
                  {t("product.ageGroup") || "სხვა ატრიბუტი"}
                </label>
                <div className="pd-variant-buttons">
                  {availableAgeGroupsFromProduct.map((ageGroup) => (
                    <button
                      key={ageGroup}
                      type="button"
                      className={`pd-variant-btn ${
                        selectedAgeGroup === ageGroup ? "selected" : ""
                      } ${
                        !isAgeGroupAvailable(ageGroup) ? "out-of-stock" : ""
                      }`}
                      onClick={() => setSelectedAgeGroup(ageGroup)}
                      disabled={!isAgeGroupAvailable(ageGroup)}
                    >
                      {getLocalizedAgeGroupName(ageGroup)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector - Button Style like ASOS/Zara */}
            {availableSizes.length > 0 && (
              <div className="pd-variant-group">
                <label className="pd-variant-label">
                  {t("product.size") || "ზომა"}
                  {selectedSize && (
                    <span className="pd-selected-value">: {selectedSize}</span>
                  )}
                </label>
                <div className="pd-size-buttons">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`pd-size-btn ${
                        selectedSize === size ? "selected" : ""
                      } ${!isSizeAvailable(size) ? "out-of-stock" : ""}`}
                      onClick={() => setSelectedSize(size)}
                      disabled={!isSizeAvailable(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector - Circle Swatches like Amazon/Nike */}
            {availableColorsFromProduct.length > 0 && (
              <div className="pd-variant-group">
                <label className="pd-variant-label">
                  {t("product.color") || "ფერი"}
                  {selectedColor && (
                    <span className="pd-selected-value">
                      : {getLocalizedColorName(selectedColor)}
                    </span>
                  )}
                </label>
                <div className="pd-color-swatches">
                  {availableColorsFromProduct.map((color) => {
                    // Get color hex code - first from API, then from default map, then fallback
                    const apiColor = availableColors.find(
                      (c) => c.name === color
                    );
                    const colorHex =
                      apiColor?.hexCode ||
                      defaultColorHexMap[color] ||
                      defaultColorHexMap[color.toLowerCase()] ||
                      "#cccccc";
                    const isLightColor =
                      colorHex.toLowerCase() === "#ffffff" ||
                      colorHex.toLowerCase() === "#fff" ||
                      color === "თეთრი" ||
                      color === "white";
                    const colorAvailable = isColorAvailable(color);
                    // Check if this color has a specific image
                    const hasColorImage = getColorImage(color) !== null;
                    return (
                      <button
                        key={color}
                        type="button"
                        className={`pd-color-swatch ${
                          selectedColor === color ? "selected" : ""
                        } ${!colorAvailable ? "out-of-stock" : ""} ${
                          hasColorImage ? "has-image" : ""
                        }`}
                        onClick={() => handleColorSelect(color)}
                        disabled={!colorAvailable}
                        title={getLocalizedColorName(color)}
                        style={{ backgroundColor: colorHex }}
                      >
                        {selectedColor === color && (
                          <span
                            className="pd-color-check"
                            style={{ color: isLightColor ? "#333" : "#fff" }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Variant Attributes Selector */}
            {availableAttributesFromProduct.length > 0 && (
              <div className="pd-variant-group">
                <label className="pd-variant-label">
                  {language === "en" ? "Option" : "ვარიანტი"}
                  {selectedAttribute && (
                    <span className="pd-selected-value">
                      : {selectedAttribute}
                    </span>
                  )}
                </label>
                <div className="pd-variant-buttons">
                  {availableAttributesFromProduct.map((attr) => {
                    // Check if this attribute is available (has stock)
                    const attrAvailable = product.variants?.some(
                      (v) =>
                        v.attribute === attr &&
                        v.stock > 0 &&
                        (!selectedColor || !v.color || v.color === selectedColor) &&
                        (!selectedSize || !v.size || v.size === selectedSize) &&
                        (!selectedAgeGroup || !v.ageGroup || v.ageGroup === selectedAgeGroup)
                    );
                    return (
                      <button
                        key={attr}
                        type="button"
                        className={`pd-variant-btn ${
                          selectedAttribute === attr ? "selected" : ""
                        } ${!attrAvailable ? "out-of-stock" : ""}`}
                        onClick={() => setSelectedAttribute(attr)}
                        disabled={!attrAvailable}
                      >
                        {attr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector - Modern Style */}
            {availableQuantity > 0 && (
              <div className="pd-variant-group">
                <label className="pd-variant-label">
                  {t("product.quantity") || "რაოდენობა"}
                </label>
                <div className="pd-quantity-selector">
                  <button
                    type="button"
                    className="pd-qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="pd-qty-value">{quantity}</span>
                  <button
                    type="button"
                    className="pd-qty-btn"
                    onClick={() =>
                      setQuantity(Math.min(availableQuantity, quantity + 1))
                    }
                    disabled={quantity >= availableQuantity}
                  >
                    +
                  </button>
                </div>
                <span className="pd-stock-info">
                  {availableQuantity} {t("product.inStock") || "მარაგშია"}
                </span>
              </div>
            )}

            {/* Stock Status */}
            {availableQuantity <= 0 && (
              <div className="pd-out-of-stock-message">
                {t("shop.outOfStock") || "არ არის მარაგში"}
              </div>
            )}
          </div>
          {/* New Tabs UI with Description and Video */}
          <div className="pd-tabs">
            {/* Tab controls */}
            <div className="pd-tabs-list">
              <button
                className={`pd-tabs-trigger ${
                  activeTab === "description" ? "active" : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                {t("product.details") || "აღწერა"}
              </button>

              {product.videoDescription && (
                <button
                  className={`pd-tabs-trigger ${
                    activeTab === "video" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("video")}
                >
                  {language === "en" ? "Video" : "ვიდეო"}
                </button>
              )}
            </div>

            {/* Tab content */}
            <div
              className={`pd-tab-content ${
                activeTab === "description" ? "active" : ""
              }`}
            >
              <p className="pd-product-description">{displayDescription}</p>
            </div>

            {product.videoDescription && (
              <div
                className={`pd-tab-content ${
                  activeTab === "video" ? "active" : ""
                }`}
              >
                <div className="pd-video-container">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.videoDescription,
                    }}
                  />
                </div>
              </div>
            )}

            <AddToCartButton
              productId={product._id}
              countInStock={availableQuantity}
              className="pd-custom-style-2"
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              selectedAgeGroup={selectedAgeGroup}
              quantity={quantity}
              price={finalPrice}
              disabled={
                availableQuantity <= 0 ||
                (availableSizes.length > 0 && !selectedSize) ||
                (availableColorsFromProduct.length > 0 && !selectedColor) ||
                (availableAgeGroupsFromProduct.length > 0 && !selectedAgeGroup)
              }
            />
          </div>
          {/* Fullscreen Image Modal */}
          {isFullscreenOpen && (
            <div className="pd-fullscreen-modal" onClick={closeFullscreen}>
              <button
                className="pd-fullscreen-close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeFullscreen();
                }}
              >
                <X />
              </button>
              
              {/* Left Navigation Arrow */}
              {product.images.length > 1 && (
                <button
                  className="pd-fullscreen-nav pd-fullscreen-nav-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? product.images.length - 1 : prev - 1
                    );
                  }}
                >
                  <ChevronLeft size={32} />
                </button>
              )}
              
              <div
                className="pd-fullscreen-image-container"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={product.images[currentImageIndex]}
                  alt={displayName}
                  width={1200}
                  height={1200}
                  quality={100}
                  className="pd-fullscreen-image"
                />
                
                {/* Image Counter */}
                {product.images.length > 1 && (
                  <div className="pd-fullscreen-counter">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>
              
              {/* Right Navigation Arrow */}
              {product.images.length > 1 && (
                <button
                  className="pd-fullscreen-nav pd-fullscreen-nav-right"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) =>
                      prev === product.images.length - 1 ? 0 : prev + 1
                    );
                  }}
                >
                  <ChevronRight size={32} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="pd-reviews-section">
        <h2 className="pd-reviews-title">{t("product.reviews")}</h2>

        {/* Product Reviews */}
        <ProductReviews product={product} />

        {/* Review Form */}
        <div className="pd-review-form-container">
          <h3 className="pd-review-form-title">
            {language === "en"
              ? "Write a Review"
              : language === "ru"
              ? "Написать отзыв"
              : "შეფასების დაწერა"}
          </h3>
          <ReviewForm
            productId={product._id}
            onSuccess={() => {
              // Optionally refresh the product data to show new review
              window.location.reload();
            }}
          />
        </div>
      </div>

      {/* Similar Products Section */}
      <SimilarProducts
        currentProductId={product._id}
        subCategoryId={
          typeof product.subCategory === "string"
            ? product.subCategory
            : product.subCategory?.id || product.subCategory?._id || ""
        }
      />
    </div>
  );
}
