"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, type LoginFormValues } from "@/types/loginSchema";
import "@/assets/css/login-page.css"; // shared auth-* classes/theme — same file as RegisterPage
import { useRouter } from "next/navigation";

export  function LoginPage() {
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // required so the backend's HTTP-only JWT cookie is stored
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);

        if (res.status === 401) {
          setServerError(data?.message || "Incorrect email or password");
          return;
        }

        setServerError(data?.message || "Login failed. Please try again.");
        return;
      }

      // Backend has set the HTTP-only JWT cookie. Middleware on the
        // dashboard route validates it, so a simple redirect is enough
        router.push('/')
        
    } catch {
      setServerError("Could not reach the server. Check your connection and try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Sign in</h1>
        <p className="auth-subtitle">Welcome back — enter your details below.</p>

        {serverError && (
          <div className="auth-alert" role="alert">
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`auth-input ${errors.email ? "auth-input--error" : ""}`}
              placeholder="jane@example.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && <span className="auth-error">{errors.email.message}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`auth-input ${errors.password ? "auth-input--error" : ""}`}
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <span className="auth-error">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link href="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}