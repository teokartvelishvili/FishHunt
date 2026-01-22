"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import "./product-filters.css";
import { useLanguage } from "@/hooks/LanguageContext";
import { Category, SubCategory, Color, AgeGroupItem } from "@/types";
import HeartLoading from "@/components/HeartLoading/HeartLoading";
import Image from "next/image";

// Function to get category-specific icon from assets
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();

  if (
    name.includes("ნადირობა") ||
    name.includes("hunting") ||
    name.includes("rifle") ||
    name.includes("hunter")
  ) {
    return "/hunting.png";
  } else if (
    name.includes("დასვენება") ||
    name.includes("camping") ||
    name.includes("camp") ||
    name.includes("ლაშქრობა")
  ) {
    return "/camping.png";
  } else if (
    name.includes("თევზაობა") ||
    name.includes("fishing") ||
    name.includes("fish")
  ) {
    return "/fishing.png";
  } else {
    return "/shopping.png"; // Default icon
  }
};

interface FilterProps {
  onCategoryChange: (categoryId: string) => void;
  onSubCategoryChange: (subcategoryId: string) => void;
  onAgeGroupChange: (ageGroup: string) => void;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onSortChange: (sortOption: {
    field: string;
    direction: "asc" | "desc";
  }) => void;
  onBrandChange: (brand: string) => void;
  onDiscountFilterChange: (showDiscountedOnly: boolean) => void;
  selectedCategoryId?: string;
  selectedSubCategoryId?: string;
  selectedAgeGroup?: string;
  selectedSize?: string;
  selectedColor?: string;
  selectedBrand?: string;
  showDiscountedOnly?: boolean;
  priceRange?: [number, number]; // min, max
  onPriceRangeChange: (range: [number, number]) => void;
}

export function ProductFilters({
  onCategoryChange,
  onSubCategoryChange,
  onAgeGroupChange,
  onSizeChange,
  onColorChange,
  onSortChange,
  onBrandChange,
  onDiscountFilterChange,
  onPriceRangeChange,
  selectedCategoryId,
  selectedSubCategoryId,
  selectedAgeGroup,
  selectedSize,
  selectedColor,
  selectedBrand,
  showDiscountedOnly = false,
  priceRange = [0, 1000],
}: FilterProps) {
  const { language, t } = useLanguage();
  const [minPrice, setMinPrice] = useState(priceRange[0]);
  const [maxPrice, setMaxPrice] = useState(priceRange[1]);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [brandSearchTerm, setBrandSearchTerm] = useState<string>("");
  const [showBrands, setShowBrands] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt-desc');

  // Update local state when props change
  useEffect(() => {
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
  }, [priceRange]);

  // Auto-show subcategories when category is selected
  useEffect(() => {
    if (selectedCategoryId) {
      setShowSubcategories(true);
    } else {
      setShowSubcategories(false);
    }
  }, [selectedCategoryId]);

  // Fetch all categories with error handling
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    // Removing unused error variable
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth(
          "/categories?includeInactive=false"
        );
        if (!response.ok) {
          throw new Error(`Error fetching categories: ${response.status}`);
        }
        return response.json();
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError(t("shop.errorLoadingCategories"));
        return [];
      }
    },
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Fetch subcategories based on selected category with error handling
  const {
    data: subcategories = [],
    isLoading: isSubcategoriesLoading,
    // Removing unused error variable
  } = useQuery<SubCategory[]>({
    queryKey: ["subcategories", selectedCategoryId],
    queryFn: async () => {
      try {
        if (!selectedCategoryId) return [];
        const response = await fetchWithAuth(
          `/subcategories?categoryId=${selectedCategoryId}&includeInactive=false`
        );
        if (!response.ok) {
          throw new Error(`Error fetching subcategories: ${response.status}`);
        }
        return response.json();
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setError(t("shop.errorLoadingSubcategories"));
        return [];
      }
    },
    enabled: !!selectedCategoryId,
    retry: 2,
    refetchOnWindowFocus: false,
  });
  // Fetch all available brands for filtering with error handling
  const {
    data: availableBrands = [],
    isLoading: isBrandsLoading,
    // Removing unused error variable
  } = useQuery<string[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth("/products/brands");
        if (!response.ok) {
          // Try alternative endpoint
          const altResponse = await fetchWithAuth(
            "/products?page=1&limit=1000"
          );
          if (!altResponse.ok) {
            return []; // Silently fail if brands endpoint doesn't exist
          }
          const productsData = await altResponse.json();
          const products = productsData.items || productsData;
          // Extract unique brands from products
          const brands = [
            ...new Set(
              products
                .map((product: { brand?: string }) => product.brand)
                .filter(Boolean)
            ),
          ];
          return brands;
        }
        return response.json();
      } catch (err) {
        console.error("Failed to fetch brands:", err);
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
  // Fetch all colors for filtering with proper nameEn support
  const { data: availableColors = [] } = useQuery<Color[]>({
    queryKey: ["colors"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth("/categories/attributes/colors");
        if (!response.ok) {
          console.error("Failed to fetch colors:", response.status);
          return [];
        }
        return response.json();
      } catch (err) {
        console.error("Failed to fetch colors:", err);
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
  // Fetch all age groups for filtering with proper nameEn support
  const { data: availableAgeGroups = [] } = useQuery<AgeGroupItem[]>({
    queryKey: ["ageGroups"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth(
          "/categories/attributes/age-groups"
        );
        if (!response.ok) {
          console.error("Failed to fetch age groups:", response.status);
          return [];
        }
        return response.json();
      } catch (err) {
        console.error("Failed to fetch age groups:", err);
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Get available attributes based on selected subcategory
  const getAvailableAttributes = (
    attributeType: "ageGroups" | "sizes" | "colors"
  ): string[] => {
    if (!selectedSubCategoryId || !subcategories || subcategories.length === 0)
      return [];

    const selectedSubCategory = subcategories.find(
      (sub) =>
        sub.id === selectedSubCategoryId || sub._id === selectedSubCategoryId
    );

    if (!selectedSubCategory) return [];

    return selectedSubCategory[attributeType] || [];
  };

  // Get color hex code from color name
  const getColorHexCode = (colorName: string): string => {
    const colorLower = colorName.toLowerCase();
    
    // Georgian color mappings
    if (colorLower.includes('თეთრ') || colorLower === 'white') return '#ffffff';
    if (colorLower.includes('შავ') || colorLower === 'black') return '#000000';
    if (colorLower.includes('წითელ') || colorLower === 'red') return '#ff0000';
    if (colorLower.includes('მწვან') || colorLower === 'green') return '#00ff00';
    if (colorLower.includes('ლურჯ') || colorLower === 'blue') return '#0000ff';
    if (colorLower.includes('ყვითელ') || colorLower === 'yellow') return '#ffff00';
    if (colorLower.includes('ნარინჯ') || colorLower === 'orange') return '#ffa500';
    if (colorLower.includes('ვარდისფერ') || colorLower === 'pink') return '#ffc0cb';
    if (colorLower.includes('იისფერ') || colorLower === 'purple') return '#800080';
    if (colorLower.includes('ყავისფერ') || colorLower === 'brown') return '#a52a2a';
    if (colorLower.includes('რუხ') || colorLower.includes('ნაცრისფერ') || colorLower === 'gray' || colorLower === 'grey') return '#808080';
    if (colorLower.includes('ბეჟ') || colorLower === 'beige') return '#f5f5dc';
    if (colorLower.includes('ოქროსფერ') || colorLower === 'gold') return '#ffd700';
    if (colorLower.includes('ვერცხლისფერ') || colorLower === 'silver') return '#c0c0c0';
    if (colorLower === 'navy') return '#000080';
    if (colorLower === 'khaki') return '#f0e68c';
    if (colorLower === 'olive') return '#808000';
    if (colorLower === 'maroon') return '#800000';
    
    // Default: try to use the color name as-is
    return colorLower;
  };

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

  // Filter brands based on search term
  const getFilteredBrands = (): string[] => {
    if (!brandSearchTerm.trim()) {
      return availableBrands;
    }
    const searchTerm = brandSearchTerm.toLowerCase().trim();
    return availableBrands.filter(
      (brand) =>
        brand.toLowerCase().includes(searchTerm) ||
        brand.toLowerCase().startsWith(searchTerm)
    );
  };

  // Handle price range changes with validation
  const handlePriceChange = () => {
    // Validation
    if (minPrice < 0) {
      setMinPrice(0);
      return;
    }

    if (maxPrice < minPrice) {
      setMaxPrice(minPrice);
      return;
    }

    onPriceRangeChange([minPrice, maxPrice]);
  };

  // Translate category/subcategory names based on language
  const getLocalizedName = (
    name: string,
    originalItem?: { nameEn?: string }
  ): string => {
    if (language === "en") {
      // First check if the item has an English name field
      if (originalItem && originalItem.nameEn) {
        return originalItem.nameEn;
      }
      return name;
    }
    return name;
  };

  // Handle clearing specific filters
  // const clearCategoryFilter = () => {
  //   onCategoryChange("");
  //   onSubCategoryChange("");
  //   onAgeGroupChange("");
  //   onSizeChange("");
  //   onColorChange("");
  // };

  // const clearSubcategoryFilter = () => {
  //   onSubCategoryChange("");
  //   onAgeGroupChange("");
  //   onSizeChange("");
  //   onColorChange("");
  // };

  // Reset all filters to default values
  const resetAllFilters = () => {
    onCategoryChange("");
    onSubCategoryChange("");
    onAgeGroupChange("");
    onSizeChange("");
    onColorChange("");
    onBrandChange("");
    onDiscountFilterChange(false);
    setBrandSearchTerm("");
    setMinPrice(0);
    setMaxPrice(1000);
    onPriceRangeChange([0, 1000]);
  };

  // Adjust subcategory positioning on mobile - use fixed positioning
  useEffect(() => {
    const adjustSubcategoryPositioning = () => {
      if (window.innerWidth <= 768 && showSubcategories && selectedCategoryId) {
        const selectedCategory = document.querySelector(
          ".main-category-option.selected"
        );
        const subcategoryOverlay = document.querySelector(
          ".subcategories-overlay"
        ) as HTMLElement;

        if (selectedCategory && subcategoryOverlay) {
          const categoryRect = selectedCategory.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          // Position dropdown below the selected category
          const topPosition = categoryRect.bottom + 10;

          // Ensure dropdown doesn't go off screen
          const dropdownHeight = 200; // Approximate height
          const finalTop =
            topPosition + dropdownHeight > viewportHeight
              ? Math.max(10, categoryRect.top - dropdownHeight - 10)
              : topPosition;

          subcategoryOverlay.style.position = "fixed";
          subcategoryOverlay.style.top = `${finalTop}px`;
          subcategoryOverlay.style.left = "50%";
          subcategoryOverlay.style.transform = "translateX(-50%)";
          subcategoryOverlay.style.zIndex = "999999";
        }
      }
    };

    if (showSubcategories && selectedCategoryId) {
      // Small delay to ensure DOM is ready
      setTimeout(adjustSubcategoryPositioning, 100);
    }

    window.addEventListener("resize", adjustSubcategoryPositioning);
    window.addEventListener("scroll", adjustSubcategoryPositioning);
    return () => {
      window.removeEventListener("resize", adjustSubcategoryPositioning);
      window.removeEventListener("scroll", adjustSubcategoryPositioning);
    };
  }, [showSubcategories, selectedCategoryId]);

  // Scroll selected category into view on mobile
  useEffect(() => {
    if (selectedCategoryId && window.innerWidth <= 768) {
      setTimeout(() => {
        const selectedCategory = document.querySelector(
          ".main-category-option.selected"
        );
        if (selectedCategory) {
          selectedCategory.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }
      }, 200);
    }
  }, [selectedCategoryId]);

  // Click outside handler to close subcategories dropdown on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSubcategories && window.innerWidth <= 768) {
        const target = event.target as HTMLElement;
        const categoriesGrid = document.querySelector(".main-categories-grid");
        const subcategoriesOverlay = document.querySelector(
          ".subcategories-overlay"
        );

        // Check if click is outside both the categories grid and subcategories overlay
        if (
          categoriesGrid &&
          subcategoriesOverlay &&
          !categoriesGrid.contains(target) &&
          !subcategoriesOverlay.contains(target)
        ) {
          setShowSubcategories(false);
        }
      }
    };

    if (showSubcategories) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSubcategories]);

  return (
    <div className="product-filters">
      {/* Error Display */}
      {error && (
        <div className="filter-error">
          {error}
        </div>
      )}

      {/* Top Bar: Categories + Filter Button */}
      <div className="filters-top-bar">
        {/* Categories Section */}
        <div className="categories-section">
          {/* Main Categories Horizontal */}
          <div className="main-categories-horizontal">
            {isCategoriesLoading ? (
              <div className="filter-loading">
                <HeartLoading size="small" />
              </div>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id || category._id}
                  className={`main-category-option ${
                    selectedCategoryId === (category.id || category._id) ? 'selected' : ''
                  }`}
                  onClick={() => {
                    const categoryId = category.id || category._id || '';
                    if (selectedCategoryId === categoryId) {
                      onCategoryChange('');
                      setShowSubcategories(false);
                    } else {
                      onCategoryChange(categoryId);
                      setShowSubcategories(true);
                    }
                  }}
                >
                  <div className="category-icon-wrapper">
                    <Image
                      src={getCategoryIcon(category.name)}
                      alt={category.name}
                      width={24}
                      height={24}
                      className="category-icon"
                    />
                  </div>
                  <div className="category-name">
                    {getLocalizedName(category.name, category)}
                  </div>
                </div>
              ))
            ) : (
              <div className="filter-loading">
                {language === 'ge' ? 'კატეგორიები არ მოიძებნა' : 
                 language === 'en' ? 'No categories found' : 
                 'Категории не найдены'}
              </div>
            )}
          </div>
        </div>

        {/* Filter Toggle Button */}
        <button 
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {language === 'ge' ? 'ფილტრები' : language === 'en' ? 'Filters' : 'Фильтры'}
        </button>
      </div>

      {/* Subcategories - Dropdown */}
      <div className={`subcategories-wrapper ${showSubcategories && subcategories.length > 0 ? 'show' : ''}`}>
        <div className="subcategories-grid">
          {isSubcategoriesLoading ? (
            <div className="filter-loading">
              <HeartLoading size="small" />
            </div>
          ) : (
            subcategories.map((sub) => (
              <div
                key={sub.id || sub._id}
                className={`subcategory-option ${
                  selectedSubCategoryId === (sub.id || sub._id) ? 'selected' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  const subId = sub.id || sub._id || '';
                  onSubCategoryChange(subId === selectedSubCategoryId ? '' : subId);
                }}
              >
                {getLocalizedName(sub.name, sub)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Filters Panel */}
      <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
        <div className="filters-content">
          
          {/* Age Group Filter */}
          {selectedSubCategoryId && getAvailableAttributes('ageGroups').length > 0 && (
            <div className="filter-group">
              <label className="filter-label">
                {language === 'ge' ? 'სხვა ატრიბუტი' : language === 'en' ? 'Other Attribute' : 'Другой атрибут'}
              </label>
              <div className="attribute-options">
                {getAvailableAttributes('ageGroups').map((ageGroup) => (
                  <div
                    key={ageGroup}
                    className={`attribute-option ${selectedAgeGroup === ageGroup ? 'selected' : ''}`}
                    onClick={() => onAgeGroupChange(ageGroup === selectedAgeGroup ? '' : ageGroup)}
                  >
                    {getLocalizedAgeGroupName(ageGroup)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Size Filter */}
          {selectedSubCategoryId && getAvailableAttributes('sizes').length > 0 && (
            <div className="filter-group">
              <label className="filter-label">
                {language === 'ge' ? 'ზომა' : language === 'en' ? 'Size' : 'Размер'}
              </label>
              <div className="attribute-options">
                {getAvailableAttributes('sizes').map((size) => (
                  <div
                    key={size}
                    className={`attribute-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => onSizeChange(size === selectedSize ? '' : size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color Filter */}
          {selectedSubCategoryId && getAvailableAttributes('colors').length > 0 && (
            <div className="filter-group">
              <label className="filter-label">
                {language === 'ge' ? 'ფერი' : language === 'en' ? 'Color' : 'Цвет'}
              </label>
              <div className="color-options">
                {getAvailableAttributes('colors').map((color) => (
                  <div
                    key={color}
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => onColorChange(color === selectedColor ? '' : color)}
                    style={{ backgroundColor: getColorHexCode(color) }}
                    title={getLocalizedColorName(color)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Brand, Price & Discount Row */}
          <div className="filter-group">
            <div className="brand-price-discount-row">
              {/* Brand Filter */}
              {!isBrandsLoading && availableBrands && availableBrands.length > 0 && (
                <div className="brand-section">
                  <label className="filter-label">
                    {language === 'ge' ? 'ბრენდი' : language === 'en' ? 'Brand' : 'Бренд'}
                  </label>
                  <div className="brand-dropdown">
                    <button 
                      className="dropdown-toggle"
                      onClick={() => setShowBrands(!showBrands)}
                    >
                      {selectedBrand || (language === 'ge' ? 'აირჩიეთ ბრენდი' : language === 'en' ? 'Select Brand' : 'Выберите бренд')}
                      <span className="dropdown-arrow">{showBrands ? '▲' : '▼'}</span>
                    </button>
                    {showBrands && (
                      <div className="dropdown-menu">
                        <input
                          type="text"
                          placeholder={language === 'ge' ? 'ძებნა...' : language === 'en' ? 'Search...' : 'Поиск...'}
                          value={brandSearchTerm}
                          onChange={(e) => setBrandSearchTerm(e.target.value)}
                          className="brand-search"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="brand-options">
                          {getFilteredBrands().sort().map((brand) => (
                            <div
                              key={brand}
                              className={`brand-option ${selectedBrand === brand ? 'selected' : ''}`}
                              onClick={() => {
                                onBrandChange(brand === selectedBrand ? '' : brand);
                                setShowBrands(false);
                                setBrandSearchTerm('');
                              }}
                            >
                              {brand}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="price-section">
                <label className="filter-label">
                  {language === 'ge' ? 'ფასი' : language === 'en' ? 'Price' : 'Цена'}
                </label>
                <div className="price-range-inputs">
                  <div className="price-input-wrapper">
                    <input
                      type="number"
                      placeholder={language === 'ge' ? 'მინ.' : language === 'en' ? 'Min' : 'Мин.'}
                      value={minPrice}
                      onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                      onBlur={handlePriceChange}
                      className="price-input"
                    />
                  </div>
                  <span className="price-separator">-</span>
                  <div className="price-input-wrapper">
                    <input
                      type="number"
                      placeholder={language === 'ge' ? 'მაქს.' : language === 'en' ? 'Max' : 'Макс.'}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(minPrice, Number(e.target.value)))}
                      onBlur={handlePriceChange}
                      className="price-input"
                    />
                  </div>
                </div>
              </div>

              {/* Discount Filter */}
              <div className="discount-section">
                <label className="filter-label discount-label-hidden">
                  {language === 'ge' ? 'ფასდაკლება' : language === 'en' ? 'Discount' : 'Скидка'}
                </label>
                <label className="discount-filter">
                  <input
                    type="checkbox"
                    checked={showDiscountedOnly}
                    onChange={(e) => onDiscountFilterChange(e.target.checked)}
                    className="discount-checkbox"
                  />
                  <span className="discount-label">
                    {language === 'ge' ? 'ფასდაკლებით' : 
                     language === 'en' ? 'Discounted' : 
                     'Со скидкой'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Sorting & Reset Row */}
          <div className="filter-group">
            <div className="sort-reset-row">
              {/* Sorting Dropdown */}
              <div className="sort-section">
                <label className="filter-label">
                  {language === 'ge' ? 'სორტირება' : language === 'en' ? 'Sort by' : 'Сортировка'}
                </label>
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    const [field, direction] = e.target.value.split('-');
                    onSortChange({ field, direction: direction as 'asc' | 'desc' });
                  }}
                >
                  <option value="createdAt-desc">
                    {language === 'ge' ? 'უახლესი' : language === 'en' ? 'Newest' : 'Новейшие'}
                  </option>
                  <option value="price-asc">
                    {language === 'ge' ? 'ფასი: ზრდადობით' : language === 'en' ? 'Price: Low to High' : 'Цена: По возрастанию'}
                  </option>
                  <option value="price-desc">
                    {language === 'ge' ? 'ფასი: კლებადობით' : language === 'en' ? 'Price: High to Low' : 'Цена: По убыванию'}
                  </option>
                </select>
              </div>

              {/* Reset Filters Button */}
              <div className="reset-section">
                <label className="filter-label" style={{ opacity: 0, pointerEvents: 'none' }}>.</label>
                <button className="reset-filters-btn" onClick={resetAllFilters}>
                  {language === 'ge' ? 'გასუფთავება' : 
                   language === 'en' ? 'Clear filters' : 
                   'Очистить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
