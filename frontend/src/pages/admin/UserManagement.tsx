import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  User,
  Shield,
  Ban,
  CheckCircle,
  Clock,
  Users,
  UserPlus,
  Activity,
  IndianRupee,
} from "lucide-react";

// Mock users data
const usersData = [
  {
    id: "USR-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "/api/placeholder/40/40",
    role: "freelancer",
    status: "active",
    verified: true,
    joinDate: "2023-05-15",
    lastActive: "2024-01-14T10:30:00Z",
    totalEarnings: 45650,
    completedProjects: 89,
    rating: 4.9,
    location: "Mumbai, India",
  },
  {
    id: "USR-002",
    name: "John Smith",
    email: "john.smith@company.com",
    avatar: "/api/placeholder/40/40",
    role: "client",
    status: "active",
    verified: true,
    joinDate: "2022-08-20",
    lastActive: "2024-01-13T16:45:00Z",
    totalSpent: 78450,
    postedJobs: 24,
    rating: 4.8,
    location: "San Francisco, USA",
  },
  {
    id: "USR-003",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@dev.com",
    avatar: "/api/placeholder/40/40",
    role: "freelancer",
    status: "suspended",
    verified: false,
    joinDate: "2023-11-10",
    lastActive: "2024-01-05T12:20:00Z",
    totalEarnings: 15200,
    completedProjects: 23,
    rating: 4.2,
    location: "Bangalore, India",
  },
  {
    id: "USR-004",
    name: "Emily Davis",
    email: "emily.davis@startup.com",
    avatar: "/api/placeholder/40/40",
    role: "client",
    status: "pending",
    verified: false,
    joinDate: "2024-01-10",
    lastActive: "2024-01-12T09:15:00Z",
    totalSpent: 2400,
    postedJobs: 3,
    rating: 0,
    location: "London, UK",
  },
];

const roleColors = {
  freelancer:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  client:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  admin: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const statusColors = {
  active:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  banned: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
};

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(Array.isArray(data.users) ? data.users : Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = Array.isArray(users) ? users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  }) : [];

  const isValidDate = (date) => {
    return date && !isNaN(new Date(date).getTime());
  };

  const formatDate = (dateString: string) => {
    if (!isValidDate(dateString)) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeAgo = (timestamp: string) => {
    if (!isValidDate(timestamp)) return 'N/A';
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = (now.getTime() - time.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Less than 1 hour ago";
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const handleUserAction = async (action: string, userId: string) => {
    let endpoint = '';
    let method = 'DELETE';
    if (action === 'delete') endpoint = `/api/users/${userId}`;
    else {
      return;
    }
    try {
      const response = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' } });
      if (response.ok) {
        // Remove user from local state
        setUsers(users.filter(user => user.id !== userId));
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      alert('Action failed');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button variant="ghost" asChild size="sm" className="p-2 sm:p-3">
            <Link to="/admin">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">User Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Manage all users on the platform
            </p>
          </div>
        </div>
        <Button size="sm" className="text-xs sm:text-sm">
          <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Overview - 2x2 on mobile/tablet, 1x4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Active Users
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </div>
              <Activity className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Freelancers
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {users.filter((u) => u.role === "freelancer").length}
                </p>
              </div>
              <User className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Clients
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {users.filter((u) => u.role === "client").length}
                </p>
              </div>
              <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 sm:pl-10 text-xs sm:text-sm h-8 sm:h-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="freelancer">Freelancers</SelectItem>
                  <SelectItem value="client">Clients</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="earnings">By Earnings</SelectItem>
                <SelectItem value="rating">By Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl">All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-border/40 rounded-lg hover:bg-muted/50 transition-colors gap-3 sm:gap-4"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{user.name}</h3>
                      {user.verified && (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                      )}
                      <Badge className={`text-xs ${roleColors[user.role]}`}>
                        {user.role}
                      </Badge>
                      <Badge className={`text-xs ${statusColors[user.status]}`}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">
                      {user.email}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                      <span className="truncate">📍 {user.location}</span>
                      <span className="truncate">Joined {formatDate(user.joinDate)}</span>
                      <span className="truncate">Last active: {getTimeAgo(user.lastActive)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:gap-4 text-xs sm:text-sm min-w-[80px] sm:min-w-[120px]">
                    {user.role === "freelancer" ? (
                      <div>
                        <p className="text-muted-foreground">Projects</p>
                        <p className="font-medium">{user.projects ?? 0}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-muted-foreground">Jobs Posted</p>
                        <p className="font-medium">{user.jobsPosted ?? 0}</p>
                      </div>
                    )}
                  </div>

                  {user.rating > 0 && (
                    <div className="text-xs sm:text-sm">
                      <p className="text-muted-foreground">Rating</p>
                      <p className="font-medium">⭐ {user.rating}</p>
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                      <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                                     <DropdownMenuContent align="end">
                     <DropdownMenuItem
                       onClick={() => window.location.href = `/profile/${user.id}`}
                     >
                       <User className="mr-2 h-4 w-4" />
                       View Profile
                     </DropdownMenuItem>
                     <AlertDialog>
                       <AlertDialogTrigger asChild>
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                           <Ban className="mr-2 h-4 w-4 text-red-500" />
                           <span className="text-red-500">Ban User</span>
                         </DropdownMenuItem>
                       </AlertDialogTrigger>
                       <AlertDialogContent>
                         <AlertDialogHeader>
                           <AlertDialogTitle>Delete User</AlertDialogTitle>
                           <AlertDialogDescription>
                             Are you sure you want to delete {user.name}? This
                             action cannot be undone and will permanently remove
                             the user from the platform.
                           </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                           <AlertDialogCancel>Cancel</AlertDialogCancel>
                           <AlertDialogAction
                             onClick={() => handleUserAction("delete", user.id)}
                             className="bg-destructive hover:bg-destructive/90"
                           >
                             Delete User
                           </AlertDialogAction>
                         </AlertDialogFooter>
                       </AlertDialogContent>
                     </AlertDialog>
                   </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
