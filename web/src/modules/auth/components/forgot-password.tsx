"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
// import { motion } from "framer-motion";
// import "./ForgotPassword.css";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export function ForgotPasswordForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const forgotPassword = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await apiClient.post("/auth/forgot-password", values);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Check your inbox for a password reset link.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="card">
      <h2>Forgot Password</h2>
      <form
        onSubmit={form.handleSubmit((values) => forgotPassword.mutate(values))}
        className="space-y-6"
      >
        <div className="form-field">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...form.register("email")}
            className="input"
          />
          {form.formState.errors.email && (
            <span className="error-message">
              {form.formState.errors.email.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="button"
          disabled={forgotPassword.isPending}
        >
          {forgotPassword.isPending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
