import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  Plus,
  MoreVertical,
  Calendar,
  IndianRupee,
  Clock,
  Star,
  MessageSquare,
  Eye,
  Edit3,
  Package,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Users,
  TrendingUp,
} from "lucide-react";
import { API_ENDPOINTS, getApiUrl } from "@/lib/api";

// Mock projects data
const projectsData = [
  {
    id: "PROJ-001",
    title: "Mobile App UI/UX Design",
    description:
      "Complete mobile app design for fitness tracking application including user research, wireframes, and high-fidelity mockups.",
    category: "Design & Creative",
    status: "in_progress",
    freelancer: {
      id: "USER-001",
      name: "Sarah Johnson",
      avatar: "/api/placeholder/40/40",
      level: "Top Rated",
      rating: 4.9,
    },
    budget: 2500,
    spent: 1875,
    progress: 75,
    deadline: "2024-01-25T23:59:59Z",
    startDate: "2024-01-05T10:00:00Z",
    lastActivity: "2024-01-14T16:30:00Z",
    deliverables: 3,
    completedDeliverables: 2,
    proposals: 12,
    hired: 1,
  },
  {
    id: "PROJ-002",
    title: "E-commerce Website Development",
    description:
      "Full-stack e-commerce website with payment integration, inventory management, and admin dashboard.",
    category: "Development & IT",
    status: "completed",
    freelancer: {
      id: "USER-002",
      name: "Mike Chen",
      avatar: "/api/placeholder/40/40",
      level: "Level 2",
      rating: 4.8,
    },
    budget: 4200,
    spent: 4200,
    progress: 100,
    deadline: "2024-01-20T23:59:59Z",
    startDate: "2023-12-15T09:00:00Z",
    completedDate: "2024-01-18T14:20:00Z",
    deliverables: 5,
    completedDeliverables: 5,
    proposals: 18,
    hired: 1,
    rating: 5,
  },
  {
    id: "PROJ-003",
    title: "Content Writing for Blog",
    description:
      "SEO-optimized blog posts for technology company covering AI, blockchain, and emerging technologies.",
    category: "Writing & Translation",
    status: "draft",
    freelancer: null,
    budget: 800,
    spent: 0,
    progress: 0,
    deadline: "2024-02-05T23:59:59Z",
    startDate: null,
    lastActivity: "2024-01-12T11:15:00Z",
    deliverables: 0,
    completedDeliverables: 0,
    proposals: 7,
    hired: 0,
  },
  {
    id: "PROJ-004",
    title: "Social Media Marketing Campaign",
    description:
      "Complete social media strategy and content creation for product launch campaign across multiple platforms.",
    category: "Digital Marketing",
    status: "paused",
    freelancer: {
      id: "USER-003",
      name: "Alex Rivera",
      avatar: "/api/placeholder/40/40",
      level: "Level 1",
      rating: 4.6,
    },
    budget: 1500,
    spent: 750,
    progress: 40,
    deadline: "2024-02-10T23:59:59Z",
    startDate: "2024-01-08T14:30:00Z",
    lastActivity: "2024-01-10T09:45:00Z",
    deliverables: 4,
    completedDeliverables: 1,
    proposals: 15,
    hired: 1,
  },
];

const statusConfig = {
  draft: {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    icon: Edit3,
  },
  active: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    icon: RefreshCw,
  },
  in_progress: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    icon: RefreshCw,
  },
  paused: {
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    icon: Clock,
  },
  completed: {
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    icon: CheckCircle,
  },
  cancelled: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    icon: AlertCircle,
  },
};

export default function Projects() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || project.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    }
    return `${Math.floor(diffInHours / 24)} days ago`;
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
              <h1 className="text-3xl font-bold">My Projects</h1>
              <p className="text-muted-foreground">
                Manage your ongoing and completed projects
              </p>
            </div>
          </div>
          <GradientButton asChild>
            <Link to="/client/post-job">
              <Plus className="w-4 h-4 mr-2" />
              Post New Project
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
                    Total Projects
                  </p>
                  <p className="text-2xl font-bold">{projectsData.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      projectsData.filter(
                        (p) =>
                          p.status === "in_progress" || p.status === "active",
                      ).length
                    }
                  </p>
                </div>
                <RefreshCw className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      projectsData.filter((p) => p.status === "completed")
                        .length
                    }
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold">
                    ₹
                    {projectsData
                      .reduce((sum, project) => sum + project.spent, 0)
                      .toLocaleString()}
                  </p>
                </div>
                                        <IndianRupee className="h-8 w-8 text-purple-600" />
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
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
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
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="deadline">By Deadline</SelectItem>
                  <SelectItem value="budget">By Budget</SelectItem>
                  <SelectItem value="progress">By Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="space-y-6">
          {filteredProjects.map((project) => {
            const StatusIcon = statusConfig[project.status]?.icon || Clock;
            const daysRemaining =
              project.status === "in_progress" || project.status === "active"
                ? getDaysRemaining(project.deadline)
                : null;

            return (
              <Card
                key={project.id}
                className="border-0 bg-card/50 backdrop-blur-sm floating-card"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold">
                          {project.title}
                        </h3>
                        <Badge className={statusConfig[project.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {project.status.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline">{project.category}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/project/${project.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {project.freelancer && (
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message Freelancer
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Freelancer Info */}
                  {project.freelancer ? (
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-muted/30 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={project.freelancer.avatar} />
                        <AvatarFallback>
                          {project.freelancer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">
                            {project.freelancer.name}
                          </h4>
                          <Badge className="bg-brand-gradient text-white text-xs">
                            {project.freelancer.level}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{project.freelancer.rating}</span>
                          <span className="text-muted-foreground">
                            • Freelancer
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3 bg-muted/30 rounded-lg mb-4 text-center">
                      <p className="text-muted-foreground mb-2">
                        No freelancer hired yet
                      </p>
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-2" />
                        View {project.proposals} Proposals
                      </Button>
                    </div>
                  )}

                  {/* Project Progress */}
                  {project.status === "in_progress" && project.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>
                          {project.completedDeliverables} of{" "}
                          {project.deliverables} deliverables completed
                        </span>
                        {daysRemaining !== null && (
                          <span
                            className={daysRemaining < 3 ? "text-red-600" : ""}
                          >
                            {daysRemaining > 0
                              ? `${daysRemaining} days left`
                              : "Overdue"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                                              <IndianRupee className="w-4 h-4 text-green-500" />
                      <div>
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium ml-1">
                          ₹{project.budget}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="text-muted-foreground">Spent:</span>
                        <span className="font-medium ml-1">
                          ₹{project.spent}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <div>
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="font-medium ml-1">
                          {formatDate(project.deadline)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <div>
                        <span className="text-muted-foreground">
                          Last Activity:
                        </span>
                        <span className="font-medium ml-1">
                          {getTimeAgo(project.lastActivity)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Completed Project Rating */}
                  {project.status === "completed" && project.rating && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Project Completed
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">Your Rating:</span>
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
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Completed on {formatDate(project.completedDate)}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="default"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Project
                    </Button>
                    {project.status === "draft" && (
                      <Button variant="outline">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit & Publish
                      </Button>
                    )}
                    {project.freelancer &&
                      (project.status === "in_progress" ||
                        project.status === "active") && (
                        <Button variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message Freelancer
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first project to get started"}
              </p>
              <GradientButton asChild>
                <Link to="/client/post-job">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Project
                </Link>
              </GradientButton>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
