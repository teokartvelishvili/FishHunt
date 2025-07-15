"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/app/(pages)/admin/categories/hook/use-categories";
import { useLanguage } from "@/hooks/LanguageContext";
import "./CategoryNavigation.css";

// Function to get category-specific icon
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();

  if (
    name.includes("ნადირობა") ||
    name.includes("hunting") ||
    name.includes("rifle")
  ) {
    return "/gun.png";
  } else if (
    name.includes("საბრძოლო") ||
    name.includes("ammunition") ||
    name.includes("ammo")
  ) {
    return "/gun.png"; // Using gun icon for ammunition as well
  } else if (
    name.includes("დასვენება") ||
    name.includes("camping") ||
    name.includes("camp")
  ) {
    return "/camping.png";
  } else if (
    name.includes("თევზაობა") ||
    name.includes("fishing") ||
    name.includes("fish")
  ) {
    return "/fish.png";
  } else if (
    name.includes("ტანსაცმელი") ||
    name.includes("clothing") ||
    name.includes("clothes")
  ) {
    return "/clothes.png"; // Using filter icon for clothing
  } else if (
    name.includes("ტანსაცმელი") ||
    name.includes("clothes") ||
    name.includes("gear")
  ) {
    return "/clothes.png"; // Using filter icon for accessories
  } else {
    return "/clothes.png"; // Default icon
  }
};

const CategoryNavigation = () => {
  const { data: categories } = useCategories(false);
  const { language } = useLanguage();

  // Default categories (fallback if API fails or returns empty)
  const defaultCategories = [
    {
      id: 1,
      name: "ცეცხლსასროლი იარაღი",
      nameEn: "Firearms",
      href: "/shop/firearms",
    },
    { id: 2, name: "თევზაობა", nameEn: "Fishing", href: "/shop/fishing" },
    { id: 3, name: "კემპინგი", nameEn: "Camping", href: "/shop/camping" },
    {
      id: 4,
      name: "აქსესუარები",
      nameEn: "Accessories",
      href: "/shop/accessories",
    },
  ];

  // Use API categories if available, otherwise use default
  const categoriesToShow =
    categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="category-navigation">
      <div className="category-scroll-container">
        {categoriesToShow.map((category) => {
          const isApiCategory = categories && categories.length > 0;
          const href = isApiCategory
            ? `/shop?mainCategory=${category.id}`
            : defaultCategories.find((def) => def.id === category.id)?.href ||
              "/shop/categories";

          return (
            <Link key={category.id} href={href} className="main-category-item">
              <div className="category-icon">
                <Image
                  src={getCategoryIcon(category.name)}
                  alt={category.name}
                  width={24}
                  height={24}
                  className="icon category-icon"
                />
              </div>
              <span className="category-text">
                {language === "en"
                  ? category.nameEn || category.name
                  : category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNavigation;
