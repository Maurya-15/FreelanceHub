import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS, getApiUrl } from "@/lib/api";
import {
  Edit,
  Save,
  X,
  MapPin,
  Globe,
  Phone,
  Mail,
  Calendar,
  Star,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import useClientProfile from "@/hooks/useClientProfile";
import { useAuth } from "../../contexts/AuthContext";

// Remove mock clientProfile data. Use real API data.

export default function ClientProfile() {
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const { data, loading, error } = useClientProfile(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState<any>(null);

  // Keep local state in sync with fetched profile data
  React.useEffect(() => {
    if (data) setProfileData(data);
  }, [data]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }
  if (error || !profileData) {
    return <div className="min-h-screen flex items-center justify-center text-destructive">{error || "Failed to load profile."}</div>;
  }

  // Destructure fields from profileData for convenience
  const {
    name,
    email,
    avatar,
    title,
    company,
    location,
    timezone,
    memberSince,
    verified,
    bio,
    website,
    linkedin,
    stats = {},
    preferences = {},
    recentProjects = [],
    reviews = [],
  } = profileData || {};

  const handleSaveChanges = () => {
    // In a real app, you'd save to backend
    console.log("Saving profile changes:", profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/client/dashboard">
                <X className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your account information and preferences
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
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
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
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <h2 className="text-xl font-bold mb-1">{profileData.name}</h2>
                <p className="text-muted-foreground mb-2">
                  {profileData.title}
                </p>

                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Badge className="bg-brand-gradient text-white">
                    {profileData.verified ? "Verified Client" : "Standard"}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Member since{" "}
                      {new Date(profileData.memberSince).getFullYear()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jobs Posted</span>
                  <span className="font-medium">
                    {profileData.stats?.totalJobsPosted ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent</span>
                  <span className="font-medium">
                    ₹{(profileData.stats?.totalSpent ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {profileData.stats?.avgRating ?? '-'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Rate</span>
                  <span className="font-medium">
                    {profileData.stats?.responseRate ?? 0}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Button variant="outline" onClick={() => setActiveTab("overview")} className={`${activeTab === "overview" ? "bg-primary text-white" : ""}`}>
                Overview
              </Button>
              <Button variant="outline" onClick={() => setActiveTab("projects")} className={`${activeTab === "projects" ? "bg-primary text-white" : ""}`}>
                Projects
              </Button>
              <Button variant="outline" onClick={() => setActiveTab("reviews")} className={`${activeTab === "reviews" ? "bg-primary text-white" : ""}`}>
                Reviews
              </Button>
              <Button variant="outline" onClick={() => setActiveTab("settings")} className={`${activeTab === "settings" ? "bg-primary text-white" : ""}`}>
                Settings
              </Button>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* About Section */}
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) =>
                              handleInputChange("bio", e.target.value)
                            }
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              value={profileData.website}
                              onChange={(e) =>
                                handleInputChange("website", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              value={profileData.linkedin}
                              onChange={(e) =>
                                handleInputChange("linkedin", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {profileData.bio}
                        </p>
                        <div className="flex space-x-4">
                          {profileData.website && (
                            <a
                              href={profileData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-primary hover:underline"
                            >
                              <Globe className="w-4 h-4" />
                              <span>Website</span>
                            </a>
                          )}
                          {profileData.linkedin && (
                            <a
                              href={profileData.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-primary hover:underline"
                            >
                              <Users className="w-4 h-4" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-0 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                      <h3 className="text-2xl font-bold mb-1">
                        {profileData.stats?.activeProjects ?? 0}
                      </h3>
                      <p className="text-muted-foreground">Active Projects</p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="w-8 h-8 mx-auto mb-3 text-green-600" />
                      <h3 className="text-2xl font-bold mb-1">
                        {profileData.stats?.completedProjects ?? 0}
                      </h3>
                      <p className="text-muted-foreground">
                        Completed Projects
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                      <h3 className="text-2xl font-bold mb-1">
                        {profileData.stats?.responseTime ?? '-'}
                      </h3>
                      <p className="text-muted-foreground">Avg Response Time</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Preferences */}
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Hiring Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Budget Range</h4>
                        <p className="text-muted-foreground">
                          {profileData.preferences?.budgetRange ?? '-'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Working Hours</h4>
                        <p className="text-muted-foreground">
                          {profileData.preferences?.workingHours ?? '-'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Preferred Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {(profileData.preferences?.preferredCategories ?? []).map((category: string) => (
  <Badge key={category} variant="secondary">
    {category}
  </Badge>
))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(profileData.recentProjects ?? []).map((project: any) => (
                        <div
                          key={project.id}
                          className="p-4 border border-border/40 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{project.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                with {project.freelancer}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(project.status)}>
                                {typeof project.status === 'string' ? project.status.replace("_", " ") : (project.status ?? '-')}
                              </Badge>
                              <p className="text-sm font-medium mt-1">
                                ₹{project.budget}
                              </p>
                            </div>
                          </div>

                          {project.status === "completed" && project.rating && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">
                                Rating given:
                              </span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < project.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                • Completed {formatDate(project.completedDate)}
                              </span>
                            </div>
                          )}

                          {project.status === "in_progress" &&
                            project.progress && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{project.progress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Reviews from Freelancers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {(profileData.reviews ?? []).map((review: any) => (
                        <div key={review.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">
                                {review.freelancer}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {review.project}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(review.date)}
                              </p>
                            </div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            "{review.comment}"
                          </p>
                          {review !==
                            profileData.reviews[
                              profileData.reviews.length - 1
                            ] && <Separator />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          value={profileData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          value={profileData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={profileData.company}
                          onChange={(e) =>
                            handleInputChange("company", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue placeholder={profileData.timezone} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pst">PST (UTC-8)</SelectItem>
                            <SelectItem value="est">EST (UTC-5)</SelectItem>
                            <SelectItem value="utc">UTC (UTC+0)</SelectItem>
                            <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive email updates about your projects
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">SMS Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            Get text messages for urgent updates
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
