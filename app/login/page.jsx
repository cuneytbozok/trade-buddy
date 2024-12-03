"use client";
import { LoginForm } from "@/components/login-form"
import authenticated from "@/HOC/authenticated";

function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  )
}

export default authenticated(Page);
