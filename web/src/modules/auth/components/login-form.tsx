"use client";

import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import "./login-form.css";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const newErrors = { email: "", password: "" };

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      setTimeout(() => {
        setIsPending(false);
        alert("Login successful!");
      }, 2000);
    } else {
      setIsPending(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" className="login-button">
          {isPending ? <span className="loading-spinner"></span> : "Sign in"}
        </button>

        <div className="separator">
          <span className="separator-text">Or continue with</span>
        </div>

        <div className="social-buttons">
          <button className="social-button">
            <FaGithub className="icon" />
            Github
          </button>
          <button className="social-button">
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
