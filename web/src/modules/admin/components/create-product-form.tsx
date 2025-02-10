"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useActionState, useEffect, useState } from "react";
import { createProduct } from "@/modules/products/actions/create-product";
import { productSchema } from "@/modules/products/validation/product";
import { ZodError } from "zod";
import { ProductFormData } from "@/modules/products/validation/product";
import "./CreateProductForm.css";

const categories = [
  "Electronics",
  "Computers",
  "Smart Home",
  "Phones",
  "Cameras",
  "Gaming",
];

export function CreateProductForm() {
  const router = useRouter();
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

  const createProductBound = createProduct.bind(null, formData);
  const [productState, productAction, pending] = useActionState(
    createProductBound,
    {}
  );

  useEffect(() => {
    if (productState.data) {
      toast({
        title: productState.data.title,
        description: productState.data.description,
      });
      router.push("/admin/products");
    } else if (productState.error) {
      toast({
        variant: "destructive",
        title: productState.error.title,
        description: productState.error.description,
      });
    }
  }, [productState, router]);

  const validateField = (field: keyof ProductFormData, value: unknown) => {
    try {
      productSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      }
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "countInStock" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
    validateField("category", e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(e.target.files || []),
      }));
    }
  };

  const handleBrandLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({
        ...prev,
        brandLogo: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const dataToValidate = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      brand: formData.get("brand") as string,
      category: formData.get("category") as string,
      countInStock: Number(formData.get("countInStock")),
      images: Array.from(formData.getAll("images")) as File[],
      brandLogo: formData.get("brandLogo") as File,
    };

    const result = productSchema.safeParse(dataToValidate);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Validation Error in `" + result.error.issues[0].path[0] + "`",
        description: result.error.issues[0].message,
      });
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(dataToValidate).forEach(([key, value]) => {
      if (key !== "images") {
        formDataToSend.append(key, String(value));
      }
    });

    const files = formData.getAll("images");
    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one image",
      });
      return;
    }

    files.forEach((file) => {
      formDataToSend.append("images", file);
    });

    if (dataToValidate.brandLogo) {
      formDataToSend.append("brandLogo", dataToValidate.brandLogo);
    }

    return productAction(formDataToSend);
  };

  return (
    <div className="create-product-form">
      <form action={handleSubmit} className="space-y-4">
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
