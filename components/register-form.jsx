"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

const FormSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must include an uppercase letter" })
      .regex(/[a-z]/, { message: "Password must include a lowercase letter" })
      .regex(/[0-9]/, { message: "Password must include a number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must include a special character",
      }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export function RegisterForm({ onSubmit }) {
  const { setUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Initialize useForm with default values
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "", // Explicitly set default value
      password: "", // Explicitly set default value
      confirmPassword: "", // Explicitly set default value
    },
  });

  const handleSubmit = async (data) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("/api/auth?action=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await response.json();

      if (response.ok) {
        if (!result.token) {
          throw new Error("Token is missing in the response");
        }

        localStorage.setItem("token", result.token);
        const decoded = jwt.decode(result.token);

        if (!decoded || !decoded.id) {
          throw new Error("Invalid token structure");
        }

        setUser(decoded); // Immediately update user state

        toast({
          title: "Registration Successful!",
          description: "You are now logged in.",
        });

        router.push("/home"); // Redirect to home
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Network error. Please try again.",
        variant: "destructive",
      });
      console.error("Registration Error:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage aria-live="polite" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage aria-live="polite" />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your password" {...field} />
              </FormControl>
              <FormMessage aria-live="polite" />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}