import React, { useState, useEffect } from "react";
import { API_ENDPOINTS, fetchApi, API_BASE_URL } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Eye,
  Trash2,
  Star,
  TrendingUp,
  Clock,
  IndianRupee,
  Package,
  BarChart3,
} from "lucide-react";
import { io as socketIOClient } from 'socket.io-client';

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "paused":
      return "bg-yellow-500";
    case "draft":
      return "bg-gray-400";
    case "pending":
      return "bg-blue-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-200";
  }
}

export default function MyGigs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGigs() {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Not logged in.');
        setGigs([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/gigs/my`, {
          headers: {
            'user-id': `userId-freelancerId-${userId}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message || 'Failed to fetch gigs.');
          setGigs([]);
        } else {
          setGigs(data.gigs);
        }
      } catch (err: any) {
        console.error('Error fetching gigs:', err);
        setError(err.message || 'Failed to fetch gigs. Please check if the server is running.');
        setGigs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGigs();
  }, []);

  useEffect(() => {
    try {
      const socket = socketIOClient(API_BASE_URL, {
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
      });
      
      socket.on('connect', () => {
        console.log('Socket connected');
      });
      
      socket.on('connect_error', (error) => {
        console.warn('Socket connection error:', error);
      });
      
      socket.on('gigCreated', (gig) => {
        setGigs((prev) => [gig, ...prev]);
      });
      socket.on('gigUpdated', (gig) => {
        setGigs((prev) => prev.map((g) => g._id === gig._id ? gig : g));
      });
      socket.on('gigDeleted', (gigId) => {
        setGigs((prev) => prev.filter((g) => g._id !== gigId));
      });
      
      return () => { 
        socket.disconnect(); 
      };
    } catch (error) {
      console.warn('Socket connection failed:', error);
    }
  }, []);

  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch = gig.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || gig.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const handleDeleteGig = (gigId: string) => {
    // In a real app, you'd call an API to delete the gig
    console.log("Deleting gig:", gigId);
  };

  const handleDuplicateGig = (gigId: string) => {
    // In a real app, you'd call an API to duplicate the gig
    console.log("Duplicating gig:", gigId);
  };

  const handleToggleStatus = (gigId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    console.log(`Changing gig ${gigId} from ${currentStatus} to ${newStatus}`);
  };

  if (loading) return <div className="text-center py-8">Loading gigs...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!gigs.length) return <div className="text-center py-8">No gigs found.</div>;

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-0">
            <Button variant="ghost" asChild className="p-2 sm:p-3">
              <Link to="/freelancer/dashboard">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">My Gigs</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage your services and track performance
              </p>
            </div>
          </div>
          <GradientButton asChild size="sm" className="text-xs sm:text-sm">
            <Link to="/freelancer/create-gig">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Create New Gig
            </Link>
          </GradientButton>
        </div>

        {/* Stats Overview - 2x2 on mobile/tablet, 1x4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Active Gigs
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {gigs.filter((g) => g.status === "active").length}
                  </p>
                </div>
                <Package className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total Orders
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {gigs.reduce((sum, gig) => sum + gig.orders, 0)}
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Avg. Rating
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {(
                      gigs
                        .filter((g) => g.rating > 0)
                        .reduce((sum, gig) => sum + gig.rating, 0) /
                      gigs.filter((g) => g.rating > 0).length
                    ).toFixed(1)}
                  </p>
                </div>
                <Star className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    In Queue
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {gigs.reduce((sum, gig) => sum + gig.queue, 0)}
                  </p>
                </div>
                <Clock className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search your gigs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 sm:h-11"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32 h-10 sm:h-11">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40 h-10 sm:h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="orders">Most Orders</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Loading...</h3>
              </CardContent>
            </Card>
          ) : filteredGigs.length === 0 ? (
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No gigs found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first gig to start selling your services"}
                </p>
                <GradientButton asChild>
                  <Link to="/freelancer/create-gig">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Gig
                  </Link>
                </GradientButton>
              </CardContent>
            </Card>
          ) : (
            filteredGigs.map((gig) => (
              <Card
                key={gig._id}
                className="border-0 bg-card/50 backdrop-blur-sm floating-card"
              >
                <CardContent className="p-0">
                  {/* Gig Image */}
                  <div className="aspect-video rounded-t-lg relative overflow-hidden">
                    {gig.images?.length > 0 ? (
                      <img
                        src={`${API_BASE_URL}${gig.images[0]}`}
                        alt={gig.title}
                        className="w-full h-full object-cover object-center transition-all duration-300 hover:scale-105"
                        style={{ minHeight: '100%', minWidth: '100%' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
                        <Package className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground opacity-40" />
                      </div>
                    )}
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-background/80 backdrop-blur-sm"
                          >
                            <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/gigs/${gig._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/freelancer/edit-gig/${gig._id}`}>
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(gig._id, gig.status)}
                          >
                            <Package className="mr-2 h-4 w-4" />
                            {gig.status === "active" ? "Pause" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateGig(gig._id)}
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteGig(gig._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Gig Content */}
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">
                      {gig.title}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {gig.description}
                    </p>

                    {/* Category Badge */}
                    <div className="mb-3 sm:mb-4">
                      <Badge variant="outline" className="text-xs">
                        {gig.category || "General"}
                      </Badge>
                    </div>

                    {/* Price */}
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">
                      ₹{gig.packages?.basic?.price || 0}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                        asChild
                      >
                        <Link to={`/gigs/${gig._id}`}>
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                        asChild
                      >
                        <Link to={`/freelancer/edit-gig/${gig._id}`}>
                          <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}