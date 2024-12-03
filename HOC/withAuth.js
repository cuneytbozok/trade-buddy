import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Progress } from "@/components/ui/progress"; // Import Shadcn Progress component

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        // Redirect to login if not authenticated
        router.push("/login");
      }
    }, [loading, user, router]);

    if (loading) {
      // Show a modern loader using the Shadcn Progress component
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="w-1/2 max-w-md">
            <Progress className="w-full h-2 animate-pulse" value={50} />
            <p className="text-center text-gray-500 mt-2">Authenticating...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return null; // Prevent rendering if the user is not authenticated
    }

    return <Component {...props} />;
  };
}