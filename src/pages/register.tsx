import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Register() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // const { data } = await api.post("/auth/register", formData);
      const mockData = {
        data: {
          accessToken: "mock-jwt-token",
          user: { id: "mock-user-123", email: formData.email, fullName: formData.fullName, role: "user" }
        }
      };
      login(mockData.data.accessToken, mockData.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && <div className="text-sm text-red-500">{error}</div>}
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input required onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <Button type="submit" className="w-full">Create account</Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm">
           Already have an account? <Link to="/login" className="ml-1 underline">Login</Link>
        </CardFooter>
      </Card>
    </div>
  );
}