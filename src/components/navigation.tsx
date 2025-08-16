"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, LogOut, Shield, ChevronDown } from "lucide-react";

interface AppUser {
  username: string;
  email: string;
  role: "admin" | "agent" | "customer" | "designer" | "merchant";
}

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    // Load user data from localStorage or API
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Demo user
      setUser({
        username: "john_doe",
        email: "john@example.com",
        role: "customer",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      agent: "bg-blue-100 text-blue-800",
      customer: "bg-green-100 text-green-800",
      designer: "bg-purple-100 text-purple-800",
      merchant: "bg-orange-100 text-orange-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-gray-900">Workcity Chat</h1>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant={pathname === "/chat" ? "default" : "ghost"}
              size="sm"
              onClick={() => router.push("/chat")}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>

            <Button
              variant={pathname === "/profile" ? "default" : "ghost"}
              size="sm"
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2"
            >
              {/* User icon */}
              Profile
            </Button>

            {user.role === "admin" && (
              <Button
                variant={pathname === "/admin" ? "default" : "ghost"}
                size="sm"
                onClick={() => router.push("/admin")}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-3 py-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user.username}</p>
                <Badge className={`${getRoleColor(user.role)} text-xs`}>
                  {user.role}
                </Badge>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push("/chat")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push("/profile")}>
              {/* User icon */}
              Profile
            </DropdownMenuItem>

            {user.role === "admin" && (
              <DropdownMenuItem onClick={() => router.push("/admin")}>
                <Shield className="mr-2 h-4 w-4" />
                Admin Dashboard
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
