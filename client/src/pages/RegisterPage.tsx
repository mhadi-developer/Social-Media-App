"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormValues,
} from "../types/registerSchema";
import "../assets/css/register-page.css";
import { axiosInstance } from "@/utils/axiosInstance";
import Link from "next/link";

// Adjust to wherever your API actually lives.
export function RegisterPage() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dob: "",
            password: "",
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setServerError(null);
        try {
            const res = await axiosInstance.post('/auth/register', data)

            if (res.status === 201 || res.status === 200) {

                alert('new user generated')
                setSubmitted(true);
            }
            // Surface a duplicate-email error on the email field specifically.
            // if (res.status === 409) {
            //   setError("email", {
            //     type: "server",
            //     message: data?.message || "An account with this email already exists",
            //   });
            //   return;
            // }

            // setServerError(data?.message || "Registration failed. Please try again.");
            // return;
        }

      // Registration succeeded. Per the intended auth flow, the user logs
      // in separately afterwards rather than being auto-authenticated here.
    //   setSubmitted(true);
      catch (error) {
      setServerError("Could not reach the server. Check your connection and try again.");
    }
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-card--success">
          <div className="auth-success-icon" aria-hidden="true">
            ✓
          </div>
          <h1 className="auth-title">Account created</h1>
          <p className="auth-subtitle">
            Your account has been registered. You can now sign in.
          </p>
          <Link className="auth-submit auth-submit--link" href="/login">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Fill in your details to get started.</p>

        {serverError && (
          <div className="auth-alert" role="alert">
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label" htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                className={`auth-input ${errors.firstName ? "auth-input--error" : ""}`}
                placeholder="Jane"
                autoComplete="given-name"
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="auth-error">{errors.firstName.message}</span>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                className={`auth-input ${errors.lastName ? "auth-input--error" : ""}`}
                placeholder="Doe"
                autoComplete="family-name"
                {...register("lastName")}
              />
              {errors.lastName && (
                <span className="auth-error">{errors.lastName.message}</span>
              )}
            </div>
          </div>

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

          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label" htmlFor="phone">
                Phone <span className="auth-optional">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                className={`auth-input ${errors.phone ? "auth-input--error" : ""}`}
                placeholder="+92 300 1234567"
                autoComplete="tel"
                {...register("phone")}
              />
              {errors.phone && <span className="auth-error">{errors.phone.message}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="dob">
                Date of birth <span className="auth-optional">(optional)</span>
              </label>
              <input
                id="dob"
                type="date"
                className={`auth-input ${errors.dob ? "auth-input--error" : ""}`}
                autoComplete="bday"
                {...register("dob")}
              />
              {errors.dob && <span className="auth-error">{errors.dob.message}</span>}
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`auth-input ${errors.password ? "auth-input--error" : ""}`}
              placeholder="Enter a password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <span className="auth-error">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}