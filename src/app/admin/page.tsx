"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Shield,
  Activity,
  Search,
  MoreHorizontal,
} from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "agent" | "customer" | "designer" | "merchant";
}

interface ChatStats {
  totalMessages: number;
  activeConversations: number;
  totalUsers: number;
  onlineUsers: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user.role !== "admin") {
        alert("Access denied. Admin privileges required.");
        router.push("/chat");
        return;
      }

      loadDashboardData();
    } catch (error) {
      console.error("Access check failed:", error);
      router.push("/login");
    }
  };

  const loadDashboardData = async () => {
    try {
      // Demo data
      const demoStats: ChatStats = {
        totalMessages: 1247,
        activeConversations: 23,
        totalUsers: 156,
        onlineUsers: 12,
      };

      const demoUsers: User[] = [
        {
          id: "1",
          username: "john_doe",
          email: "john@example.com",
          role: "customer",
        },
        {
          id: "2",
          username: "sarah_agent",
          email: "sarah@workcity.com",
          role: "agent",
        },
        {
          id: "3",
          username: "mike_designer",
          email: "mike@example.com",
          role: "designer",
        },
        {
          id: "4",
          username: "lisa_merchant",
          email: "lisa@store.com",
          role: "merchant",
        },
      ];

      setCurrentUser({
        id: "admin1",
        username: "admin",
        email: "admin@workcity.com",
        role: "admin",
      });

      setStats(demoStats);
      setUsers(demoUsers);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
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

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      banned: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/chat")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Chat
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage users and monitor chat system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-600">
              Admin Access
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Online Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.onlineUsers}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Chats
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.activeConversations}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Messages
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalMessages}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="merchant">Merchant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {/* <p className="text-xs text-gray-500">
                            Last active:{" "}
                            {new Date(user.lastActive).toLocaleDateString()}
                          </p> */}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        {/* <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge> */}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversations">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Management</CardTitle>
                <CardDescription>
                  Monitor and manage active conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Conversation management features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure chat system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  System settings panel coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
