import Image from "next/image";
import Link from "next/link";
import "./ProductCard.css";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product._id}`} className="product-card">
      <div className="product-image">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="image"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-details">
          <p className="product-price">${product.price}</p>
          <div className="product-rating">
            <span>⭐</span>
            <span className="rating-text">
              {product.rating.toFixed(1)} ({product.numReviews})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
