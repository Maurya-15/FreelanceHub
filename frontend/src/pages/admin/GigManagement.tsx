import React, { useState, useEffect } from "react";
import { API_ENDPOINTS, getApiUrl } from "@/lib/api";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Flag,
  CheckCircle,
  X,
  Clock,
  Package,
  TrendingUp,
  AlertTriangle,
  Star,
  Loader2,
} from "lucide-react";

const statusColors = {
  active:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  under_review:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

export default function GigManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [gigsData, setGigsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGig, setSelectedGig] = useState(null);
  const [showGigDetails, setShowGigDetails] = useState(false);

  // Fetch gigs from API
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gigs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch gigs');
        }
        const data = await response.json();
        if (data.success) {
          // Transform API data to match UI expectations
          const transformedGigs = data.gigs.map(gig => ({
            id: gig._id,
            title: gig.title,
            description: gig.description,
            category: gig.category,
            price: gig.packages && gig.packages.basic ? gig.packages.basic.price : 0,
            status: gig.status || 'active',
            featured: gig.featured || false,
            freelancer: {
              name: gig.freelancer?.name || gig.freelancer?.username || "Unknown Freelancer",
              avatar: gig.freelancer?.profilePicture || gig.freelancer?.avatar || "/api/placeholder/40/40",
              level: gig.freelancer?.level || "Level 1",
            },
            orders: gig.orders || 0,
            reviews: gig.reviews || 0,
            createdAt: gig.createdAt,
            lastModified: gig.updatedAt || gig.createdAt,
            flags: gig.flags || 0,
          }));
          setGigsData(transformedGigs);
        } else {
          setError(data.message || 'Failed to fetch gigs');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching gigs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  const filteredGigs = gigsData.filter((gig) => {
    const matchesSearch = gig.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || gig.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || gig.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleGigAction = async (action: string, gigId: string) => {
    if (action === 'view') {
      const gig = gigsData.find(g => g.id === gigId);
      setSelectedGig(gig);
      setShowGigDetails(true);
      return;
    }
    
    let endpoint = '';
    let method = 'PUT';
    let body = null;
    if (action === 'approve') endpoint = `/api/gigs/${gigId}/approve`;
    else if (action === 'delete') { endpoint = `/api/gigs/${gigId}`; method = 'DELETE'; }
    else return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body });
      if (!res.ok) throw new Error('Action failed');
      // Refresh gigs
      const gigsRes = await fetch('/api/gigs');
      const gigsData = await gigsRes.json();
      if (gigsData.success) {
        const transformedGigs = gigsData.gigs.map(gig => ({
          id: gig._id,
          title: gig.title,
          description: gig.description,
          category: gig.category,
          price: gig.packages && gig.packages.basic ? gig.packages.basic.price : 0,
          status: gig.status || 'active',
          featured: gig.featured || false,
          freelancer: {
            name: gig.freelancer?.name || gig.freelancer?.username || "Unknown Freelancer",
            avatar: gig.freelancer?.profilePicture || gig.freelancer?.avatar || "/api/placeholder/40/40",
            level: gig.freelancer?.level || "Level 1",
          },
          orders: gig.orders || 0,
          reviews: gig.reviews || 0,
          createdAt: gig.createdAt,
          lastModified: gig.updatedAt || gig.createdAt,
          flags: gig.flags || 0,
        }));
        setGigsData(transformedGigs);
      }
    } catch (err) {
      setError('Action failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/admin">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Gig Management</h1>
              <p className="text-muted-foreground">
                Review and moderate gigs on the platform
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading gigs...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/admin">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Gig Management</h1>
              <p className="text-muted-foreground">
                Review and moderate gigs on the platform
              </p>
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Gigs</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">Gig Management</h1>
            <p className="text-muted-foreground">
              Review and moderate gigs on the platform
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Gigs
                </p>
                <p className="text-2xl font-bold">{gigsData.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Gigs
                </p>
                <p className="text-2xl font-bold">
                  {gigsData.filter((g) => g.status === "active").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Under Review
                </p>
                <p className="text-2xl font-bold">
                  {gigsData.filter((g) => g.status === "under_review").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Flagged Gigs
                </p>
                <p className="text-2xl font-bold">
                  {gigsData.filter((g) => g.flags > 0).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search gigs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="earnings">By Earnings</SelectItem>
                <SelectItem value="flags">By Flags</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Gigs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Gigs ({filteredGigs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGigs.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Gigs Found</h3>
              <p className="text-muted-foreground">
                {gigsData.length === 0 
                  ? "You haven't posted any gigs yet." 
                  : "No gigs match your current filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGigs.map((gig) => (
                <div
                  key={gig.id}
                  className="flex items-center justify-between p-4 border border-border/40 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Gig Image Placeholder */}
                    <div className="w-16 h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold truncate">{gig.title}</h3>
                        {gig.featured && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            Featured
                          </Badge>
                        )}
                        <Badge className={statusColors[gig.status]}>
                          {gig.status.replace("_", " ")}
                        </Badge>
                        {gig.flags > 0 && (
                          <Badge variant="destructive">
                            <Flag className="w-3 h-3 mr-1" />
                            {gig.flags} flags
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {gig.description}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{gig.category}</span>
                        <span>Created {formatDate(gig.createdAt)}</span>
                        <span>Modified {formatDate(gig.lastModified)}</span>
                      </div>
                    </div>

                    {/* Freelancer Info */}
                    <div className="flex items-center space-x-3 min-w-[200px]">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={gig.freelancer.avatar} />
                        <AvatarFallback>
                          {gig.freelancer.name
                            ? gig.freelancer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {gig.freelancer.name}
                        </p>

                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 text-sm min-w-[160px]">
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium">₹{gig.price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Orders</p>
                        <p className="font-medium">{gig.orders}</p>
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
                        onClick={() => handleGigAction("view", gig.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Gig
                      </DropdownMenuItem>
                      {gig.status === "under_review" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleGigAction("approve", gig.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Approve Gig
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleGigAction("reject", gig.id)}
                          >
                            <X className="mr-2 h-4 w-4 text-red-500" />
                            Reject Gig
                          </DropdownMenuItem>
                        </>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <X className="mr-2 h-4 w-4 text-red-500" />
                            <span className="text-red-500">Delete Gig</span>
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Gig</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{gig.title}"? This
                              action cannot be undone and will permanently remove
                              the gig from the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleGigAction("delete", gig.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete Gig
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gig Details Modal */}
      <Dialog open={showGigDetails} onOpenChange={setShowGigDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedGig && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {selectedGig.title}
                </DialogTitle>
                <DialogDescription>
                  Gig details and information
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Gig Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedGig.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={statusColors[selectedGig.status]}>
                          {selectedGig.status.replace("_", " ")}
                        </Badge>
                        {selectedGig.featured && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            Featured
                          </Badge>
                        )}
                        <Badge variant="outline">{selectedGig.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">₹{selectedGig.price}</p>
                    <p className="text-sm text-muted-foreground">Starting price</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedGig.description}
                  </p>
                </div>

                {/* Freelancer Info */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Freelancer</h4>
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedGig.freelancer.avatar} />
                      <AvatarFallback>
                        {selectedGig.freelancer.name
                          ? selectedGig.freelancer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedGig.freelancer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Level {selectedGig.freelancer.level}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedGig.orders}</p>
                    <p className="text-sm text-muted-foreground">Orders</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-600">{selectedGig.reviews}</p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">₹{selectedGig.price}</p>
                    <p className="text-sm text-muted-foreground">Price</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedGig.flags || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Flags</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Created</h4>
                    <p className="text-muted-foreground">
                      {formatDate(selectedGig.createdAt)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Last Modified</h4>
                    <p className="text-muted-foreground">
                      {formatDate(selectedGig.lastModified)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}