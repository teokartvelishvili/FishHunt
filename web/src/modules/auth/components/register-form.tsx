"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation";
import { useRegister } from "../hooks/use-auth";
// import { useState } from "react";
import Link from "next/link";
import "./register-form.css";
import type * as z from "zod";

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { mutate: register, isPending } = useRegister();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit((data) => {
    register(data);
  });
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  // });

  // const [isPending, setIsPending] = useState(false);
  // const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const validateForm = () => {
  //   const newErrors: { [key: string]: string } = {};
  //   if (!formData.name.trim()) newErrors.name = "Name is required";
  //   if (!formData.email.includes("@"))
  //     newErrors.email = "Invalid email address";
  //   if (formData.password.length < 6)
  //     newErrors.password = "Password must be at least 6 characters";
  //   return newErrors;
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const validationErrors = validateForm();
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }
  //   setErrors({});
  //   setIsPending(true);
  //   setTimeout(() => setIsPending(false), 2000);
  // };

  return (
    <div className="form-container">
      <form onSubmit={onSubmit} className="form">
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="სახელი"
            {...registerField("name")}
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...registerField("email")}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="********"
            {...registerField("password")}
          />
          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </button>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn" disabled={isPending}>
            <FaGithub className="icon" />
            GitHub
          </button>
          <button className="social-btn" disabled={isPending}>
            <FaGoogle className="icon" />
            Google
          </button>
        </div>

        <div className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="login-link">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
