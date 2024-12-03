"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withGuest(Component) {
  return function GuestOnlyComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && user) {
        // Redirect logged-in users to /home or any other page
        router.push("/home");
      }
    }, [loading, user, router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p> {/* You can use a loader component here */}
        </div>
      );
    }

    if (user) {
      return null; // Prevent rendering the login/register page if user is logged in
    }

    return <Component {...props} />;
  };
}