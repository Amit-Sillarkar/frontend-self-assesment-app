import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { APP_NAME, APP_DESCRIPTION } from "@/constants";
import { AUTH_MESSAGES } from "@/constants/messages";
import { ROUTE_PATHS } from "@/constants/enum";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.jpeg";
// ─────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // TODO: Replace with real auth when API is ready
      navigate(ROUTE_PATHS.COLORS);
    } catch {
      setError(AUTH_MESSAGES.LOGIN_FAILED);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background font-sans">
      {/* ── LEFT SIDE: BRANDING (Hidden on Mobile) ── */}
      <div className="hidden md:flex md:w-1/2 bg-muted/30 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative background element using brand primary */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center space-y-6 max-w-md">
          <img
            src={logo}
            alt="KD Aher Logo"
            className="w-48 h-auto mx-auto drop-shadow-xl rounded-xl"
          />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Skill Assessment Portal
            </h1>
            <p className="text-muted-foreground text-lg">
              Empowering growth through structured evaluation and feedback.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: LOGIN FORM ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile Logo Only */}
          <div className="md:hidden text-center mb-8">
            <img src={logo} alt="Logo" className="w-32 h-auto mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <h2 className="hidden md:block text-3xl font-bold tracking-tight text-foreground">
              Login to account
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11 border-border bg-card focus-visible:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 border-border bg-card focus-visible:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Sign In
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Forgot your password? {""}
              <button
                className="font-bold text-primary hover:underline"
              >
                please contact admin
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
