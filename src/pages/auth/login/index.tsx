import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Lock, User } from "lucide-react";
import { APP_NAME, APP_DESCRIPTION } from "@/constants";
import { AUTH_MESSAGES } from "@/constants/messages";
import { ROUTE_PATHS } from "@/constants/enum";

// ─────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────

export default function Login() {
  const [username, setUsername] = useState("");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted px-4 sm:px-6">
      <div className="w-full max-w-md space-y-4">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl   font-bold tracking-tight text-foreground">
            {APP_NAME}
          </h1>
          <p className="text-muted-foreground mt-2">{APP_DESCRIPTION}</p>
        </div>

        {/* Card */}
        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Access your assessment dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    className="pl-10"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full py-6 text-lg font-semibold">
                Login to Portal
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Forgot password note */}
        <div className="p-4 bg-secondary border border-border rounded-lg text-center">
          <p className="text-sm text-secondary-foreground">
            <strong>Forgot Password?</strong>
            <br />
            Please contact the administrator to request a new password.
          </p>
        </div>
      </div>
    </div>
  );
}