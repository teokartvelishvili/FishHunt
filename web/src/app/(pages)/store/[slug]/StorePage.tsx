"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/modules/products/components/product-grid";
import { getProducts } from "@/modules/products/api/get-products";
import { Product } from "@/types";
import { useLanguage } from "@/hooks/LanguageContext";
import { Loader2, MapPin, User, QrCode, X, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import { useAuth } from "@/hooks/use-auth";
import "./StorePage.css";

interface StoreData {
  store: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    address?: string;
    owner: string;
    description?: string;
    createdAt: string;
  };
  products: {
    items: Product[];
    total: number;
    page: number;
    pages: number;
  };
}

interface StorePageProps {
  slug: string;
}

function StorePageContent({ slug }: StorePageProps) {
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Check if current user is the store owner
  const isOwner = user && user.storeSlug === slug;

  useEffect(() => {
    // Fetch with owner check if user is logged in and is the owner
    fetchStoreData(isOwner || false);
  }, [slug, isOwner]);

  useEffect(() => {
    if (storeData) {
      console.log("Store data:", storeData);
      console.log("Store logo:", storeData.store.logo);
      console.log("Logo type:", typeof storeData.store.logo);
    }
  }, [storeData]);

  const fetchStoreData = async (ownerCheck: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const page = searchParams.get("page") || "1";
      const ownerParam = ownerCheck ? "&isOwner=true" : "";
      const response = await fetch(
        `/api/stores/${slug}?page=${page}${ownerParam}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError("Store not found");
          return;
        }
        throw new Error("Failed to fetch store data");
      }

      const data = await response.json();
      setStoreData(data);
    } catch (err) {
      console.error("Error fetching store:", err);
      setError("Failed to load store");
      toast({
        title: "Error",
        description: "Failed to load store data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon-container">
            <X className="error-icon" />
          </div>
          <h1 className="error-title">
            {error === "Store not found"
              ? "Store Not Found"
              : "Error Loading Store"}
          </h1>
          <p className="error-message">
            {error === "Store not found"
              ? "The store you are looking for does not exist."
              : "There was an error loading the store. Please try again."}
          </p>
          <Link href="/shop" className="error-button">
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const { store, products } = storeData;

  return (
    <div className="store-page">
      {/* Store Header */}
      <div className="store-header">
        <div className="store-header-content">
          <div className="store-header-flex">
            {/* Store Logo */}
            <div className="store-logo-container">
              {store.logo &&
              typeof store.logo === "string" &&
              store.logo.trim() ? (
                <div className="store-logo-wrapper">
                  <Image
                    src={store.logo}
                    alt={store.name}
                    width={140}
                    height={140}
                    className="store-logo"
                    onError={(e) => {
                      console.error("Logo failed to load:", store.logo);
                      // Hide the image if it fails to load
                      (e.target as HTMLImageElement).style.display = "none";
                      // Show the placeholder instead
                      const placeholder = (e.target as HTMLImageElement)
                        .nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = "flex";
                    }}
                  />
                  <div
                    className="store-logo-placeholder"
                    style={{ display: "none" }}
                  >
                    <User className="store-logo-icon" />
                  </div>
                </div>
              ) : (
                <div className="store-logo-placeholder">
                  <User className="store-logo-icon" />
                </div>
              )}
            </div>

            {/* Store Info */}
            <div className="store-info">
              <h1 className="store-name">{store.name}</h1>

              <div className="store-details">
                <div className="store-detail-item">
                  <User className="store-detail-icon" />
                  <span className="font-medium">{store.owner}</span>
                </div>

                {store.address && (
                  <div className="store-detail-item">
                    <MapPin className="store-detail-icon" />
                    <span>{store.address}</span>
                  </div>
                )}
              </div>

              {store.description && (
                <p className="store-description">{store.description}</p>
              )}

              {/* QR Code and Share */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <button
                  onClick={() => setShowQRModal(true)}
                  className="share-button"
                >
                  <QrCode className="share-button-icon" />
                  Share Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="products-header">
          <div className="products-header-top">
            <div>
              <h2 className="products-title">Products ({products.total})</h2>
              <p className="products-subtitle">
                Browse all products from {store.name}
              </p>
            </div>
            {isOwner && (
              <Link
                href="/admin/products/create"
                className="add-product-button"
              >
                <Plus size={20} />
                {t("store.addProduct")}
              </Link>
            )}
          </div>
        </div>

        {products.items.length > 0 ? (
          <div className="w-full">
            <ProductGrid
              products={products.items}
              currentPage={products.page}
              totalPages={products.pages}
              showStatus={isOwner || false}
            />
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-card">
              <svg
                className="empty-state-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="empty-state-title">No products yet</h3>
              <p className="empty-state-message">
                {store.name} hasn't added any products yet. Check back later!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="qr-modal-overlay">
          <div className="qr-modal-content">
            <div className="qr-modal-header">
              <h3 className="qr-modal-title">Share {store.name}</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="qr-modal-close"
              >
                <X className="qr-modal-close-icon" />
              </button>
            </div>

            <div className="qr-code-container">
              <div className="qr-code-wrapper">
                <QRCode
                  value={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                  size={200}
                  level="M"
                />
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <p className="qr-modal-description">
                Scan QR code or share the link
              </p>

              <div className="qr-modal-actions">
                <input
                  type="text"
                  value={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                  readOnly
                  className="qr-modal-input"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link Copied!",
                      description: "Store link has been copied to clipboard",
                    });
                  }}
                  className="qr-modal-copy-button"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StorePage({ slug }: StorePageProps) {
  return (
    <Suspense
      fallback={
        <div className="loading-container">
          <div className="loading-content">
            <Loader2 className="loading-spinner" />
            <p className="loading-text">Loading store...</p>
          </div>
        </div>
      }
    >
      <StorePageContent slug={slug} />
    </Suspense>
  );
}
