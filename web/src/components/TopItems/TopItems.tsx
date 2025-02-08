"use client";

import React, { useRef, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./TopItems.module.css";
import noPhoto from "../../assets/nophoto.webp";
import fisher from "../../assets/fishing-rods-fly-fishing-clip-art-fishing-pole-70c32f173f79b4fbb4f724627b2f73b9.png";
import needle from "../../assets/fish-hook-circle-hook-fishing-bait-hooks-cbc2947b1d4849fa29ae5d039fbc8297.png";

interface Item {
  id: number;
  name: string;
  imageUrl: string | StaticImageData;
}

const items: Item[] = [
  { id: 1, name: "Item 1", imageUrl: noPhoto },
  { id: 2, name: "Item 2", imageUrl: noPhoto },
  { id: 3, name: "Item 3", imageUrl: noPhoto },
  { id: 4, name: "Item 4", imageUrl: noPhoto },
  { id: 5, name: "Item 5", imageUrl: noPhoto },
  { id: 6, name: "Item 6", imageUrl: noPhoto },
  { id: 7, name: "Item 7", imageUrl: noPhoto },
];

const TopItems: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.innerHTML += scrollRef.current.innerHTML;
    }
  }, []);

  return (
    <div className={styles.container}>
      Top Items
      <Image src={fisher} alt="Fisher Icon" className={styles.fisher} />
      <div className={styles.scroller} ref={scrollRef}>
        <div className={styles.inner}>
          {items.map((item, index) => (
            <div key={index} className={styles.itemCard}>
              <div className={styles.hookWrapper}>
                <Image src={needle} alt="Hook" className={styles.hook} />
              </div>
              <Image src={item.imageUrl} alt={item.name} width={120} height={120} />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopItems;
