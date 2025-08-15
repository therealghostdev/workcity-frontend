"use client";

import type React from "react";
import { apiClient } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, Users, Shield, Palette, Store } from "lucide-react";

const roleIcons = {
  customer: Users,
  agent: Shield,
  designer: Palette,
  merchant: Store,
  admin: Shield,
};

const roleDescriptions = {
  customer: "Browse and chat with merchants and designers",
  agent: "Provide customer support and assistance",
  designer: "Showcase designs and communicate with clients",
  merchant: "Manage products and customer relationships",
  admin: "Oversee platform operations and user management",
};

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const result = await apiClient.login({
          email: formData.email,
          password: formData.password,
        });

        if (result.message && result.message) {
          localStorage.setItem("token", result.token || "");
          localStorage.setItem("user", JSON.stringify(result.user));
          router.push("/chat");
        } else {
          setError(result.message || "Login failed");
        }
      } else {
        const result = await apiClient.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        if (result.success && result.message) {
          localStorage.setItem("token", result.token || "");
          localStorage.setItem("user", JSON.stringify(result.user));
          router.push("/chat");
        } else {
          setError(result.message || "Registration failed");
        }
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Workcity Chat</CardTitle>
          <CardDescription>
            Connect with merchants, designers, and support agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}
          <Tabs
            value={isLogin ? "login" : "signup"}
            onValueChange={(value) => setIsLogin(value === "login")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleDescriptions).map(
                        ([role, description]) => {
                          const Icon =
                            roleIcons[role as keyof typeof roleIcons];
                          return (
                            <SelectItem key={role} value={role}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <div>
                                  <div className="font-medium capitalize">
                                    {role}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {description}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
