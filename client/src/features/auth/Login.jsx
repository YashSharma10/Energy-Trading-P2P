import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { loginUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, Lock, CheckCircle, ArrowRight } from "lucide-react";
import auth from "/auth.jpg";
import { toast } from "sonner";

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL}/auth/google`;


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Show error from Google OAuth redirect
  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "google_auth_failed") {
      toast.error("Google sign-in failed. Please try again.");
    }
  }, [searchParams]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { user } = await loginUser(email, password);
      setUser(user);
      toast.success("Login successful! Redirecting...");
      
      // Role-based redirect
      setTimeout(() => {
        if (user.role === "PRODUCER") {
          navigate("/dashboard/producer");
        } else if (user.role === "CONSUMER") {
          navigate("/dashboard/consumer");
        } else if (user.role === "BOTH") {
          navigate("/dashboard");
        } else if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
        globalThis.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent dark:from-emerald-500/20" />
      <div className="absolute -left-16 top-32 hidden h-80 w-80 rounded-full bg-brandMainColor/20 blur-3xl dark:bg-brandSubColor/15 lg:block" />
      <div className="absolute right-12 top-10 h-32 w-32 rounded-full bg-lime-400/20 blur-3xl dark:bg-lime-300/10" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16 lg:px-0">
        <div className="grid w-full gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary dark:text-primary-foreground">
              <CheckCircle className="h-4 w-4" />
              Secure climate intelligence access
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Welcome back to CarbonEase
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Sign in to manage offsets, monitor project performance, and keep
              your sustainability roadmap on track.
            </p>
            <div className="grid max-w-xl gap-4 sm:grid-cols-2">
              {[
                "Unified emissions dashboard",
                "Procurement-ready reports",
                "Real-time project diligence",
                "Collaborative task flows",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-muted-foreground"
                >
                  <CheckCircle className="h-4 w-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 text-sm text-muted-foreground">
              <img
                src={auth}
                alt="CarbonEase platform"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  New to CarbonEase?
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 text-sm font-medium text-brandMainColor transition-colors hover:text-brandMainColor/80 dark:text-brandSubColor dark:hover:text-brandSubColor/90"
                >
                  Create your account <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <Card className="border border-border/70 bg-card/90 shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Sign in
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Use your email and password to access your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Work email"
                    type="email"
                    className="h-12 rounded-xl border-border bg-background/[0.85] pl-11 text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    className="h-12 rounded-xl border-border bg-background/[0.85] pl-11 text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="h-12 w-full rounded-xl bg-brandMainColor text-sm font-semibold text-white transition-colors hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:text-slate-950 dark:hover:bg-brandSubColor/90"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>

              {/* ── Divider ── */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or continue with</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* ── Google Sign-In ── */}
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-xl border border-border bg-background text-sm font-semibold text-foreground transition-all hover:bg-muted/50 hover:shadow-sm"
                onClick={() => (window.location.href = GOOGLE_AUTH_URL)}
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Forgot your password?{" "}
                <Link
                  to="/forgot-password"
                  className="font-medium text-brandMainColor transition-colors hover:text-brandMainColor/80 dark:text-brandSubColor dark:hover:text-brandSubColor/90"
                >
                  Reset it here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
