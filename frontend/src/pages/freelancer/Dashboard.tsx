import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PersonalizedDashboard } from "@/components/dashboard/PersonalizedDashboard";
import { Chatbot } from "@/components/chatbot/Chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  Package,
  MessageSquare,
  Star,
  Eye,
  Clock,
  Plus,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  AlertCircle,
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
  const freelancerId = user?._id;
  // Note: Make sure backend returns 'name' and 'totalGigs' in stats for full effect.
  // DEBUG: Log auth and user state
  console.log('authLoading:', authLoading, 'user:', user, 'freelancerId:', freelancerId);
  const { data, loading, error } = useFreelancerDashboard(freelancerId || "");
  if (authLoading || !freelancerId) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {data?.stats?.name || user?.name || "Freelancer"}!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your freelance business today.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" asChild>
              <Link to="/messages">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Link>
            </Button>
            <GradientButton asChild>
              <Link to="/freelancer/create-gig">
                <Plus className="w-4 h-4 mr-2" />
                Create New Gig
              </Link>
            </GradientButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? "--" : data?.stats?.totalEarnings?.toLocaleString("en-IN", { style: "currency", currency: "INR" }) ?? 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Your Gigs
                  </p>
                  <p className="text-2xl font-bold">{loading ? "--" : (data?.stats?.totalGigs ?? data?.topGigs?.length ?? 0)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Eye className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-blue-600">
                  {loading ? "--" : data?.stats?.profileViews ?? 0} profile views
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold">{loading ? "--" : data?.stats?.totalOrders ?? 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Clock className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-purple-600">
                  {loading ? "--" : data?.stats?.responseTime ?? "-"} avg response
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Rating
                  </p>
                  <p className="text-2xl font-bold">{loading ? "--" : data?.stats?.avgRating ?? 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-yellow-600">From {loading ? "--" : (data?.topGigs?.reduce((sum, gig) => sum + (gig.reviews || 0), 0) ?? 0)} reviews</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="gigs">Top Gigs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Recent Orders Tab */}
          <TabsContent value="orders">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Orders
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/orders">
                      View All
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(data?.recentOrders ?? []).map((order) => (
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
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          {order.status.replace("_", " ")}
                        </Badge>
                        <div className="text-right">
                          <p className="font-semibold">${order.amount}</p>
                          <p className="text-xs text-muted-foreground">
                            Due {new Date(order.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/order/${order.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Gigs Tab */}
          <TabsContent value="gigs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(data?.topGigs ?? []).map((gig) => (
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
                        <span className="text-lg font-bold">${gig.price}</span>
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
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </TabsContent>
        </Tabs>

        {/* AI-Powered Insights */}
        <PersonalizedDashboard userType="freelancer" userId="USER-001" />
      </main>

      {/* Chatbot */}
      <Chatbot />

      <Footer />
    </div>
    
  );
}
