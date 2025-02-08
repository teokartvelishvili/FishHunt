"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/modules/auth/hooks/use-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// სტილის ფაილის იმპორტი
import "./ProfileForm.css";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

export function ProfileForm() {
  const { toast } = useToast();
  const { user, isLoading } = useUser();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  const updateProfile = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      apiClient.put("/auth/profile", {
        name: values.name,
        email: values.email,
        ...(values.password ? { password: values.password } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      form.reset({ password: "", confirmPassword: "" });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card">
      <h2>User Profile</h2>
      <form
        onSubmit={form.handleSubmit((values) => updateProfile.mutate(values))}
        className="space-y-6"
      >
        <div className="form-field">
          <label htmlFor="name" className="label">
            Name
          </label>
          <input id="name" {...form.register("name")} className="input" />
          {form.formState.errors.name && (
            <span className="error-message">
              {form.formState.errors.name?.message}
            </span>
          )}
        </div>

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
              {form.formState.errors.email?.message}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="password" className="label">
            New Password
          </label>
          <input
            id="password"
            type="password"
            {...form.register("password")}
            placeholder="Leave blank to keep current"
            className="input"
          />
          {form.formState.errors.password && (
            <span className="error-message">
              {form.formState.errors.password?.message}
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
            placeholder="Leave blank to keep current"
            className="input"
          />
          {form.formState.errors.confirmPassword && (
            <span className="error-message">
              {form.formState.errors.confirmPassword?.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="button"
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
