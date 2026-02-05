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
  ageGroup?: string;
  size?: string;
  color?: string;
  attribute?: string; // Additional variant attribute (e.g., "with frame", "with paddle") - set per variant
  attributeEn?: string; // English translation for the attribute
  stock: number;
  price?: number; // Optional price override for this variant
}

// Modified to create objects with named fields
export const generateCombinations = (
  attrArrays: string[][],
  index: number = 0,
  current: { ageGroup?: string; size?: string; color?: string } = {}
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
      newCombination
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
  const [stocks, setStocks] = useState<Record<string, StockItem>>({});
  const [initialized, setInitialized] = useState(false);

  // Generate combinations whenever attributes change
  const combinations = useMemo(() => {
    // Filter out empty attribute arrays
    const filteredAttributes = [...attributes]; // Create a copy to avoid mutating the original

    // Generate combinations with named fields
    return generateCombinations(filteredAttributes);
  }, [attributes]);

  // Update the stocks state whenever combinations change
  useEffect(() => {
    if (combinations.length === 0) return;

    // Create new stocks object preserving existing counts
    const newStocks: Record<string, StockItem> = {};

    // Add all new combinations
    combinations.forEach((combo) => {
      // Create a key from the combination fields (without attribute since it's per-variant)
      const key = JSON.stringify({
        ageGroup: combo.ageGroup,
        size: combo.size,
        color: combo.color,
      });

      // If already initialized and this combination exists, keep its values
      if (initialized && stocks[key]) {
        newStocks[key] = stocks[key];
        return;
      }

      // For new combinations or first initialization, try to find matching variant from initialData
      let initialStock = 0;
      let initialPrice: number | undefined =
        basePrice > 0 ? basePrice : undefined;
      let initialAttribute: string | undefined = undefined;

      if (initialData?.variants && initialData.variants.length > 0) {
        const matchingVariant = initialData.variants.find(
          (variant) =>
            variant.ageGroup === combo.ageGroup &&
            variant.size === combo.size &&
            variant.color === combo.color
        );
        if (matchingVariant) {
          initialStock = matchingVariant.stock || 0;
          initialAttribute = matchingVariant.attribute;
          // Use variant price if exists, otherwise fallback to basePrice
          initialPrice =
            matchingVariant.price !== undefined
              ? matchingVariant.price
              : basePrice > 0
              ? basePrice
              : undefined;
        }
      }

      newStocks[key] = {
        ...combo,
        stock: initialStock,
        price: initialPrice,
        attribute: initialAttribute,
      };
    });

    // Only update state if something changed
    const keysChanged =
      JSON.stringify(Object.keys(newStocks).sort()) !==
      JSON.stringify(Object.keys(stocks).sort());
    const valuesChanged = !initialized && Object.keys(newStocks).length > 0;

    if (keysChanged || valuesChanged) {
      setStocks(newStocks);
      if (!initialized) {
        setInitialized(true);
      }
    }
  }, [combinations, stocks, initialData?.variants, basePrice, initialized]);

  // Function to update stock count by combination fields
  const setStockCount = useCallback(
    (
      combo: { ageGroup?: string; size?: string; color?: string },
      stock: number
    ) => {
      const key = JSON.stringify({
        ageGroup: combo.ageGroup,
        size: combo.size,
        color: combo.color,
      });

      setStocks((prevStocks) => {
        // Check if this combination exists
        if (!prevStocks[key]) {
          console.warn(`Stock combination not found: ${JSON.stringify(combo)}`);
          return prevStocks;
        }

        // Return updated stocks
        return {
          ...prevStocks,
          [key]: {
            ...prevStocks[key],
            stock,
          },
        };
      });
    },
    []
  );

  // Function to update variant price by combination fields
  const setVariantPrice = useCallback(
    (
      combo: { ageGroup?: string; size?: string; color?: string },
      price: number | undefined
    ) => {
      const key = JSON.stringify({
        ageGroup: combo.ageGroup,
        size: combo.size,
        color: combo.color,
      });

      setStocks((prevStocks) => {
        // Check if this combination exists
        if (!prevStocks[key]) {
          console.warn(`Stock combination not found: ${JSON.stringify(combo)}`);
          return prevStocks;
        }

        // Return updated stocks with price
        return {
          ...prevStocks,
          [key]: {
            ...prevStocks[key],
            price,
          },
        };
      });
    },
    []
  );

  // Function to update variant attribute by combination fields
  const setVariantAttribute = useCallback(
    (
      combo: { ageGroup?: string; size?: string; color?: string },
      attribute: string | undefined
    ) => {
      const key = JSON.stringify({
        ageGroup: combo.ageGroup,
        size: combo.size,
        color: combo.color,
      });

      setStocks((prevStocks) => {
        // Check if this combination exists
        if (!prevStocks[key]) {
          console.warn(`Stock combination not found: ${JSON.stringify(combo)}`);
          return prevStocks;
        }

        // Return updated stocks with attribute
        return {
          ...prevStocks,
          [key]: {
            ...prevStocks[key],
            attribute,
          },
        };
      });
    },
    []
  );

  const [isInitialRender, setIsInitialRender] = useState(true);

  // Initialize stock counts and prices from initialData variants when combinations are ready
  useEffect(() => {
    if (combinations.length > 0 && isInitialRender && initialData?.variants) {
      console.log(
        "Setting initial stock counts and prices:",
        initialData.variants
      );

      initialData.variants.forEach((variant) => {
        console.log("Setting variant:", variant);
        setStockCount(variant, variant.stock);
        // Also set the price if it exists
        if (variant.price !== undefined) {
          setVariantPrice(variant, variant.price);
        }
        // Also set the attribute if it exists
        if (variant.attribute !== undefined) {
          setVariantAttribute(variant, variant.attribute);
        }
      });

      setIsInitialRender(false);
    }
  }, [
    combinations.length,
    isInitialRender,
    initialData?.variants,
    setStockCount,
    setVariantPrice,
    setVariantAttribute,
  ]);

  // Calculate total count from all stock items
  const totalCount = useMemo(
    () => Object.values(stocks).reduce((sum, item) => sum + item.stock, 0),
    [stocks]
  );

  // Function to set price for all variants that don't have a custom price
  const setAllVariantPrices = useCallback((basePrice: number) => {
    setStocks((prevStocks) => {
      const newStocks: Record<string, StockItem> = {};
      Object.entries(prevStocks).forEach(([key, item]) => {
        // Only set price if it's undefined or 0 (not custom set)
        // Or if the variant price was previously set to the old base price
        newStocks[key] = {
          ...item,
          price:
            item.price === undefined || item.price === 0
              ? basePrice
              : item.price,
        };
      });
      return newStocks;
    });
  }, []);

  // Return both the stocks array, the setter function, and total count
  return {
    stocks: useMemo(() => Object.values(stocks), [stocks]),
    setStockCount,
    setVariantPrice,
    setVariantAttribute,
    setAllVariantPrices,
    totalCount,
  };
};
