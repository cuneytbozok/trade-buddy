"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { RegisterForm } from "@/components/register-form";

function RegisterPage() {
  const { setUser } = useAuth();
  const router = useRouter();

  const handleRegister = async (data) => {
    try {
      const response = await fetch("/api/auth?action=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token); // Save token
        setUser(result.user); // Update user state

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
        title: "Network Error",
        description: "Unable to connect to the server.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Sign Up</h1>
        <RegisterForm onSubmit={handleRegister} />
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;