import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_ENDPOINTS, getApiUrl } from "@/lib/api";
import {
  TrendingUp,
  IndianRupee,
  Users,
  Star,
  Eye,
  MessageSquare,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import useFreelancerDashboard from "@/hooks/useFreelancerDashboard";



const getStatusColor = (status: string) => {
  switch (status) {
    case "in_progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "revision":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "in_progress":
      return <Clock className="w-3 h-3 mr-1" />;
    case "delivered":
      return <CheckCircle className="w-3 h-3 mr-1" />;
    case "revision":
      return <AlertCircle className="w-3 h-3 mr-1" />;
    default:
      return null;
  }
};

import { useAuth } from "@/contexts/AuthContext";

export default function FreelancerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const freelancerId = user?.id;
  
  // Debug: Log authentication state
  console.log('Dashboard - Auth State:', { user, authLoading, freelancerId });
  console.log('localStorage authToken:', localStorage.getItem('authToken'));
  console.log('localStorage userData:', localStorage.getItem('userData'));
  
  const { data, loading, error } = useFreelancerDashboard(freelancerId || "");
  
  // Show loading only if auth is still loading
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
  }
  
  // Check if user is logged in via localStorage as fallback
  const storedUser = localStorage.getItem('userData');
  const storedToken = localStorage.getItem('authToken');
  
  if (!user && storedUser && storedToken) {
    try {
      const parsedUser = JSON.parse(storedUser);
      console.log('Dashboard: Found stored user, using it:', parsedUser);
      // Force a page reload to update the auth context
      window.location.reload();
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    } catch (error) {
      console.error('Error parsing stored user:', error);
    }
  }
  
  // Show error if no user or no freelancerId
  if (!user || !freelancerId) {
    console.log('Dashboard: No user or freelancerId found. User:', user, 'FreelancerId:', freelancerId);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to access your dashboard.</p>
          <Button asChild>
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }
  // Show error if API call failed
  if (error) {
    return (
      <div className="flex-1">
        <main className="p-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Dashboard Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <main className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {data?.stats?.name || user?.name || "Freelancer"}!</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Here's what's happening with your freelance business today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-0">
            <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
              <Link to="/messages">
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Messages
              </Link>
            </Button>
            <Button asChild size="sm" className="text-xs sm:text-sm">
              <Link to="/freelancer/create-gig">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Create New Gig
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards - 2x2 on mobile/tablet, 1x4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total Earnings
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {loading ? "--" : data?.stats?.totalEarnings?.toLocaleString("en-IN", { style: "currency", currency: "INR" }) ?? 0}
                  </p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 sm:mt-4 text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Your Gigs
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">{loading ? "--" : (data?.stats?.totalGigs ?? data?.stats?.activeGigs ?? 0)}</p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 sm:mt-4 text-xs sm:text-sm">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-1" />
                <span className="text-blue-600">
                  {loading ? "--" : data?.stats?.profileViews ?? 0} profile views
                </span>
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
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">{loading ? "--" : data?.stats?.totalOrders ?? 0}</p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 sm:mt-4 text-xs sm:text-sm">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 mr-1" />
                <span className="text-purple-600">
                  {loading ? "--" : data?.stats?.responseTime ?? "-"} avg response
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Rating
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">{loading ? "--" : data?.stats?.avgRating ?? 0}</p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 sm:mt-4 text-xs sm:text-sm">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 mr-1" />
                <span className="text-yellow-600">From {loading ? "--" : (data?.topGigs?.reduce((sum, gig) => sum + (gig.reviews || 0), 0) ?? 0)} reviews</span>
              </div>
            </CardContent>
          </Card>
        </div>

                 {/* Main Content Tabs */}
         <div className="space-y-4 sm:space-y-6">
           <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
             <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
               <Link to="/freelancer/orders">
                 Recent Orders
               </Link>
             </Button>
             <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
               <Link to="/freelancer/gigs">
                 Top Gigs
               </Link>
             </Button>
             <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
               <Link to="/freelancer/analytics">
                 Analytics
               </Link>
             </Button>
           </div>

          {/* Recent Orders Tab */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-base sm:text-lg">
                <span>Recent Orders</span>
                <Button variant="outline" size="sm" asChild className="w-full sm:w-auto text-xs sm:text-sm">
                  <Link to="/freelancer/orders">
                    View All
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
                              <div className="space-y-4">
                {(data?.recentOrders ?? []).length > 0 ? (
                  (data?.recentOrders ?? []).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={order.avatar} />
                          <AvatarFallback>
                            {order.client
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{order.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.client}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">₹{order.amount}</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/order/${order.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">
                      When you receive orders, they'll appear here
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/freelancer/create-gig">
                        Create Your First Gig
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              </CardContent>
            </Card>

          {/* Top Gigs Tab */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Top Gigs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(data?.topGigs ?? []).length > 0 ? (
                  (data?.topGigs ?? []).map((gig) => (
                <Card
                  key={gig.id}
                  className="border-0 bg-card/50 backdrop-blur-sm floating-card"
                >
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-t-lg"></div>
                    <div className="p-6">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {gig.title}
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {gig.rating}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({gig.reviews})
                          </span>
                        </div>
                        <span className="text-lg font-bold">₹{gig.price}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <span className="block">Orders</span>
                          <span className="font-medium text-foreground">
                            {gig.orders}
                          </span>
                        </div>
                        <div>
                          <span className="block">Impressions</span>
                          <span className="font-medium text-foreground">
                            {gig.impressions}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link to={`/gig/${gig.id}/edit`}>Edit</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link to={`/gigs/detail/${gig.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No gigs yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first gig to start earning
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/freelancer/create-gig">
                      Create Your First Gig
                    </Link>
                  </Button>
                </div>
              )}
            </div>
            </CardContent>
          </Card>

          {/* Analytics Tab */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold">₹2,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Month</span>
                  <span className="font-semibold">₹2,180</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Avg per Gig</span>
                  <span className="font-semibold">₹285</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Response Rate
                  </span>
                  <span className="font-semibold text-green-600">100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    On-time Delivery
                  </span>
                  <span className="font-semibold text-green-600">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Repeat Clients
                  </span>
                  <span className="font-semibold">65%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Profile Rank
                  </span>
                  <Badge className="bg-brand-gradient text-white">
                    Top Rated
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

                  {/* AI-Powered Insights */}
        </main>
      </div>
    
  );
}
