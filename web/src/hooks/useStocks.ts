import { ProductFormData } from "@/modules/products/validation/product";
import { useMemo, useEffect, useState, useCallback } from "react";

interface UseStocksProps {
  initialData?: ProductFormData;
  attributes: [string[], string[], string[]]; // [ageGroups, sizes, colors]
  basePrice?: number; // Base price to use for new variants
}

// Updated StockItem to have named fields
interface StockItem {
  _id?: string; // Optional ID for existing items
  variantId: string; // Unique ID for this variant (for React key)
  ageGroup?: string;
  size?: string;
  color?: string;
  attribute?: string; // Additional variant attribute (e.g., "with frame", "with paddle") - set per variant
  attributeEn?: string; // English translation for the attribute
  stock: number;
  price?: number; // Optional price override for this variant
}

// Generate unique ID
let variantIdCounter = 0;
const generateVariantId = () => `variant_${++variantIdCounter}_${Date.now()}`;

// Modified to create objects with named fields
export const generateCombinations = (
  attrArrays: string[][],
  index: number = 0,
  current: { ageGroup?: string; size?: string; color?: string } = {},
): Array<{ ageGroup?: string; size?: string; color?: string }> => {
  // Return empty array if all attribute arrays are empty
  if (attrArrays.every((arr) => arr.length === 0)) {
    return [
      {
        // Default stock for empty combinations
      },
    ];
  }

  // Return current object if we've processed all attribute arrays
  if (index === attrArrays.length) {
    return [current];
  }

  // Skip empty arrays
  if (attrArrays[index].length === 0) {
    return generateCombinations(attrArrays, index + 1, current);
  }

  const combinations: Array<{
    ageGroup?: string;
    size?: string;
    color?: string;
  }> = [];

  for (const value of attrArrays[index]) {
    // Create a new combination based on the current index (field type)
    const newCombination = { ...current };

    // Assign the value to the appropriate field based on index
    if (index === 0) newCombination.ageGroup = value;
    else if (index === 1) newCombination.size = value;
    else if (index === 2) newCombination.color = value;

    // Recursively generate combinations for the next index
    const nextCombinations = generateCombinations(
      attrArrays,
      index + 1,
      newCombination,
    );

    combinations.push(...nextCombinations);
  }

  return combinations;
};

/**
 * Hook to generate all possible combinations of attributes with stock
 * @param attributes An array of arrays: [ageGroups, sizes, colors]
 * @param basePrice Base price to use for new variants
 * @returns An object with stocks array and setStockCount function
 */
export const useStocks = ({
  initialData,
  attributes,
  basePrice = 0,
}: UseStocksProps) => {
  // Use array of StockItems with unique variantId
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Generate combinations whenever attributes change
  const combinations = useMemo(() => {
    const filteredAttributes = [...attributes];
    return generateCombinations(filteredAttributes);
  }, [attributes]);

  // Update the stocks state whenever combinations change
  useEffect(() => {
    if (combinations.length === 0) return;

    // For edit mode, wait until we actually have variant data to load
    // Check if this is an edit (initialData exists) but variants haven't been loaded yet
    const isEditMode = initialData !== undefined;
    const hasVariantsToLoad = initialData?.variants && initialData.variants.length > 0;

    if (!initialized) {
      const newStocks: StockItem[] = [];

      // First, if we have initialData with variants, load ALL of them
      if (hasVariantsToLoad && initialData.variants) {
        initialData.variants.forEach((variant) => {
          newStocks.push({
            variantId: generateVariantId(),
            ageGroup: variant.ageGroup,
            size: variant.size,
            color: variant.color,
            stock: variant.stock || 0,
            price: variant.price,
            attribute: variant.attribute,
          });
        });
        
        // Mark as initialized only after loading variants
        setStocks(newStocks);
        setInitialized(true);
      } else if (!isEditMode) {
        // For new product mode (no initialData), create empty combinations
        combinations.forEach((combo) => {
          newStocks.push({
            variantId: generateVariantId(),
            ...combo,
            stock: 0,
            price: basePrice > 0 ? basePrice : undefined,
            attribute: undefined,
          });
        });
        
        setStocks(newStocks);
        setInitialized(true);
      }
      // If isEditMode but no variants yet, don't initialize - wait for variants to load
    } else {
      // When initialized, only add new combinations that don't exist
      // Don't remove or modify existing variants (to preserve stock/price from edit mode)
      setStocks((prevStocks) => {
        // Skip if no real combinations yet (all empty values)
        const hasRealCombinations = combinations.some(
          (c) => c.ageGroup || c.size || c.color
        );
        if (!hasRealCombinations && prevStocks.length > 0) {
          return prevStocks;
        }

        let updated = false;
        const newStocks = [...prevStocks];

        combinations.forEach((combo) => {
          // Check if this combination already exists (with any attribute)
          const exists = newStocks.some(
            (s) =>
              s.ageGroup === combo.ageGroup &&
              s.size === combo.size &&
              s.color === combo.color,
          );

          // Only add new base variant if no variant with this combination exists
          if (!exists) {
            updated = true;
            newStocks.push({
              variantId: generateVariantId(),
              ...combo,
              stock: 0,
              price: basePrice > 0 ? basePrice : undefined,
              attribute: undefined,
            });
          }
        });

        // Only filter out variants if combinations actually have values
        // This prevents removing variants when combinations is just [{}]
        if (hasRealCombinations) {
          const filteredStocks = newStocks.filter((stock) => {
            return combinations.some(
              (combo) =>
                combo.ageGroup === stock.ageGroup &&
                combo.size === stock.size &&
                combo.color === stock.color,
            );
          });

          if (filteredStocks.length !== newStocks.length) {
            updated = true;
            return filteredStocks;
          }
        }

        return updated ? newStocks : prevStocks;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combinations, initialData?.variants, basePrice, initialized]);

  // Function to update stock count by variantId
  const setStockCount = useCallback((variant: StockItem, stock: number) => {
    setStocks((prevStocks) =>
      prevStocks.map((s) =>
        s.variantId === variant.variantId ? { ...s, stock } : s,
      ),
    );
  }, []);

  // Function to update variant price by variantId
  const setVariantPrice = useCallback(
    (variant: StockItem, price: number | undefined) => {
      setStocks((prevStocks) =>
        prevStocks.map((s) =>
          s.variantId === variant.variantId ? { ...s, price } : s,
        ),
      );
    },
    [],
  );

  // Function to update variant attribute by variantId
  const setVariantAttribute = useCallback(
    (variant: StockItem, attribute: string | undefined) => {
      setStocks((prevStocks) =>
        prevStocks.map((s) =>
          s.variantId === variant.variantId ? { ...s, attribute } : s,
        ),
      );
    },
    [],
  );

  // Function to duplicate a variant (for adding variants with different attributes)
  const duplicateVariant = useCallback((variant: StockItem) => {
    setStocks((prevStocks) => {
      // Find a unique attribute name
      let duplicateNum = 1;
      let newAttribute = `ახალი_${duplicateNum}`;

      while (
        prevStocks.some(
          (s) =>
            s.ageGroup === variant.ageGroup &&
            s.size === variant.size &&
            s.color === variant.color &&
            s.attribute === newAttribute,
        )
      ) {
        duplicateNum++;
        newAttribute = `ახალი_${duplicateNum}`;
      }

      return [
        ...prevStocks,
        {
          ...variant,
          variantId: generateVariantId(),
          attribute: newAttribute,
          stock: 0,
        },
      ];
    });
  }, []);

  // Function to remove a variant
  const removeVariant = useCallback((variant: StockItem) => {
    setStocks((prevStocks) =>
      prevStocks.filter((s) => s.variantId !== variant.variantId),
    );
  }, []);

  // Calculate total count from all stock items
  const totalCount = useMemo(
    () => stocks.reduce((sum, item) => sum + item.stock, 0),
    [stocks],
  );

  // Function to set price for all variants that don't have a custom price
  const setAllVariantPrices = useCallback((newBasePrice: number) => {
    setStocks((prevStocks) =>
      prevStocks.map((item) => ({
        ...item,
        price:
          item.price === undefined || item.price === 0
            ? newBasePrice
            : item.price,
      })),
    );
  }, []);

  // Return both the stocks array, the setter function, and total count
  return {
    stocks,
    setStockCount,
    setVariantPrice,
    setVariantAttribute,
    setAllVariantPrices,
    duplicateVariant,
    removeVariant,
    totalCount,
  };
};
