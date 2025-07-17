import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
  DollarSign,
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
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
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
                      .reduce((sum, order) => sum + order.totalAmount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
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
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
                  <SelectItem value="amount">By Amount</SelectItem>
                  <SelectItem value="status">By Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status]?.icon || Clock;
            const daysRemaining =
              order.status === "in_progress"
                ? getDaysRemaining(order.deadline)
                : null;

            return (
              <Card
                key={order.id}
                className="border-0 bg-card/50 backdrop-blur-sm floating-card cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={() => navigate(`/order/${order._id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Job Image */}
                    <div className="w-20 h-15 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex-shrink-0" />

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1 truncate">
                            {order.gig?.title || 'Untitled Job'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Order #{order._id}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={statusConfig[order.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {order.status.replace("_", " ")}
                          </Badge>
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
                              <DropdownMenuItem asChild>
                                <Link to={`/order/${order._id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setActiveMessageOrder(order); setShowMessageDialog(true); }}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* People involved */}
                      <div className="flex items-center space-x-6 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            Freelancer:
                          </span>
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={order.freelancer.avatar} />
                            <AvatarFallback>
                              {order.freelancer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {order.freelancer.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {order.freelancer.level}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            Client:
                          </span>
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={order.client.avatar} />
                            <AvatarFallback>
                              {order.client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {order.client.name}
                          </span>
                        </div>
                      </div>

                      {/* Order details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">
                            ₹{order.amount ?? 0}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="text-muted-foreground">
                            Created:
                          </span>
                          <span className="font-medium">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>

                        {order.status === "in_progress" &&
                          daysRemaining !== null && (
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
                  </div>
                </CardContent>
              </Card>
            );
          })}
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

      <Footer />
    </div>
  );
}
