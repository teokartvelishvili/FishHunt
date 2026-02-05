"use client";

import { Loader2, Package, Tag, Truck, Percent, Video, ImageIcon, Hash, Info, ChevronDown, ChevronRight, Layers, Palette, Ruler, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ProductFormData as BaseProductFormData } from "@/modules/products/validation/product";
import { useLanguage } from "@/hooks/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { Color, AgeGroupItem } from "@/types";
import "./CreateProductForm.css";
import Image from "next/image";
import { getAccessToken } from "@/lib/auth";
import { useUser } from "@/modules/auth/hooks/use-user";
import { Category, SubCategory } from "@/types";
import { useStocks } from "@/hooks/useStocks";

// Extended ProductFormData to include all needed properties
interface ProductFormData extends BaseProductFormData {
  _id?: string;
  nameEn?: string;
  descriptionEn?: string;
  mainCategory?: string | { name: string; id?: string; _id?: string };
  subCategory?: string | { name: string; id?: string; _id?: string };
  ageGroups?: string[];
  sizes?: string[];
  colors?: string[];
  hashtags?: string[];
  categoryId?: string;
  categoryStructure?: {
    main: string;
    sub: string;
    ageGroup?: string;
  };
  videoDescription?: string; // YouTube embed code or URL
  // Discount functionality
  discountPercentage?: number;
  discountStartDate?: string;
  discountEndDate?: string;
}

interface CreateProductFormProps {
  initialData?: ProductFormData;
  onSuccess?: (data: {
    id: string;
    name: string;
    [key: string]: string | number | boolean | null | undefined;
  }) => void;
  isEdit?: boolean;
}

export function CreateProductForm({
  initialData,
  onSuccess,
  isEdit = !!initialData?._id,
}: CreateProductFormProps) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const { user } = useUser();
  const isSeller = user?.role?.toLowerCase() === "seller";

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});
  const [formData, setFormData] = useState<
    ProductFormData & { _id?: string; videoFile?: File }
  >(
    initialData || {
      name: "",
      nameEn: "",
      price: 0,
      description: "",
      descriptionEn: "",
      images: [],
      brand: "FishHunt", // Set default brand here
      category: "",
      subcategory: "",
      countInStock: 0,
      hashtags: [],
      brandLogo: undefined,
      videoDescription: "",
      videoFile: undefined,
    },
  );

  // State for new category structure
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Color images state: map color name to image File or URL
  const [colorImages, setColorImages] = useState<
    Record<string, File | string | null>
  >({});

  const [availableAgeGroups, setAvailableAgeGroups] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  const [deliveryType, setDeliveryType] = useState<"SELLER" | "FishHunt">(
    "FishHunt",
  );
  const [minDeliveryDays, setMinDeliveryDays] = useState("");
  const [maxDeliveryDays, setMaxDeliveryDays] = useState("");

  // Discount functionality states
  const [discountPercentage, setDiscountPercentage] = useState<string>("");
  const [discountStartDate, setDiscountStartDate] = useState<string>("");
  const [discountEndDate, setDiscountEndDate] = useState<string>("");

  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [videoUploadStatus, setVideoUploadStatus] = useState<string | null>(
    null,
  );
  const [isVariantsExpanded, setIsVariantsExpanded] = useState(false);
  const [isAttributesExpanded, setIsAttributesExpanded] = useState(false);

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories?includeInactive=false`,
      );
      return response.json();
    },
  });

  // Fetch subcategories based on selected category
  const { data: subcategories, isLoading: isSubcategoriesLoading } = useQuery<
    SubCategory[]
  >({
    queryKey: ["subcategories", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subcategories?categoryId=${selectedCategory}&includeInactive=false`,
      );
      return response.json();
    },
    enabled: !!selectedCategory,
  });

  // Fetch all colors for proper nameEn support
  const { data: availableColorsData = [] } = useQuery<Color[]>({
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
  const { data: availableAgeGroupsData = [] } = useQuery<AgeGroupItem[]>({
    queryKey: ["ageGroups"],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth(
          "/categories/attributes/age-groups",
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
      // Find the color in availableColorsData to get its English name
      const colorObj = availableColorsData.find(
        (color) => color.name === colorName,
      );
      return colorObj?.nameEn || colorName;
    }
    return colorName;
  };

  // Get localized age group name based on current language
  const getLocalizedAgeGroupName = (ageGroupName: string): string => {
    if (language === "en") {
      // Find the age group in availableAgeGroupsData to get its English name
      const ageGroupObj = availableAgeGroupsData.find(
        (ageGroup) => ageGroup.name === ageGroupName,
      );
      return ageGroupObj?.nameEn || ageGroupName;
    }
    return ageGroupName;
  };

  // Update available attributes when subcategory changes
  useEffect(() => {
    if (subcategories && selectedSubcategory) {
      const subcategory = subcategories.find(
        (sub) => sub.id === selectedSubcategory,
      );
      if (subcategory) {
        setAvailableAgeGroups(subcategory.ageGroups || []);
        setAvailableSizes(subcategory.sizes || []);
        setAvailableColors(subcategory.colors || []);
      }
    }
  }, [subcategories, selectedSubcategory]);

  // Auto-fill seller info when user data loads
  useEffect(() => {
    if (user && isSeller && !isEdit) {
      setFormData((prevData) => ({
        ...prevData,
        brand: user.name || user.storeName || "FishHunt",
        brandLogo: user.storeLogo || undefined,
      }));
    }
  }, [user, isSeller, isEdit]);

  useEffect(() => {
    if (initialData) {
      console.log("InitialData received:", initialData);
      console.log("InitialData hashtags:", initialData.hashtags);
      console.log("InitialData variants:", initialData.variants);

      // Extract ageGroups, sizes, colors from variants if product-level arrays are empty
      let extractedAgeGroups = initialData.ageGroups || [];
      let extractedSizes = initialData.sizes || [];
      let extractedColors = initialData.colors || [];

      // If product-level arrays are empty but variants exist, extract from variants
      if (initialData.variants && initialData.variants.length > 0) {
        if (extractedAgeGroups.length === 0) {
          const ageGroupsFromVariants = initialData.variants
            .map((v) => v.ageGroup)
            .filter((ag): ag is string => !!ag);
          extractedAgeGroups = [...new Set(ageGroupsFromVariants)];
        }
        if (extractedSizes.length === 0) {
          const sizesFromVariants = initialData.variants
            .map((v) => v.size)
            .filter((s): s is string => !!s);
          extractedSizes = [...new Set(sizesFromVariants)];
        }
        if (extractedColors.length === 0) {
          const colorsFromVariants = initialData.variants
            .map((v) => v.color)
            .filter((c): c is string => !!c);
          extractedColors = [...new Set(colorsFromVariants)];
        }
      }

      // Basic form data setup
      setFormData((prev) => ({
        ...prev,
        _id: initialData._id,
        name: initialData.name || "",
        nameEn: initialData.nameEn || "",
        brand: initialData.brand || "FishHunt",
        brandLogo:
          typeof initialData.brandLogo === "string"
            ? initialData.brandLogo
            : undefined,
        category: initialData.category || "",
        images: initialData.images || [],
        description: initialData.description || "",
        descriptionEn: initialData.descriptionEn || "",
        price: initialData.price || 0,
        countInStock: initialData.countInStock || 0,
        ageGroups: extractedAgeGroups,
        sizes: extractedSizes,
        colors: extractedColors,
        hashtags: initialData.hashtags || [],
        videoDescription: initialData.videoDescription || "",
      }));

      // Set hashtags input text
      const hashtagsText =
        initialData.hashtags && initialData.hashtags.length > 0
          ? initialData.hashtags.join(", ")
          : "";
      setHashtagsInput(hashtagsText);

      if (initialData.deliveryType) {
        setDeliveryType(initialData.deliveryType as "SELLER" | "FishHunt");
      }
      if (initialData.minDeliveryDays) {
        setMinDeliveryDays(initialData.minDeliveryDays.toString());
      }
      if (initialData.maxDeliveryDays) {
        setMaxDeliveryDays(initialData.maxDeliveryDays.toString());
      }

      // Set discount fields
      if (initialData.discountPercentage) {
        setDiscountPercentage(initialData.discountPercentage.toString());
      }
      if (initialData.discountStartDate) {
        // Convert date to YYYY-MM-DD format for HTML date input
        const startDate = new Date(initialData.discountStartDate);
        if (!isNaN(startDate.getTime())) {
          setDiscountStartDate(startDate.toISOString().split("T")[0]);
        }
      }
      if (initialData.discountEndDate) {
        // Convert date to YYYY-MM-DD format for HTML date input
        const endDate = new Date(initialData.discountEndDate);
        if (!isNaN(endDate.getTime())) {
          setDiscountEndDate(endDate.toISOString().split("T")[0]);
        }
      }

      // Extract category ID correctly, handling both object and string formats
      if (initialData.mainCategory) {
        const categoryId =
          typeof initialData.mainCategory === "object"
            ? initialData.mainCategory._id || initialData.mainCategory.id
            : initialData.mainCategory;

        setSelectedCategory(String(categoryId || ""));
      } else if (initialData.categoryId) {
        setSelectedCategory(String(initialData.categoryId || ""));
      }

      // Load existing color images
      console.log("InitialData colorImages:", (initialData as any).colorImages);
      if (
        (initialData as any).colorImages &&
        Array.isArray((initialData as any).colorImages)
      ) {
        const existingColorImages: Record<string, string> = {};
        (initialData as any).colorImages.forEach(
          (ci: { color: string; image: string }) => {
            existingColorImages[ci.color] = ci.image;
          },
        );
        console.log(
          "Setting colorImages from initialData:",
          existingColorImages,
        );
        setColorImages(existingColorImages);
      }
    }
  }, [initialData]);

  // Add a separate effect for handling subcategory after category is set and subcategories are loaded
  useEffect(() => {
    // Only run this effect when editing and we have both initialData and subcategories loaded
    if (
      initialData &&
      selectedCategory &&
      subcategories &&
      subcategories.length > 0
    ) {
      // Extract subcategory ID correctly, handling both object and string formats
      if (initialData.subCategory) {
        const subcategoryId =
          typeof initialData.subCategory === "object"
            ? initialData.subCategory._id || initialData.subCategory.id
            : initialData.subCategory;

        setSelectedSubcategory(String(subcategoryId || ""));
      } else if (initialData.subcategory) {
        setSelectedSubcategory(String(initialData.subcategory || ""));
      }
    }
  }, [initialData, selectedCategory, subcategories]);

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      price: 0,
      description: "",
      descriptionEn: "",
      images: [],
      brand: "FishHunt", // Set default brand here too
      category: "",
      subcategory: "",
      countInStock: 0,
      hashtags: [],
      ageGroups: [],
      sizes: [],
      colors: [],
      brandLogo: undefined,
      videoFile: undefined,
    });
    setHashtagsInput("");
    setErrors({});
    setServerError(null);
    setSuccess(null);
    setVideoUploadStatus(null);

    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedAgeGroups([]);
    setSelectedSizes([]);
    setSelectedColors([]);

    setDeliveryType("FishHunt");
    setMinDeliveryDays("");
    setMaxDeliveryDays("");
  };
  const validateField = (field: keyof ProductFormData, value: unknown) => {
    // All validation is handled with translation keys for consistent language support
    let translatedError: string | null = null;

    switch (field) {
      case "name":
        if (!value || String(value).trim() === "") {
          translatedError = t("adminProducts.productNameRequired");
        } else if (String(value).length < 2) {
          translatedError = t("adminProducts.productNameInvalid");
        }
        break;
      case "price":
        if (!value || value === "" || value === 0) {
          translatedError = t("adminProducts.priceRequired");
        } else if (Number(value) <= 0 || isNaN(Number(value))) {
          translatedError = t("adminProducts.priceInvalid");
        }
        break;
      case "description":
        if (!value || String(value).trim() === "") {
          translatedError = t("adminProducts.descriptionRequired");
        } else if (String(value).length < 10) {
          translatedError = t("adminProducts.descriptionInvalid");
        }
        break;
      case "brand":
        if (!value || String(value).trim() === "") {
          translatedError = t("adminProducts.brandRequired");
        } else if (String(value).length < 2) {
          translatedError = t("adminProducts.brandInvalid");
        }
        break;
      case "countInStock":
        if (value !== undefined && value !== null && value !== "") {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            translatedError = t("adminProducts.priceInvalid"); // Reuse price validation message for now
          }
        }
        break;
      // Note: Other fields don't need explicit validation here as they're handled elsewhere
      // or don't require complex validation
    }
    if (translatedError) {
      setErrors((prev) => ({ ...prev, [field]: translatedError }));
      return false;
    } else {
      // Remove the error from the errors object completely
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const processedValue =
      name === "price" || name === "countInStock" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // When base price changes, update all variants that don't have custom prices
    if (
      name === "price" &&
      typeof processedValue === "number" &&
      processedValue > 0
    ) {
      setAllVariantPrices(processedValue);
    }

    // Validate the field in real-time to clear errors as user types
    if (
      name in { name: 1, price: 1, description: 1, brand: 1, countInStock: 1 }
    ) {
      validateField(name as keyof ProductFormData, processedValue);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubcategory("");
    setSelectedAgeGroups([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setAvailableAgeGroups([]);
    setAvailableSizes([]);
    setAvailableColors([]);
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategoryId = e.target.value;
    setSelectedSubcategory(subcategoryId);
    setSelectedAgeGroups([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const handleAttributeChange = (
    type: "ageGroups" | "sizes" | "colors",
    value: string,
  ) => {
    if (type === "ageGroups") {
      setSelectedAgeGroups((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value],
      );
    } else if (type === "sizes") {
      setSelectedSizes((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value],
      );
    } else if (type === "colors") {
      setSelectedColors((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value],
      );
    }
  };

  // Add state for hashtags input text
  const [hashtagsInput, setHashtagsInput] = useState<string>("");

  // Hashtags handling functions
  const handleHashtagsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setHashtagsInput(value);

    // Update hashtags array in real-time
    const hashtagsArray = value
      ? value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    setFormData((prev) => ({
      ...prev,
      hashtags: hashtagsArray,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const newImages = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle color image upload
  const handleColorImageChange = (
    color: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setColorImages((prev) => ({
        ...prev,
        [color]: file,
      }));
    }
  };

  // Remove color image
  const handleRemoveColorImage = (color: string) => {
    setColorImages((prev) => {
      const updated = { ...prev };
      delete updated[color];
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setPending(true);
    setServerError(null);
    setSuccess(null);
    setVideoUploadStatus(null); // Clear video upload status

    try {
      // Use validateField for validating form fields
      const isNameValid = validateField("name", formData.name);
      const isPriceValid = validateField("price", formData.price);
      const isDescriptionValid = validateField(
        "description",
        formData.description,
      );

      if (!isNameValid || !isPriceValid || !isDescriptionValid) {
        setPending(false);
        return;
      }

      // Validate required fields
      if (!selectedCategory) {
        setServerError(t("adminProducts.selectCategoryError"));
        setPending(false);
        return;
      }

      if (!selectedSubcategory) {
        setServerError(t("adminProducts.selectSubcategoryError"));
        setPending(false);
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (
        formData.images.some(
          (image) =>
            image instanceof File && !allowedTypes.includes(image.type),
        )
      ) {
        setErrors((prev) => ({
          ...prev,
          images: t("adminProducts.invalidImageFormat"),
        }));
        setPending(false);
        return;
      } // Verify we have at least one image
      if (formData.images.length === 0) {
        setErrors((prev) => ({
          ...prev,
          images: t("adminProducts.noImageSelected"),
        }));
        setPending(false);
        return;
      }

      if (deliveryType === "SELLER" && (!minDeliveryDays || !maxDeliveryDays)) {
        setServerError(t("adminProducts.deliveryDaysRequired"));
        setPending(false);
        return;
      }

      // Validate discount fields
      if (discountPercentage && parseFloat(discountPercentage) > 0) {
        const discountValue = parseFloat(discountPercentage);
        if (discountValue < 0 || discountValue > 100) {
          setServerError(
            language === "en"
              ? "Discount percentage must be between 0 and 100"
              : "ფასდაკლების პროცენტი უნდა იყოს 0-სა და 100-ს შორის",
          );
          setPending(false);
          return;
        }

        // If discount is set, validate dates
        if (discountStartDate && discountEndDate) {
          const startDate = new Date(discountStartDate);
          const endDate = new Date(discountEndDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (endDate <= startDate) {
            setServerError(
              language === "en"
                ? "Discount end date must be after start date"
                : "ფასდაკლების დასრულების თარიღი უნდა იყოს დაწყების თარიღის შემდეგ",
            );
            setPending(false);
            return;
          }
        }
      }

      const token = getAccessToken();
      if (!token) {
        setServerError(t("adminProducts.authError"));
        setPending(false);
        setTimeout(() => {
          window.location.href = "/login?redirect=/admin/products";
        }, 2000);
        return;
      }

      const formDataToSend = new FormData();

      // Add basic form fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("nameEn", formData.nameEn || "");
      formDataToSend.append("price", String(formData.price));
      formDataToSend.append("description", formData.description);
      formDataToSend.append("descriptionEn", formData.descriptionEn || "");

      // Add video description if present
      if (formData.videoDescription) {
        formDataToSend.append("videoDescription", formData.videoDescription);
      }

      formDataToSend.append("countInStock", String(totalCount));

      // Add new category structure - ensure we're sending strings, not objects
      formDataToSend.append("mainCategory", selectedCategory);
      formDataToSend.append("subCategory", selectedSubcategory);

      // Add selected attributes
      if (selectedAgeGroups.length > 0) {
        formDataToSend.append("ageGroups", JSON.stringify(selectedAgeGroups));
      }

      if (selectedSizes.length > 0) {
        formDataToSend.append("sizes", JSON.stringify(selectedSizes));
      }

      if (selectedColors.length > 0) {
        formDataToSend.append("colors", JSON.stringify(selectedColors));
      }

      // Add hashtags if they exist
      if (formData.hashtags && formData.hashtags.length > 0) {
        formDataToSend.append("hashtags", JSON.stringify(formData.hashtags));
      }

      if (stocks.length > 0) {
        console.log("Sending stocks:", stocks);
        formDataToSend.append("variants", JSON.stringify(stocks));
      }

      // Handle brand name - ensure it's always set to FishHunt if empty
      if (isSeller) {
        formDataToSend.append(
          "brand",
          user?.name || user?.storeName || formData.brand || "FishHunt",
        );
      } else {
        formDataToSend.append("brand", formData.brand || "FishHunt");
      }

      // SIMPLIFIED logo handling - THIS IS THE FIX
      // For new uploads (File objects)
      if (formData.brandLogo instanceof File) {
        formDataToSend.append("brandLogo", formData.brandLogo);
      }
      // For existing logo URLs - just pass the URL as a string
      else if (typeof formData.brandLogo === "string" && formData.brandLogo) {
        formDataToSend.append("brandLogoUrl", formData.brandLogo);
      }
      // For sellers with profiles - use their store logo
      else if (isSeller && user?.storeLogo) {
        formDataToSend.append("brandLogoUrl", user.storeLogo);
      }

      // Add delivery type
      formDataToSend.append("deliveryType", deliveryType);

      // Add delivery days if SELLER type
      if (deliveryType === "SELLER") {
        formDataToSend.append("minDeliveryDays", minDeliveryDays);
        formDataToSend.append("maxDeliveryDays", maxDeliveryDays);
      }

      // Add discount fields
      if (discountPercentage && parseFloat(discountPercentage) > 0) {
        formDataToSend.append("discountPercentage", discountPercentage);
      }
      if (discountStartDate) {
        formDataToSend.append("discountStartDate", discountStartDate);
      }
      if (discountEndDate) {
        formDataToSend.append("discountEndDate", discountEndDate);
      }

      // Handle color images
      console.log("colorImages state before submit:", colorImages);
      const colorImageColors: string[] = [];
      const colorImageFiles: File[] = [];
      const existingColorImages: { color: string; image: string }[] = [];

      Object.entries(colorImages).forEach(([color, imageOrUrl]) => {
        console.log(
          `Color: ${color}, type: ${typeof imageOrUrl}, isFile: ${
            imageOrUrl instanceof File
          }`,
        );
        if (imageOrUrl instanceof File) {
          colorImageColors.push(color);
          colorImageFiles.push(imageOrUrl);
        } else if (typeof imageOrUrl === "string") {
          existingColorImages.push({ color, image: imageOrUrl });
        }
      });

      console.log("colorImageFiles to send:", colorImageFiles.length);
      console.log("existingColorImages to send:", existingColorImages);

      // Append color image files
      colorImageFiles.forEach((file) => {
        formDataToSend.append("colorImageFiles", file);
      });

      // Append color names for new files
      if (colorImageColors.length > 0) {
        formDataToSend.append(
          "colorImageColors",
          JSON.stringify(colorImageColors),
        );
      }

      // Append existing color images
      if (existingColorImages.length > 0) {
        formDataToSend.append(
          "existingColorImages",
          JSON.stringify(existingColorImages),
        );
      }

      // Handle images - separate existing images from new ones
      const existingImages: string[] = [];
      const newFiles: File[] = [];

      formData.images.forEach((image) => {
        if (typeof image === "string") {
          existingImages.push(image);
        } else if (image instanceof File) {
          newFiles.push(image);
        }
      });

      // Add existing images as JSON array
      if (existingImages.length > 0) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }

      // Add new image files
      if (newFiles.length > 0) {
        newFiles.forEach((file) => {
          formDataToSend.append("images", file);
        });
      } else if (existingImages.length === 0) {
        // If no images are provided at all, throw an error
        setErrors((prev) => ({
          ...prev,
          images: t("adminProducts.noImageSelected"),
        }));
        setPending(false);
        return;
      }

      // Double check that we're sending either existingImages or new images
      const hasImages =
        (formDataToSend.has("existingImages") &&
          JSON.parse(formDataToSend.get("existingImages") as string).length >
            0) ||
        formDataToSend.getAll("images").length > 0;
      if (!hasImages) {
        setErrors((prev) => ({
          ...prev,
          images: t("adminProducts.noImageSelected"),
        }));
        setPending(false);
        return;
      }

      const method = isEdit ? "PUT" : "POST";
      const endpoint = isEdit ? `/products/${formData._id}` : "/products";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method,
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        let errorMessage = t("adminProducts.createUpdateError");
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Upload video to YouTube if provided (works for both create and edit)
      if (formData.videoFile) {
        try {
          console.log("🎬 ვიდეოს ატვირთვა იწყება...");
          console.log(
            "📁 ვიდეო ფაილი:",
            formData.videoFile.name,
            formData.videoFile.size,
            "bytes",
          );

          setVideoUploadStatus(
            language === "en"
              ? "📤 Uploading video to YouTube..."
              : "📤 ვიდეო იტვირთება YouTube-ზე...",
          );

          // Get correct product ID for video description
          const productIdForVideo = isEdit ? formData._id : data._id || data.id;

          const videoFormData = new FormData();
          videoFormData.append("video", formData.videoFile);
          videoFormData.append("title", `${formData.name} - ${formData.brand}`);
          videoFormData.append(
            "description",
            `${
              formData.description
            }\n\n🛒 იხილეთ პროდუქტი: https://fishhunt.ge/products/${productIdForVideo}\n\n${
              formData.hashtags?.map((tag) => `#${tag}`).join(" ") || ""
            }`,
          );
          videoFormData.append("tags", formData.hashtags?.join(",") || "");
          videoFormData.append("privacyStatus", "public");

          console.log(
            "📤 გაგზავნის URL:",
            `${process.env.NEXT_PUBLIC_API_URL}/youtube/upload`,
          );
          console.log("🔑 Token:", token ? "არსებობს ✓" : "არ არის ❌");

          const videoResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/youtube/upload`,
            {
              method: "POST",
              body: videoFormData,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          console.log("📥 Response Status:", videoResponse.status);
          console.log("📥 Response OK:", videoResponse.ok);

          console.log("📥 Response Status:", videoResponse.status);
          console.log("📥 Response OK:", videoResponse.ok);

          if (videoResponse.ok) {
            const videoData = await videoResponse.json();
            console.log("✅ ვიდეო წარმატებით აიტვირთა:", videoData);

            setVideoUploadStatus(
              language === "en"
                ? "🔄 Updating product with video..."
                : "🔄 პროდუქტი ახლდება ვიდეოთი...",
            );

            // Update product with video embed URL
            const updateFormData = new FormData();
            updateFormData.append(
              "videoDescription",
              `<iframe width="560" height="315" src="${videoData.embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
            );

            // Use correct product ID (for both create and edit modes)
            const productId = isEdit ? formData._id : data._id || data.id;

            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
              {
                method: "PUT",
                body: updateFormData,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            setVideoUploadStatus(
              language === "en"
                ? "✅ Video uploaded successfully!"
                : "✅ ვიდეო წარმატებით აიტვირთა!",
            );

            toast({
              title: language === "en" ? "Video Uploaded!" : "ვიდეო აიტვირთა!",
              description:
                language === "en"
                  ? "Your video has been uploaded to YouTube"
                  : "თქვენი ვიდეო აიტვირთა YouTube-ზე",
            });

            // Clear status after 3 seconds
            setTimeout(() => setVideoUploadStatus(null), 3000);
          } else {
            const errorText = await videoResponse.text();
            console.error("❌ ვიდეოს ატვირთვა ვერ მოხერხდა:");
            console.error("Status:", videoResponse.status);
            console.error("Error:", errorText);

            setVideoUploadStatus(
              language === "en"
                ? "❌ Video upload failed"
                : "❌ ვიდეოს ატვირთვა ვერ მოხერხდა",
            );

            toast({
              title:
                language === "en"
                  ? "Video Upload Failed"
                  : "ვიდეოს ატვირთვა ვერ მოხერხდა",
              description:
                language === "en"
                  ? "Product created but video upload failed"
                  : "პროდუქტი შეიქმნა, მაგრამ ვიდეოს ატვირთვა ვერ მოხერხდა",
              variant: "destructive",
            });

            setTimeout(() => setVideoUploadStatus(null), 5000);
          }
        } catch (videoError) {
          console.error("💥 ვიდეოს ატვირთვისას მოხდა შეცდომა:");
          console.error(videoError);

          setVideoUploadStatus(
            language === "en"
              ? "❌ Upload error occurred"
              : "❌ ატვირთვისას მოხდა შეცდომა",
          );

          toast({
            title:
              language === "en"
                ? "Video Upload Error"
                : "ვიდეოს ატვირთვის შეცდომა",
            description:
              videoError instanceof Error
                ? videoError.message
                : "დაფიქსირდა შეცდომა",
            variant: "destructive",
          });

          setTimeout(() => setVideoUploadStatus(null), 5000);
          // Don't fail the whole operation if video upload fails
        }
      }

      const successMessage = isEdit
        ? t("adminProducts.productUpdatedSuccess")
        : t("adminProducts.productAddedSuccess");
      setSuccess(successMessage);

      toast({
        title: isEdit
          ? t("adminProducts.productUpdatedToast")
          : t("adminProducts.productCreatedToast"),
        description: t("adminProducts.successTitle"),
      });

      if (!isEdit) {
        resetForm();
      }

      if (onSuccess) {
        // Set a flag to force refresh when we return to the products list
        sessionStorage.setItem("returnFromEdit", "true");
        onSuccess(data);
      } else {
        // Also set the flag for direct navigation
        sessionStorage.setItem("returnFromEdit", "true");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError(
        error instanceof Error
          ? error.message
          : t("adminProducts.generalError"),
      );
    } finally {
      setPending(false);
    }
  };

  // Also add a useEffect to fetch subcategory details when selectedSubcategory changes
  useEffect(() => {
    if (selectedSubcategory && subcategories) {
      const subcategory = subcategories.find(
        (sub) => String(sub.id) === String(selectedSubcategory),
      );

      if (subcategory) {
        // Set available options based on subcategory
        setAvailableAgeGroups(subcategory.ageGroups || []);
        setAvailableSizes(subcategory.sizes || []);
        setAvailableColors(subcategory.colors || []);

        // If we have initial data with attribute selections, make sure they're valid
        // for this subcategory before applying them
        if (initialData) {
          // Extract ageGroups from variants if product-level array is empty
          let ageGroupsToCheck = initialData.ageGroups || [];
          let sizesToCheck = initialData.sizes || [];
          let colorsToCheck = initialData.colors || [];

          if (initialData.variants && initialData.variants.length > 0) {
            if (ageGroupsToCheck.length === 0) {
              const ageGroupsFromVariants = initialData.variants
                .map((v) => v.ageGroup)
                .filter((ag): ag is string => !!ag);
              ageGroupsToCheck = [...new Set(ageGroupsFromVariants)];
            }
            if (sizesToCheck.length === 0) {
              const sizesFromVariants = initialData.variants
                .map((v) => v.size)
                .filter((s): s is string => !!s);
              sizesToCheck = [...new Set(sizesFromVariants)];
            }
            if (colorsToCheck.length === 0) {
              const colorsFromVariants = initialData.variants
                .map((v) => v.color)
                .filter((c): c is string => !!c);
              colorsToCheck = [...new Set(colorsFromVariants)];
            }
          }

          if (ageGroupsToCheck.length > 0) {
            const validAgeGroups = ageGroupsToCheck.filter((ag) =>
              subcategory.ageGroups.includes(ag),
            );
            setSelectedAgeGroups(validAgeGroups);
          }

          if (sizesToCheck.length > 0) {
            const validSizes = sizesToCheck.filter((size) =>
              subcategory.sizes.includes(size),
            );
            setSelectedSizes(validSizes);
          }

          if (colorsToCheck.length > 0) {
            const validColors = colorsToCheck.filter((color) =>
              subcategory.colors.includes(color),
            );
            setSelectedColors(validColors);
          }
        }
      }
    }
  }, [selectedSubcategory, subcategories, initialData]);

  // Add a cleanup effect when the form unmounts
  useEffect(() => {
    return () => {
      // Clean up any lingering edit flags
      const returnFromEdit = sessionStorage.getItem("returnFromEdit");
      if (returnFromEdit) {
        sessionStorage.removeItem("returnFromEdit");
      }
    };
  }, []);

  const {
    stocks,
    totalCount,
    setStockCount,
    setVariantPrice,
    setVariantAttribute,
    setAllVariantPrices,
    duplicateVariant,
    removeVariant,
  } = useStocks({
    initialData,
    attributes: [selectedAgeGroups, selectedSizes, selectedColors],
    basePrice: formData.price,
  });

  return (
    <div className="create-product-form">
      {success && (
        <div className="success-message">
          <p className="text-center">{success}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && (
          <div className="server-error">
            <p className="create-product-error text-center">{serverError}</p>
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="form-section">
          <div className="form-section-header">
            <Package size={20} />
            <h2>{language === "en" ? "Basic Information" : "ძირითადი ინფორმაცია"}</h2>
          </div>
          <div className="form-section-content">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">{t("adminProducts.productNameGe")}</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="create-product-input"
                  required
                />
                {errors.name && <p className="create-product-error">{errors.name}</p>}
              </div>
              <div className="form-field">
                <label htmlFor="nameEn">{t("adminProducts.productNameEn")}</label>
                <input
                  id="nameEn"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  className="create-product-input"
                  placeholder={t("adminProducts.productNameEnPlaceholder")}
                />
                {errors.nameEn && <p className="create-product-error">{errors.nameEn}</p>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="description">{t("adminProducts.descriptionGe")}</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="create-product-textarea"
                required
              />
              {errors.description && <p className="create-product-error">{errors.description}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="descriptionEn">{t("adminProducts.descriptionEn")}</label>
              <textarea
                id="descriptionEn"
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleChange}
                className="create-product-textarea"
                placeholder={t("adminProducts.descriptionEnPlaceholder")}
              />
              {errors.descriptionEn && <p className="create-product-error">{errors.descriptionEn}</p>}
            </div>

            <div className="form-row form-row-3">
              <div className="form-field">
                <label htmlFor="price">{t("adminProducts.price")} (₾)</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className="create-product-input"
                  required
                />
                {errors.price && <p className="create-product-error">{errors.price}</p>}
              </div>
              <div className="form-field">
                <label htmlFor="brand">{t("adminProducts.brand")}</label>
                <input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder={t("adminProducts.enterBrandName")}
                  className="create-product-input"
                />
                {errors.brand && <p className="create-product-error">{errors.brand}</p>}
              </div>
              <div className="form-field">
                <label htmlFor="countInStock">{t("adminProducts.stock")}</label>
                <input
                  id="countInStock"
                  name="countInStock"
                  type="number"
                  disabled
                  value={totalCount}
                  className="create-product-input stock-input-disabled"
                />
                <small className="field-hint">
                  {language === "en"
                    ? "Auto-calculated from variants"
                    : "ვარიანტებიდან ავტომატურად"}
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Category & Subcategory */}
        <div className="form-section">
          <div className="form-section-header">
            <Tag size={20} />
            <h2>{language === "en" ? "Category" : "კატეგორია"}</h2>
          </div>
          <div className="form-section-content">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="category">{t("adminProducts.category")}</label>
                <select
                  id="category"
                  name="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="create-product-select"
                  required
                  disabled={isCategoriesLoading}
                >
                  <option value="">
                    {isCategoriesLoading
                      ? t("adminProducts.loading")
                      : t("adminProducts.selectCategory")}
                  </option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {language === "en" && category.nameEn
                        ? category.nameEn
                        : category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="subcategory">{t("adminProducts.subcategory")}</label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                  className="create-product-select"
                  required
                  disabled={!selectedCategory || isSubcategoriesLoading}
                >
                  <option value="">{t("adminProducts.selectSubcategory")}</option>
                  {subcategories?.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {language === "en" && subcategory.nameEn
                        ? subcategory.nameEn
                        : subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Product Attributes - Only show when subcategory selected */}
        {selectedSubcategory && (
          <div className="form-section form-section-collapsible">
            <button
              type="button"
              className="form-section-header form-section-toggle"
              onClick={() => setIsAttributesExpanded(!isAttributesExpanded)}
            >
              <div className="header-left">
                <Layers size={20} />
                <h2>
                  {language === "en"
                    ? `Attributes (${selectedAgeGroups.length + selectedSizes.length + selectedColors.length})`
                    : `ატრიბუტები (${selectedAgeGroups.length + selectedSizes.length + selectedColors.length})`}
                </h2>
              </div>
              {isAttributesExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {isAttributesExpanded && (
              <div className="form-section-content">
                {availableAgeGroups.length > 0 && (
                  <div className="attribute-group">
                    <div className="attribute-group-header">
                      <Users size={16} />
                      <h3>{t("adminProducts.ageGroups")}</h3>
                    </div>
                    <div className="attribute-options">
                      {availableAgeGroups.map((ageGroup) => (
                        <label key={ageGroup} className="attribute-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedAgeGroups.includes(ageGroup)}
                            onChange={() => handleAttributeChange("ageGroups", ageGroup)}
                          />
                          <span>{getLocalizedAgeGroupName(ageGroup)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {availableSizes.length > 0 && (
                  <div className="attribute-group">
                    <div className="attribute-group-header">
                      <Ruler size={16} />
                      <h3>{t("adminProducts.sizes")}</h3>
                    </div>
                    <div className="attribute-options">
                      {availableSizes.map((size) => (
                        <label key={size} className="attribute-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedSizes.includes(size)}
                            onChange={() => handleAttributeChange("sizes", size)}
                          />
                          <span>{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {availableColors.length > 0 && (
                  <div className="attribute-group">
                    <div className="attribute-group-header">
                      <Palette size={16} />
                      <h3>{t("adminProducts.colors")}</h3>
                    </div>
                    <div className="attribute-options">
                      {availableColors.map((color) => (
                        <label key={color} className="attribute-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedColors.includes(color)}
                            onChange={() => handleAttributeChange("colors", color)}
                          />
                          <span>{getLocalizedColorName(color)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Images Section */}
                {selectedColors.length > 0 && (
                  <div className="color-images-section">
                    <h3>{language === "en" ? "Color Images (Optional)" : "ფერების სურათები (არასავალდებულო)"}</h3>
                    <div className="color-images-grid">
                      {selectedColors.map((color) => (
                        <div key={color} className="color-image-item">
                          <div className="color-image-label">{getLocalizedColorName(color)}</div>
                          <div className="color-image-upload">
                            {colorImages[color] ? (
                              <div className="color-image-preview">
                                <Image
                                  src={
                                    colorImages[color] instanceof File
                                      ? URL.createObjectURL(colorImages[color] as File)
                                      : (colorImages[color] as string)
                                  }
                                  alt={color}
                                  width={80}
                                  height={80}
                                  className="color-preview-img"
                                />
                                <button
                                  type="button"
                                  className="color-image-remove"
                                  onClick={() => handleRemoveColorImage(color)}
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <label className="color-image-upload-btn">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleColorImageChange(color, e)}
                                  style={{ display: "none" }}
                                />
                                <span>{language === "en" ? "Upload" : "ატვირთვა"}</span>
                              </label>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Section 4: Variants Stock & Pricing */}
        {stocks && stocks.length > 0 && (
          <div className="form-section form-section-collapsible">
            <button
              type="button"
              className="form-section-header form-section-toggle"
              onClick={() => setIsVariantsExpanded(!isVariantsExpanded)}
            >
              <div className="header-left">
                <Package size={20} />
                <h2>
                  {language === "en"
                    ? `Stock & Pricing (${stocks.length})`
                    : `მარაგი და ფასები (${stocks.length})`}
                </h2>
              </div>
              {isVariantsExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {isVariantsExpanded && (
              <div className="form-section-content">
                <p className="section-hint">
                  {language === "en"
                    ? "Set stock, price, and optional attribute for each variant. Leave price empty to use base price."
                    : "თითოეული ვარიანტისთვის მიუთითეთ მარაგი და ფასი. ფასი დატოვეთ ცარიელი საბაზისო ფასისთვის."}
                </p>
                <div className="variants-grid">
                  {stocks.map((stock) => (
                    <div key={stock.variantId} className="stock-variant-card">
                      <div className="variant-card-header">
                        {[
                          stock.ageGroup ? getLocalizedAgeGroupName(stock.ageGroup) : null,
                          stock.size || null,
                          stock.color ? getLocalizedColorName(stock.color) : null,
                          stock.attribute || null,
                        ]
                          .filter(Boolean)
                          .join(" / ") ||
                          (language === "en" ? "Default" : "ძირითადი")}
                      </div>
                      <div className="variant-card-body">
                        <div className="variant-input-group">
                          <label>{language === "en" ? "Stock" : "მარაგი"}</label>
                          <input
                            type="number"
                            value={stock.stock}
                            onChange={(e) => setStockCount(stock, +e.target.value)}
                            min={0}
                            placeholder="0"
                          />
                        </div>
                        <div className="variant-input-group">
                          <label>{language === "en" ? "Price" : "ფასი"} ₾</label>
                          <input
                            type="number"
                            value={stock.price ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setVariantPrice(stock, value === "" ? undefined : +value);
                            }}
                            min={0}
                            step="0.01"
                            placeholder={language === "en" ? "Base" : "საბაზ."}
                          />
                        </div>
                        <div className="variant-input-group variant-attribute-input">
                          <label>{language === "en" ? "Attr" : "ატრ."}</label>
                          <input
                            type="text"
                            value={stock.attribute || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setVariantAttribute(stock, value === "" ? undefined : value);
                            }}
                            placeholder={language === "en" ? "e.g., with frame" : "ჩარჩოთი"}
                          />
                        </div>
                      </div>
                      <div className="variant-card-actions">
                        <button
                          type="button"
                          className="variant-action-btn duplicate-btn"
                          onClick={() => duplicateVariant(stock)}
                          title={language === "en" ? "Duplicate" : "კოპირება"}
                        >
                          +
                        </button>
                        {stock.attribute && (
                          <button
                            type="button"
                            className="variant-action-btn remove-btn"
                            onClick={() => removeVariant(stock)}
                            title={language === "en" ? "Remove" : "წაშლა"}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 5: Images */}
        <div className="form-section">
          <div className="form-section-header">
            <ImageIcon size={20} />
            <h2>{language === "en" ? "Product Images" : "პროდუქტის სურათები"}</h2>
          </div>
          <div className="form-section-content">
            <div className="form-field">
              <label>{t("adminProducts.images")}</label>
              <div className="image-upload-area">
                <label htmlFor="images" className="file-upload-btn">
                  <ImageIcon size={24} />
                  <span>
                    {language === "en" 
                      ? "Click to upload product images" 
                      : "დააჭირეთ სურათების ასატვირთად"}
                  </span>
                  <small style={{ color: '#9ca3af', fontSize: '12px' }}>
                    {language === "en" ? "JPG, PNG, WEBP" : "JPG, PNG, WEBP"}
                  </small>
                </label>
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="create-product-file"
                  multiple
                />
              </div>
              {formData.images.length === 0 && (
                <p className="upload-reminder">{t("adminProducts.uploadReminder")}</p>
              )}
              <div className="image-preview-container">
                {formData.images.map((image, index) => {
                  const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;
                  return (
                    <div key={index} className="image-preview">
                      <Image
                        loader={({ src }) => src}
                        src={imageUrl}
                        alt="Product preview"
                        width={100}
                        height={100}
                        unoptimized
                        className="preview-image"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="remove-image-button"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
              {errors.images && <p className="create-product-error">{errors.images}</p>}
            </div>

            <div className="form-field">
              <label>{t("adminProducts.brandLogo")}</label>
              <div className="brand-logo-container">
                {(typeof formData.brandLogo === "string" || user?.storeLogo) && (
                  <div className="image-preview">
                    <Image
                      loader={({ src }) => src}
                      alt="Brand logo"
                      src={
                        typeof formData.brandLogo === "string"
                          ? formData.brandLogo
                          : user?.storeLogo || ""
                      }
                      width={100}
                      height={100}
                      unoptimized
                      className="preview-image"
                    />
                  </div>
                )}
                <label htmlFor="brandLogo" className="file-upload-btn logo-upload-btn">
                  <ImageIcon size={20} />
                  <span>{language === "en" ? "Upload Logo" : "ლოგოს ატვირთვა"}</span>
                </label>
                <input
                  id="brandLogo"
                  name="brandLogo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFormData((prev) => ({
                        ...prev,
                        brandLogo: e.target.files?.[0],
                      }));
                    }
                  }}
                  className="create-product-file"
                />
              </div>
              {errors.brandLogo && <p className="create-product-error">{errors.brandLogo}</p>}
            </div>
          </div>
        </div>

        {/* Section 6: Video (Collapsible) */}
        <div className="form-section form-section-collapsible form-section-optional">
          <div className="form-section-header">
            <Video size={20} />
            <h2>{language === "en" ? "Video (Optional)" : "ვიდეო (არასავალდებულო)"}</h2>
          </div>
          <div className="form-section-content">
            <div className="form-field">
              <label>
                {language === "en"
                  ? "Upload Video (YouTube)"
                  : "ვიდეოს ატვირთვა (YouTube)"}
              </label>
              <div className="video-upload-area">
                <label htmlFor="videoFile" className="file-upload-btn video-upload-btn">
                  <Video size={24} />
                  <span>
                    {language === "en" 
                      ? "Click to upload video" 
                      : "დააჭირეთ ვიდეოს ასატვირთად"}
                  </span>
                  <small style={{ color: '#9ca3af', fontSize: '12px' }}>
                    {language === "en" 
                      ? "MP4, AVI, MOV, WMV • Max: 500MB" 
                      : "MP4, AVI, MOV, WMV • მაქს: 500MB"}
                  </small>
                </label>
                <input
                  type="file"
                  id="videoFile"
                  name="videoFile"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const maxSize = 500 * 1024 * 1024;
                      if (file.size > maxSize) {
                        alert(
                          language === "en"
                            ? "Video file is too large. Maximum size is 500MB."
                            : "ვიდეო ფაილი ძალიან დიდია. მაქსიმალური ზომა არის 500MB."
                        );
                        e.target.value = "";
                        return;
                      }
                      setFormData((prev) => ({ ...prev, videoFile: file }));
                    }
                  }}
                  className="create-product-file"
                />
              </div>

              {formData.videoFile && !videoUploadStatus && (
                <div className="file-selected-badge">
                  <Video size={16} />
                  <span>✓ {formData.videoFile.name} ({(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              )}

              {videoUploadStatus && (
                <div className={`upload-status ${videoUploadStatus.includes("✅") ? "success" : videoUploadStatus.includes("❌") ? "error" : "loading"}`}>
                  {videoUploadStatus}
                </div>
              )}
            </div>

            {isEdit && formData.videoDescription && !formData.videoFile && (
              <div className="info-box">
                <Info size={16} />
                <span>
                  {language === "en"
                    ? "This product has a video. Upload new to replace."
                    : "პროდუქტს აქვს ვიდეო. ატვირთეთ ახალი შესაცვლელად."}
                </span>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="videoDescription">
                {language === "en" ? "Or YouTube Embed Code" : "ან YouTube Embed კოდი"}
              </label>
              <textarea
                id="videoDescription"
                name="videoDescription"
                value={formData.videoDescription || ""}
                onChange={handleChange}
                className="create-product-textarea"
                placeholder={language === "en" ? "Paste YouTube embed code" : "ჩასვით YouTube embed კოდი"}
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Section 7: Discount (Collapsible) */}
        <div className="form-section form-section-collapsible form-section-optional">
          <div className="form-section-header">
            <Percent size={20} />
            <h2>{language === "en" ? "Discount (Optional)" : "ფასდაკლება (არასავალდებულო)"}</h2>
          </div>
          <div className="form-section-content">
            <div className="form-field">
              <label htmlFor="discountPercentage">
                {language === "en" ? "Discount %" : "ფასდაკლება %"}
              </label>
              <input
                id="discountPercentage"
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="create-product-input"
                placeholder="0-100"
                min={0}
                max={100}
                step={0.01}
              />
            </div>

            {discountPercentage && parseFloat(discountPercentage) > 0 && (
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="discountStartDate">
                    {language === "en" ? "Start Date" : "დაწყება"}
                  </label>
                  <input
                    id="discountStartDate"
                    type="date"
                    value={discountStartDate}
                    onChange={(e) => setDiscountStartDate(e.target.value)}
                    className="create-product-input"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="discountEndDate">
                    {language === "en" ? "End Date" : "დასრულება"}
                  </label>
                  <input
                    id="discountEndDate"
                    type="date"
                    value={discountEndDate}
                    onChange={(e) => setDiscountEndDate(e.target.value)}
                    className="create-product-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 8: Delivery */}
        <div className="form-section">
          <div className="form-section-header">
            <Truck size={20} />
            <h2>{language === "en" ? "Delivery" : "მიწოდება"}</h2>
          </div>
          <div className="form-section-content">
            <div className="delivery-type-options">
              <label className={`delivery-option ${deliveryType === "FishHunt" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="deliveryType"
                  value="FishHunt"
                  checked={deliveryType === "FishHunt"}
                  onChange={() => setDeliveryType("FishHunt")}
                />
                <span>FishHunt {language === "en" ? "Delivery" : "მიწოდება"}</span>
              </label>
              <label className={`delivery-option ${deliveryType === "SELLER" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="deliveryType"
                  value="SELLER"
                  checked={deliveryType === "SELLER"}
                  onChange={() => setDeliveryType("SELLER")}
                />
                <span>{language === "en" ? "Seller Delivery" : "გამყიდველის მიწოდება"}</span>
              </label>
            </div>

            {deliveryType === "SELLER" && (
              <div className="form-row delivery-days-row">
                <div className="form-field">
                  <label htmlFor="minDeliveryDays">
                    {language === "en" ? "Min Days" : "მინ. დღეები"}
                  </label>
                  <input
                    id="minDeliveryDays"
                    type="number"
                    value={minDeliveryDays}
                    onChange={(e) => setMinDeliveryDays(e.target.value)}
                    min={1}
                    className="create-product-input"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="maxDeliveryDays">
                    {language === "en" ? "Max Days" : "მაქს. დღეები"}
                  </label>
                  <input
                    id="maxDeliveryDays"
                    type="number"
                    value={maxDeliveryDays}
                    onChange={(e) => setMaxDeliveryDays(e.target.value)}
                    min={1}
                    className="create-product-input"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 9: SEO Hashtags */}
        <div className="form-section form-section-optional">
          <div className="form-section-header">
            <Hash size={20} />
            <h2>{language === "en" ? "SEO Hashtags" : "SEO ჰეშთეგები"}</h2>
          </div>
          <div className="form-section-content">
            <div className="form-field">
              <textarea
                id="hashtags"
                name="hashtags"
                value={hashtagsInput}
                onChange={handleHashtagsChange}
                className="create-product-textarea"
                placeholder={
                  language === "en"
                    ? "handmade, art, unique (comma separated)"
                    : "ხელნაკეთი, ხელოვნება, უნიკალური (მძიმით გამოყოფილი)"
                }
                rows={2}
              />
              {formData.hashtags && formData.hashtags.length > 0 && (
                <div className="hashtags-preview">
                  {formData.hashtags.map((tag, index) => (
                    <span key={index} className="hashtag-badge">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="validation-box validation-error">
            <h4>{t("adminProducts.fixErrorsBeforeSubmit")}:</h4>
            <ul>
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {(!selectedCategory || !selectedSubcategory || formData.images.length === 0) && (
          <div className="validation-box validation-warning">
            <h4>{t("adminProducts.requiredFields")}:</h4>
            <ul>
              {!selectedCategory && <li>• {t("adminProducts.selectCategoryError")}</li>}
              {!selectedSubcategory && <li>• {t("adminProducts.selectSubcategoryError")}</li>}
              {formData.images.length === 0 && <li>• {t("adminProducts.noImageSelected")}</li>}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="create-product-button"
          disabled={
            pending ||
            !formData.name ||
            !selectedCategory ||
            !selectedSubcategory ||
            formData.images.length === 0 ||
            Object.values(errors).some((error) => error !== undefined && error !== null && error !== "")
          }
        >
          {pending && <Loader2 className="loader animate-spin" />}
          {isEdit ? t("adminProducts.updateProduct") : t("adminProducts.createProduct")}
        </button>
      </form>
    </div>
  );
}
