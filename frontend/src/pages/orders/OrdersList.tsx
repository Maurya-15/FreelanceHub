import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  IndianRupee,
  Clock,
  Star,
  MessageSquare,
  Eye,
  Package,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const statusConfig = {
  pending: {
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    icon: Clock,
  },
  in_progress: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    icon: RefreshCw,
  },
  delivered: {
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    icon: Package,
  },
  completed: {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    icon: CheckCircle,
  },
  cancelled: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    icon: AlertCircle,
  },
};

export default function OrdersList() {
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [activeMessageOrder, setActiveMessageOrder] = useState<any>(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Orders fetching state
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/orders', {
      headers: { 'user-id': localStorage.getItem('userId') || '' },
    })
      .then(res => res.json())
      .then(data => {
        const userId = localStorage.getItem('userId');
        const myOrders = (data.orders || []).filter(
          (order: any) =>
            order.client?._id === userId || order.freelancer?._id === userId
        );
        setOrders(myOrders);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load orders');
        setLoading(false);
      });
  }, []);

  // Get current user role for determining back navigation
  const currentUserRole = localStorage.getItem("userRole") || "client";

  const filteredOrders = orders.filter((order) => {
    const title = order?.title || order?.gig?.title || '';
    const freelancerName = order?.freelancer?.name || '';
    const clientName = order?.client?.name || '';
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const getDaysRemaining = (deadline: string) => {
    if (!deadline) return null;
    try {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) return null;
      const diffTime = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      return null;
    }
  };

  const getBackRoute = () => {
    switch (currentUserRole) {
      case "freelancer":
        return "/freelancer/dashboard";
      case "admin":
        return "/admin";
      default:
        return "/client/dashboard";
    }
  };

  return (
    <div className="flex-1"> {/* This div will be the main content area within LayoutClient/LayoutFreelancer */}
      <main className="p-6"> {/* Adjusted padding for content within the layout */}
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to={getBackRoute()}>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Orders</h1>
              <p className="text-muted-foreground">
                View and manage all your orders
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold">{orders.length}</p>
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
                    In Progress
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      orders.filter((o) => o.status === "in_progress")
                        .length
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
                    {orders.filter((o) => o.status === "completed").length}
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
                    Total Value
                  </p>
                  <p className="text-2xl font-bold">
                    ₹
                    {orders
                      .reduce((sum, order) => sum + (order.amount || 0), 0)
                      .toLocaleString('en-IN')}
                  </p>
                </div>
                                        <IndianRupee className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">All Status</SelectItem>
                <SelectItem key="pending" value="pending">Pending</SelectItem>
                <SelectItem key="in_progress" value="in_progress">In Progress</SelectItem>
                <SelectItem key="delivered" value="delivered">Delivered</SelectItem>
                <SelectItem key="completed" value="completed">Completed</SelectItem>
                <SelectItem key="cancelled" value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="recent" value="recent">Most Recent</SelectItem>
                <SelectItem key="deadline" value="deadline">By Deadline</SelectItem>
                <SelectItem key="amount" value="amount">By Amount</SelectItem>
                <SelectItem key="status" value="status">By Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            filteredOrders.map((order, index) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;
              const statusColor = statusConfig[order.status as keyof typeof statusConfig]?.color || "bg-gray-100 text-gray-800";
              const daysRemaining = order.deadline ? getDaysRemaining(order.deadline) : null;

              return (
                <Card
                  key={order.id || order._id || `order-${index}`}
                  className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer"
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={order.freelancer?.avatar || order.client?.avatar} />
                            <AvatarFallback className="bg-brand-gradient text-white">
                              {(order.freelancer?.name || order.client?.name || "U").charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {order.title || "Untitled Order"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {order.freelancer?.name || order.client?.name || "Unknown User"}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <IndianRupee className="w-4 h-4 text-green-500" />
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="font-medium">
                              ₹{(order.amount ?? 0).toLocaleString('en-IN')}
                            </span>
                          </div>

                          {order.status === "in_progress" &&
                            order.deadline && daysRemaining !== null && (
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span className="text-muted-foreground">
                                  Deadline:
                                </span>
                                <span
                                  className={`font-medium ${daysRemaining < 3 ? "text-red-600" : ""}`}
                                >
                                  {daysRemaining > 0
                                    ? `${daysRemaining} days`
                                    : "Overdue"}
                                </span>
                              </div>
                            )}

                          {order.status === "completed" && order.rating && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-muted-foreground">
                                Rating:
                              </span>
                              <span className="font-medium">
                                {order.rating}/5
                              </span>
                            </div>
                          )}

                          {order.progress && (
                            <div className="flex items-center space-x-2">
                              <RefreshCw className="w-4 h-4 text-purple-500" />
                              <span className="text-muted-foreground">
                                Progress:
                              </span>
                              <span className="font-medium">
                                {order.progress}%
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Progress bar for active orders */}
                        {order.status === "in_progress" && order.progress && (
                          <div className="mt-3">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${order.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem key="view-details" asChild>
                            <Link to={`/order/${order._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem key="message" onClick={(e) => { e.stopPropagation(); setActiveMessageOrder(order); setShowMessageDialog(true); }}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You don't have any orders yet"}
              </p>
              <Button variant="outline" asChild>
                <Link to="/browse">Browse Services</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
