"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCheckout } from "../context/checkout-context";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
// import { FaPaypal } from "react-icons/fa";
// import { CreditCard } from "lucide-react";
import "./payment-form.css";

const formSchema = z.object({
  paymentMethod: z.enum(["PayPal", "Stripe", "BOG"], {
    required_error: "Please select a payment method.",
  }),
});

export function PaymentForm() {
  const { setPaymentMethod } = useCheckout();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "BOG",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isLoading) return; // Prevent double submission

    setIsLoading(true);
    try {
      const response = await apiClient.post("/cart/payment", {
        paymentMethod: values.paymentMethod,
      });
      const paymentMethod = response.data;
      console.log(paymentMethod);
      setPaymentMethod(paymentMethod);
      router.push("/checkout/review");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error saving payment method",
        description: "Please try again.",
        variant: "destructive",
      });
      setIsLoading(false); // Re-enable on error
    }
  }

  return (
    <div className="card p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Payment Method</h1>
          <p className="text-sm text-muted-foreground">
            Choose how you would like to pay
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-item">
            <label className="form-label">Payment Method</label>
            <div className="form-control">
              <div className="grid grid-cols-1 gap-4">
                {/* PayPal Option - Temporarily Commented */}
                {/* <div className="form-item">
                  <div className="form-control">
                    <label
                      htmlFor="PayPal"
                      className="border rounded-lg p-4 cursor-pointer hover:border-primary [&:has(:checked)]:border-primary block"
                    >
                      <input
                        type="radio"
                        value="PayPal"
                        id="PayPal"
                        className="sr-only"
                        {...form.register("paymentMethod")}
                      />
                      <div className="flex flex-col items-center space-y-2">
                        <FaPaypal className="h-6 w-6" />
                        <span className="text-sm font-medium">PayPal</span>
                      </div>
                    </label>
                  </div>
                </div> */}

                {/* Stripe Option - Temporarily Commented */}
                {/* <div className="form-item">
                  <div className="form-control">
                    <label
                      htmlFor="Stripe"
                      className="border rounded-lg p-4 cursor-pointer hover:border-primary [&:has(:checked)]:border-primary block"
                    >
                      <input
                        type="radio"
                        value="Stripe"
                        id="Stripe"
                        className="sr-only"
                        {...form.register("paymentMethod")}
                      />
                      <div className="flex flex-col items-center space-y-2">
                        <CreditCard className="h-6 w-6" />
                        <span className="text-sm font-medium">Card</span>
                      </div>
                    </label>
                  </div>
                </div> */}
                <div className="form-item">
                  <div className="form-control">
                    <label
                      htmlFor="BOG"
                      className="border rounded-lg p-4 cursor-pointer hover:border-primary [&:has(:checked)]:border-primary [&:has(:checked)]:bg-gradient-to-r [&:has(:checked)]:from-red-600 [&:has(:checked)]:to-pink-600 [&:has(:checked)]:text-white block transition-all duration-300"
                      style={{
                        fontFamily: '"ALK Life", "Georgia", serif',
                      }}
                    >
                      <input
                        type="radio"
                        value="BOG"
                        id="BOG"
                        className="sr-only"
                        {...form.register("paymentMethod")}
                      />
                      <div className="flex flex-col items-center space-y-2">
                        <svg
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="green"
                          width={20}
                          height={20}
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span className="text-sm font-medium">
                          ბარათით გადახდა
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-1 w-1 inline mr-2"
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
                    strokeWidth="4"
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
              "Continue to Review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
