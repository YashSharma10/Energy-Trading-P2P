import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/services/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, Lock, CheckCircle, Sparkles, Zap, ShoppingCart, ArrowLeftRight, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import auth from "/auth.jpg";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CONSUMER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!agreed) {
      toast({
        title: "Terms & Conditions",
        description:
          "You must agree to the terms and conditions before registering.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError("");

    try {
      await registerUser(email, password, name, role);
      toast({
        title: "OTP Sent",
        description:
          "An OTP has been sent to your email. Please verify your account.",
        variant: "default",
      });
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "PRODUCER",
      label: "Producer",
      description: "Sell surplus energy",
      icon: Zap,
      color: "text-emerald-600 dark:text-emerald-400"
    },
    {
      value: "CONSUMER",
      label: "Consumer",
      description: "Buy energy",
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      value: "BOTH",
      label: "Both",
      description: "Buy & Sell energy",
      icon: ArrowLeftRight,
      color: "text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-brandMainColor/15 via-transparent to-transparent dark:from-brandSubColor/15" />
      <div className="absolute left-10 top-24 hidden h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-400/10 lg:block" />
      <div className="absolute right-12 bottom-12 h-56 w-56 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-200/10" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16 lg:px-0">
        <div className="grid w-full gap-12 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary dark:text-primary-foreground">
              <Sparkles className="h-4 w-4" />
              Join the Energy Trading Network
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Start Trading Clean Energy Today
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Join our peer-to-peer energy trading platform. Buy and sell renewable energy directly, 
              maximize your energy efficiency, and contribute to a sustainable future.
            </p>
            <div className="grid max-w-xl gap-4 sm:grid-cols-2">
              {[
                "Trade energy in real-time",
                "Transparent pricing",
                "Blockchain-verified transactions",
                "Smart contract automation",
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
                alt="Energy Trading preview"
                className="h-12 w-12 rounded-full object-cover"
              />
              <p>
                Already registered?{" "}
                <Link
                  to="/login"
                  className="font-medium text-brandMainColor transition-colors hover:text-brandMainColor/80 dark:text-brandSubColor dark:hover:text-brandSubColor/90"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>

          <Card className="border border-border/70 bg-card/90 shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Join the P2P energy trading revolution
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
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    type="text"
                    className="h-12 rounded-xl border-border bg-background/[0.85] pl-11 text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
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

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Select Your Role
                  </Label>
                  <RadioGroup value={role} onValueChange={setRole}>
                    {roleOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <div
                          key={option.value}
                          className={`flex items-center space-x-3 rounded-xl border-2 p-4 transition-all cursor-pointer ${
                            role === option.value
                              ? "border-primary bg-primary/5"
                              : "border-border/60 hover:border-border"
                          }`}
                          onClick={() => setRole(option.value)}
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Icon className={`h-5 w-5 ${option.color}`} />
                          <div className="flex-1">
                            <Label
                              htmlFor={option.value}
                              className="font-medium text-foreground cursor-pointer"
                            >
                              {option.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-muted-foreground">
                  <Checkbox
                    id="terms"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked === true)}
                  />
                  <label htmlFor="terms" className="leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="ml-1 font-medium text-brandMainColor hover:underline dark:text-brandSubColor"
                    >
                      Terms & Conditions
                    </a>
                    .
                  </label>
                </div>
              </div>

              <Button
                onClick={handleRegister}
                disabled={loading}
                className="h-12 w-full rounded-xl bg-brandMainColor text-sm font-semibold text-white transition-colors hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:text-slate-950 dark:hover:bg-brandSubColor/90"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                By continuing, you agree to receive communications about the platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
