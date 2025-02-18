"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation";
import { useLogin } from "../hooks/use-auth";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import "./login-form.css";

import type * as z from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [errors, setErrors] = useState({ email: "", password: "" });
  // const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    login(data);
  };
  const handleGoogleAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="********"
            {...register("password")}
          />
          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="login-button">
          {isPending ? <span className="loading-spinner"></span> : "Sign in"}
        </button>

        <div className="separator">
          <span className="separator-text">Or continue with</span>
        </div>

        <div className="social-buttons">
          <button className="social-button">
            <FaFacebook className="icon" />
            Facebook
          </button>
          <button onClick={handleGoogleAuth} className="social-button">
            <FaGoogle className="icon" />
            Google
          </button>
        </div>
      </form>

      <div className="signup-text">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="signup-link">
          Sign up
        </Link>
      </div>
    </div>
  );
}
