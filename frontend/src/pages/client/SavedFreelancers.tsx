import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Star,
  MapPin,
  Clock,
  IndianRupee,
  MessageSquare,
  Eye,
  Heart,
  HeartOff,
  Users,
  Award,
  TrendingUp,
  Briefcase,
  CheckCircle,
} from "lucide-react";

// Mock saved freelancers data
const savedFreelancers = [
  {
    id: "FRLR-001",
    name: "Sarah Johnson",
    username: "@sarahdesigns",
    avatar: "/api/placeholder/80/80",
    title: "Senior UI/UX Designer",
    category: "Design & Creative",
    location: "Mumbai, India",
    rating: 4.9,
    reviewCount: 156,
    completionRate: 98,
    responseTime: "1 hour",
    hourlyRate: 45,
    level: "Top Rated",
    online: true,
    verified: true,
    savedDate: "2024-01-10T14:30:00Z",
    lastWorked: "2024-01-05T10:00:00Z",

    bio: "Passionate UI/UX designer with 6+ years of experience creating beautiful, user-friendly interfaces for web and mobile applications.",

    skills: [
      "UI/UX Design",
      "Figma",
      "Adobe XD",
      "Prototyping",
      "User Research",
      "Wireframing",
    ],

    stats: {
      totalJobs: 89,
      totalEarnings: 234500,
      repeatClients: 67,
      avgProjectValue: 2634,
    },

    recentWork: [
      {
        title: "Mobile Banking App Design",
        client: "FinTech Startup",
        completedDate: "2024-01-05",
        rating: 5,
      },
      {
        title: "E-commerce Website Redesign",
        client: "Fashion Brand",
        completedDate: "2023-12-28",
        rating: 5,
      },
    ],
  },
  {
    id: "FRLR-002",
    name: "Rajesh Kumar",
    username: "@rajeshdev",
    avatar: "/api/placeholder/80/80",
    title: "Full-Stack Developer",
    category: "Development & IT",
    location: "Bangalore, India",
    rating: 4.8,
    reviewCount: 134,
    completionRate: 96,
    responseTime: "2 hours",
    hourlyRate: 38,
    level: "Level 2",
    online: false,
    verified: true,
    savedDate: "2024-01-08T09:15:00Z",
    lastWorked: "2023-12-20T16:30:00Z",

    bio: "Experienced full-stack developer specializing in React, Node.js, and cloud technologies. Passionate about building scalable web applications.",

    skills: ["React", "Node.js", "MongoDB", "AWS", "TypeScript", "GraphQL"],

    stats: {
      totalJobs: 67,
      totalEarnings: 189300,
      repeatClients: 45,
      avgProjectValue: 2823,
    },

    recentWork: [
      {
        title: "Real Estate Management System",
        client: "Property Company",
        completedDate: "2023-12-20",
        rating: 5,
      },
      {
        title: "Inventory Management App",
        client: "Retail Chain",
        completedDate: "2023-12-10",
        rating: 4,
      },
    ],
  },
  {
    id: "FRLR-003",
    name: "Priya Sharma",
    username: "@priyawrites",
    avatar: "/api/placeholder/80/80",
    title: "Content Writer & SEO Specialist",
    category: "Writing & Translation",
    location: "Delhi, India",
    rating: 4.7,
    reviewCount: 98,
    completionRate: 94,
    responseTime: "3 hours",
    hourlyRate: 25,
    level: "Level 1",
    online: true,
    verified: true,
    savedDate: "2024-01-06T11:45:00Z",
    lastWorked: null,

    bio: "Creative content writer with expertise in SEO optimization, blog writing, and digital marketing content. Helping brands tell their stories effectively.",

    skills: [
      "Content Writing",
      "SEO",
      "Blog Writing",
      "Technical Writing",
      "Social Media Content",
      "Email Marketing",
    ],

    stats: {
      totalJobs: 78,
      totalEarnings: 98500,
      repeatClients: 52,
      avgProjectValue: 1263,
    },

    recentWork: [
      {
        title: "Tech Blog Content Series",
        client: "Software Company",
        completedDate: "2024-01-03",
        rating: 5,
      },
      {
        title: "Website Copy Optimization",
        client: "Health Startup",
        completedDate: "2023-12-25",
        rating: 4,
      },
    ],
  },
  {
    id: "FRLR-004",
    name: "Alex Rivera",
    username: "@alexmarketing",
    avatar: "/api/placeholder/80/80",
    title: "Digital Marketing Specialist",
    category: "Digital Marketing",
    location: "Pune, India",
    rating: 4.6,
    reviewCount: 76,
    completionRate: 92,
    responseTime: "4 hours",
    hourlyRate: 32,
    level: "Level 1",
    online: false,
    verified: false,
    savedDate: "2024-01-04T16:20:00Z",
    lastWorked: null,

    bio: "Digital marketing expert with a focus on social media marketing, PPC campaigns, and growth hacking strategies for startups and SMEs.",

    skills: [
      "Social Media Marketing",
      "Google Ads",
      "Facebook Ads",
      "Content Strategy",
      "Analytics",
      "Growth Hacking",
    ],

    stats: {
      totalJobs: 45,
      totalEarnings: 67800,
      repeatClients: 28,
      avgProjectValue: 1507,
    },

    recentWork: [
      {
        title: "Social Media Campaign",
        client: "Fashion Brand",
        completedDate: "2023-12-30",
        rating: 4,
      },
      {
        title: "PPC Campaign Management",
        client: "E-commerce Store",
        completedDate: "2023-12-15",
        rating: 5,
      },
    ],
  },
];

export default function SavedFreelancers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");

  const [savedIds, setSavedIds] = useState(savedFreelancers.map((f) => f.id));

  const filteredFreelancers = savedFreelancers.filter((freelancer) => {
    const matchesSearch =
      freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      categoryFilter === "all" || freelancer.category === categoryFilter;
    const matchesLevel =
      levelFilter === "all" || freelancer.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleSaveFreelancer = (freelancerId: string) => {
    setSavedIds((prev) =>
      prev.includes(freelancerId)
        ? prev.filter((id) => id !== freelancerId)
        : [...prev, freelancerId],
    );
  };

  const getOnlineStatus = (online: boolean) => {
    return online ? (
      <div className="flex items-center text-green-600 text-xs">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
        Online
      </div>
    ) : (
      <div className="flex items-center text-muted-foreground text-xs">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
        Offline
      </div>
    );
  };

  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/client/dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Saved Freelancers</h1>
              <p className="text-muted-foreground">
                Your saved and favorite freelancers
              </p>
            </div>
          </div>
          <GradientButton asChild>
            <Link to="/browse">
              <Search className="w-4 h-4 mr-2" />
              Browse Freelancers
            </Link>
          </GradientButton>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Saved
                  </p>
                  <p className="text-2xl font-bold">
                    {savedFreelancers.length}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Top Rated
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      savedFreelancers.filter((f) => f.level === "Top Rated")
                        .length
                    }
                  </p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Worked Together
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      savedFreelancers.filter((f) => f.lastWorked !== null)
                        .length
                    }
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Online Now
                  </p>
                  <p className="text-2xl font-bold">
                    {savedFreelancers.filter((f) => f.online).length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search freelancers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Design & Creative">
                      Design & Creative
                    </SelectItem>
                    <SelectItem value="Development & IT">
                      Development & IT
                    </SelectItem>
                    <SelectItem value="Writing & Translation">
                      Writing & Translation
                    </SelectItem>
                    <SelectItem value="Digital Marketing">
                      Digital Marketing
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Top Rated">Top Rated</SelectItem>
                    <SelectItem value="Level 2">Level 2</SelectItem>
                    <SelectItem value="Level 1">Level 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Saved</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="rate">Hourly Rate</SelectItem>
                  <SelectItem value="worked">Worked Together</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Freelancers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFreelancers.map((freelancer) => (
            <Card
              key={freelancer.id}
              className="border-0 bg-card/50 backdrop-blur-sm floating-card"
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={freelancer.avatar} />
                        <AvatarFallback>
                          {freelancer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {freelancer.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {freelancer.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {freelancer.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-brand-gradient text-white">
                          {freelancer.level}
                        </Badge>
                        {getOnlineStatus(freelancer.online)}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(`/freelancer/${freelancer.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleSaveFreelancer(freelancer.id)}
                      >
                        {savedIds.includes(freelancer.id) ? (
                          <>
                            <HeartOff className="mr-2 h-4 w-4" />
                            Remove from Saved
                          </>
                        ) : (
                          <>
                            <Heart className="mr-2 h-4 w-4" />
                            Save Freelancer
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Bio */}
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {freelancer.bio}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{freelancer.rating}</span>
                    <span className="text-muted-foreground">
                      ({freelancer.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {freelancer.location}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                                            <IndianRupee className="w-4 h-4 text-green-500" />
                    <span className="font-medium">
                      ₹{freelancer.hourlyRate}
                    </span>
                    <span className="text-muted-foreground">/hour</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-muted-foreground">
                      {freelancer.responseTime} response
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.slice(0, 4).map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {freelancer.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{freelancer.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Work History */}
                {freelancer.lastWorked && (
                  <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">
                      Previous Work Together
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Last project: {formatDate(freelancer.lastWorked)}
                    </p>
                  </div>
                )}

                {/* Recent Work */}
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Recent Work</h4>
                  <div className="space-y-2">
                    {freelancer.recentWork.slice(0, 2).map((work, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-medium">{work.title}</p>
                          <p className="text-muted-foreground">
                            {work.client} • {formatDate(work.completedDate)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{work.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => navigate(`/freelancer/${freelancer.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSaveFreelancer(freelancer.id)}
                    className={
                      savedIds.includes(freelancer.id)
                        ? "text-red-600 hover:text-red-700"
                        : ""
                    }
                  >
                    {savedIds.includes(freelancer.id) ? (
                      <HeartOff className="w-4 h-4" />
                    ) : (
                      <Heart className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Saved Date */}
                <div className="mt-3 pt-3 border-t border-border/40">
                  <p className="text-xs text-muted-foreground">
                    Saved on {formatDate(freelancer.savedDate)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredFreelancers.length === 0 && (
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No saved freelancers found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || categoryFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start saving freelancers you'd like to work with"}
              </p>
              <GradientButton asChild>
                <Link to="/browse">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Freelancers
                </Link>
              </GradientButton>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
