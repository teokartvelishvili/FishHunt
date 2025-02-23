"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useSearchParams } from "next/navigation";
import "./ResetPassword.css";

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const resetPassword = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!token) throw new Error("Invalid token");
      const response = await apiClient.post("/auth/reset-password", {
        token,
        password: values.password,
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your password has been reset.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="card">
      <h2>Reset Password</h2>
      <form
        onSubmit={form.handleSubmit((values) => resetPassword.mutate(values))}
        className="space-y-6"
      >
        <div className="form-field">
          <label htmlFor="password" className="label">
            New Password
          </label>
          <input
            id="password"
            type="password"
            {...form.register("password")}
            className="input"
          />
          {form.formState.errors.password && (
            <span className="error-message">
              {form.formState.errors.password.message}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="confirmPassword" className="label">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...form.register("confirmPassword")}
            className="input"
          />
          {form.formState.errors.confirmPassword && (
            <span className="error-message">
              {form.formState.errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="button"
          disabled={resetPassword.isPending}
        >
          {resetPassword.isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
