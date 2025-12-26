"use client";

import { useForm, Controller } from "react-hook-form";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCheckout } from "../context/checkout-context";
import { getCountries } from "@/lib/countries";

import "./shipping-form.css";

interface ShippingFormData {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export function ShippingForm() {
  const { setShippingAddress } = useCheckout();
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<ShippingFormData>();

  const onSubmit = async (data: ShippingFormData) => {
    try {
      const response = await apiClient.post("/cart/shipping", data);
      const shippingAddress = response.data;
      setShippingAddress(shippingAddress);
      router.push("/checkout/payment");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error saving shipping details",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="shipping-form-card">
      <div className="shipping-form-header">
        <h1>Shipping Address</h1>
        <p>Enter your shipping details</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="shipping-form">
        <div className="shipping-form-field">
          <label htmlFor="address">Street Address</label>
          <input
            id="address"
            {...register("address", { required: "Address is required" })}
            placeholder="123 Main St"
          />
          {errors.address && (
            <p className="error-text">{errors.address.message}</p>
          )}
        </div>

        <div className="shipping-form-field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            {...register("city", { required: "City is required" })}
            placeholder="New York"
          />
          {errors.city && <p className="error-text">{errors.city.message}</p>}
        </div>

        <div className="shipping-form-field">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            id="postalCode"
            {...register("postalCode", { required: "Postal code is required" })}
            placeholder="10001"
          />
          {errors.postalCode && (
            <p className="error-text">{errors.postalCode.message}</p>
          )}
        </div>

        <div className="shipping-form-field">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            {...register("phone", { 
              required: "Phone number is required",
              pattern: {
                value: /^[+]?[0-9\s\-()]{9,20}$/,
                message: "Please enter a valid phone number"
              }
            })}
            placeholder="+995 555 123 456"
          />
          {errors.phone && (
            <p className="error-text">{errors.phone.message}</p>
          )}
        </div>

        <div className="shipping-form-field">
          <label htmlFor="country">Country</label>
          <Controller
            name="country"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <select {...field} defaultValue="">
                <option value="" disabled>
                  Select a country
                </option>
                {getCountries().map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.country && (
            <p className="error-text">{errors.country.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="shipping-form-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4 inline mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              გთხოვთ დაელოდოთ...
            </>
          ) : (
            "Continue to Payment"
          )}
        </button>
      </form>
    </div>
  );
}
