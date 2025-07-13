import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Edit3,
  Save,
  Camera,
  Shield,
  Key,
  Bell,
  Activity,
  Users,
  Package,
  DollarSign,
} from "lucide-react";

// Mock admin profile data
const adminProfile = {
  id: "ADMIN-001",
  name: "John Administrator",
  email: "john.admin@freelancehub.com",
  avatar: "/api/placeholder/120/120",
  role: "Super Admin",
  department: "Platform Operations",
  joinDate: "2022-01-15",
  lastLogin: "2024-01-14T09:30:00Z",
  permissions: [
    "user_management",
    "gig_management",
    "financial_management",
    "system_settings",
    "analytics_access",
    "support_management",
  ],
  bio: "Experienced platform administrator with expertise in managing large-scale marketplace operations. Focused on ensuring smooth platform operations and user satisfaction.",
  phone: "+91 98765 43210",
  location: "Mumbai, India",
  timezone: "IST (UTC+5:30)",

  // Activity stats
  stats: {
    usersManaged: 2720,
    gigsReviewed: 456,
    ticketsResolved: 189,
    reportsGenerated: 42,
  },

  // Notification preferences
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    criticalAlertsOnly: false,
    weeklyReports: true,
    systemMaintenance: true,
  },

  // Security settings
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: "2023-12-01",
    activeSessions: 2,
    loginAttempts: 0,
  },
};

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(adminProfile);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  const handleSaveChanges = () => {
    console.log("Saving admin profile changes:", profileData);
    setIsEditing(false);
    // In real app, call API to save changes
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getLastLoginTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Less than 1 hour ago";
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Admin Profile</h1>
            <p className="text-muted-foreground">
              Manage your admin profile and settings
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveChanges}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <h2 className="text-xl font-bold mb-1">{profileData.name}</h2>
              <p className="text-muted-foreground mb-2">{profileData.role}</p>

              <div className="flex items-center justify-center space-x-2 mb-4">
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin Access
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-muted-foreground">Department:</span>
                  <span>{profileData.department}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-muted-foreground">Joined:</span>
                  <span>{formatDate(profileData.joinDate)}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-muted-foreground">Last Login:</span>
                  <span>{getLastLoginTime(profileData.lastLogin)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-muted-foreground">
                    Users Managed
                  </span>
                </div>
                <span className="font-medium">
                  {profileData.stats.usersManaged.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-muted-foreground">
                    Gigs Reviewed
                  </span>
                </div>
                <span className="font-medium">
                  {profileData.stats.gigsReviewed}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">
                    Tickets Resolved
                  </span>
                </div>
                <span className="font-medium">
                  {profileData.stats.ticketsResolved}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-muted-foreground">
                    Reports Generated
                  </span>
                </div>
                <span className="font-medium">
                  {profileData.stats.reportsGenerated}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue placeholder={profileData.department} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platform_operations">
                        Platform Operations
                      </SelectItem>
                      <SelectItem value="user_support">User Support</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue placeholder={profileData.timezone} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                      <SelectItem value="pst">PST (UTC-8)</SelectItem>
                      <SelectItem value="est">EST (UTC-5)</SelectItem>
                      <SelectItem value="utc">UTC (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profileData.permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg"
                  >
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">
                      {permission
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <div>
                      <h4 className="font-medium">Email Alerts</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive important notifications via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={profileData.notifications.emailAlerts}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("emailAlerts", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get critical alerts via SMS
                    </p>
                  </div>
                  <Switch
                    checked={profileData.notifications.smsAlerts}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("smsAlerts", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Browser push notifications for real-time updates
                    </p>
                  </div>
                  <Switch
                    checked={profileData.notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("pushNotifications", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Reports</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly platform performance reports
                    </p>
                  </div>
                  <Switch
                    checked={profileData.notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("weeklyReports", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border/40 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-green-500" />
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Extra security for your admin account
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Enabled
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Last Password Change</h4>
                  <p className="text-muted-foreground">
                    {formatDate(profileData.security.lastPasswordChange)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Active Sessions</h4>
                  <p className="text-muted-foreground">
                    {profileData.security.activeSessions} devices
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Manage Sessions</Button>
                <Button variant="outline">Download Backup Codes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
