"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Mail, Phone, MapPin } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: "admin" | "agent" | "customer" | "designer" | "merchant";
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  avatar?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Demo profile data
      const demoProfile: UserProfile = {
        id: "1",
        username: "john_doe",
        email: "john@example.com",
        role: "customer",
        firstName: "John",
        lastName: "Doe",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        createdAt: "2024-01-15T10:30:00Z",
      };

      setProfile(demoProfile);
      setFormData({
        firstName: demoProfile.firstName || "",
        lastName: demoProfile.lastName || "",
        phone: demoProfile.phone || "",
        location: demoProfile.location || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In real implementation, this would call the API
      // await apiClient.updateProfile(formData)

      // Demo: Update local state
      if (profile) {
        setProfile({
          ...profile,
          ...formData,
        });
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile</p>
          <Button onClick={() => router.push("/chat")} className="mt-4">
            Back to Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/chat")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Chat
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {profile.firstName?.[0]}
                  {profile.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">
                {profile.firstName} {profile.lastName}
              </CardTitle>
              <CardDescription>@{profile.username}</CardDescription>
              <Badge className={getRoleColor(profile.role)}>
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {profile.email}
              </div>
              {profile.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {profile.phone}
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
              )}
              <Separator />
              <div className="text-xs text-gray-500">
                Member since {new Date(profile.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Enter your location"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={profile.email} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={profile.role} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                </Select>
                <p className="text-xs text-gray-500">
                  Role is assigned by administrators
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
