import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { user } = await loginUser(email, password);
      setUser(user);
      toast.success("Login successful! Redirecting to home...");
      setTimeout(() => {
        navigate("/");
        globalThis.location.reload();
      }, 2000);
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

              <p className="text-center text-sm text-muted-foreground">
                Forgot your password?{" "}
                <span className="font-medium text-foreground/80">
                  Contact your workspace admin
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
