import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * This page is rendered when Google OAuth redirects back to the client.
 * URL: /auth/google/success?token=...&role=...etc
 * It stores the token, sets the user, then redirects to the dashboard.
 */
const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      toast.error("Google sign-in failed. Please try again.");
      navigate("/login");
      return;
    }

    // Persist token
    localStorage.setItem("authToken", token);

    // Build user object from query params
    const user = {
      id: searchParams.get("id"),
      name: searchParams.get("name"),
      email: searchParams.get("email"),
      role: searchParams.get("role"),
      avatar: searchParams.get("avatar"),
    };

    setUser(user);
    toast.success(`Welcome, ${user.name || user.email}!`);

    // Role-based redirect
    setTimeout(() => {
      const role = user.role;
      if (role === "PRODUCER") navigate("/dashboard/producer");
      else if (role === "CONSUMER") navigate("/dashboard/consumer");
      else if (role === "BOTH") navigate("/dashboard");
      else if (role === "admin") navigate("/admin");
      else navigate("/");
    }, 800);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">Signing you in with Google…</p>
        <p className="text-sm text-muted-foreground">You'll be redirected to your dashboard shortly.</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
