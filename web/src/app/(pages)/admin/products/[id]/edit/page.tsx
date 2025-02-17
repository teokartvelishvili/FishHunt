"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFormData } from "@/modules/products/validation/product";
import { Loader2 } from "lucide-react";

const categories = ["Fishing", "Hunting", "Camping", "Other"];
export default function EditProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    description: "",
    images: [],
    brand: "",
    category: "",
    countInStock: 0,
    brandLogo: undefined,
  });

  const [pending, setPending] = useState(false); // For handling form submission state

  // ✅ Fetch product data
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
          {
            method: "GET",
            headers: {
              Cookie: `access_token=${
                document.cookie
                  .split("; ")
                  .find((row) => row.startsWith("access_token="))
                  ?.split("=")[1] || ""
              }`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch product");

        const data = await response.json();
        console.log("Fetched product:", data);

        setFormData((prev) => ({
          ...prev,
          name: data.name || "",
          price: data.price || 0,
          description: data.description || "",
          images: data.images || [],
          brand: data.brand || "",
          category: data.category || "",
          countInStock: data.countInStock || 0,
          brandLogo: data.brandLogo || undefined,
        }));
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  // ✅ Handle form submission (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setPending(true); // Start loading state

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: `access_token=${
              document.cookie
                .split("; ")
                .find((row) => row.startsWith("access_token="))
                ?.split("=")[1] || ""
            }`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update product");

      alert("Product updated successfully!");
      router.push("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    } finally {
      setPending(false); // End loading state
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      const fileNames = Array.from(files).map((file) => file.name); // ფაილის სახელების ჩამონათვალი
      setFormData((prev) => ({
        ...prev,
        [name]: fileNames, // დააბრუნეთ მხოლოდ ფაილის სახელები
      }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBrandLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      const fileNames = Array.from(files).map((file) => file.name); // Only file name
      setFormData((prev) => ({
        ...prev,
        [name]: fileNames[0], // If only one file, take the first file name
      }));
    }
  };

  return (
    <div className="create-product-form">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name">Product Name</label>
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

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="create-product-textarea"
            required
          />
          {errors.description && (
            <p className="create-product-error">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="create-product-input"
            required
          />
          {errors.price && (
            <p className="create-product-error">{errors.price}</p>
          )}
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className="create-product-select"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="create-product-error">{errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="images">Product Images</label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="create-product-file"
            multiple
            required
          />
          {errors.images && (
            <p className="create-product-error">{errors.images}</p>
          )}
        </div>

        <div>
          <label htmlFor="brand">Brand</label>
          <input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Enter brand name"
            required
          />
          {errors.brand && <p className="text-red-500">{errors.brand}</p>}
        </div>

        <div>
          <label htmlFor="countInStock">Stock Count</label>
          <input
            id="countInStock"
            name="countInStock"
            type="number"
            value={formData.countInStock}
            onChange={handleChange}
            min={0}
            required
          />
          {errors.countInStock && (
            <p className="text-red-500">{errors.countInStock}</p>
          )}
        </div>

        <div>
          <label htmlFor="brandLogo">Brand Logo</label>
          <input
            id="brandLogo"
            name="brandLogo"
            type="file"
            accept="image/*"
            onChange={handleBrandLogoChange}
            className="create-product-file"
            required
          />
          {errors.brandLogo && (
            <p className="create-product-error">{errors.brandLogo}</p>
          )}
        </div>

        <button
          type="submit"
          className="create-product-button"
          disabled={pending}
        >
          {pending && <Loader2 className="loader" />}
          Create Product
        </button>
      </form>
    </div>
  );
}
