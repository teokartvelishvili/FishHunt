"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./TopItems.module.css";
import noPhoto from "../../assets/nophoto.webp";
import fisher from "../../assets/fishing-rods-fly-fishing-clip-art-fishing-pole-70c32f173f79b4fbb4f724627b2f73b9.png";
import needle from "../../assets/fish-hook-circle-hook-fishing-bait-hooks-cbc2947b1d4849fa29ae5d039fbc8297.png";
import { getTopProducts } from "@/modules/products/api/get-top-products";
import { Product } from "@/types";

const TopItems: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const products = await getTopProducts();
        if (products && products.length > 0) {
          setTopProducts(products);
        }
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.innerHTML += scrollRef.current.innerHTML;
    }
  }, [topProducts]);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      Top Items
      <Image src={fisher} alt="Fisher Icon" className={styles.fisher} />
      <div className={styles.scroller} ref={scrollRef}>
        <div className={styles.inner}>
          {topProducts.map((product) => (
            <Link 
              href={`/products/${product._id}`} 
              key={product._id}
              className={styles.itemLink}
            >
              <div className={styles.itemCard}>
                <div className={styles.hookWrapper}>
                  <Image src={needle} alt="Hook" className={styles.hook} />
                </div>
                <div className={styles.imageWrapper}>
                  <Image 
                    src={product.images[0] || noPhoto}
                    alt={product.name}
                    fill
                    className={styles.productImage}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.productNameWrapper}>
                  <p className={styles.productName}>{product.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopItems;
