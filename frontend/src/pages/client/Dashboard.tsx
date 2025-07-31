import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Briefcase,
  Heart,
} from "lucide-react";

import { PersonalizedDashboard } from "@/components/dashboard/PersonalizedDashboard";
import { Chatbot } from "@/components/chatbot/Chatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useClientDashboard from "@/hooks/useClientDashboard";
// Remove all mock data. Use the hook for real data.


const getStatusColor = (status: string) => {
  switch (status) {
    case "in_progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "in_review":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "completed":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "in_progress":
      return <Clock className="w-3 h-3 mr-1" />;
    case "in_review":
      return <Eye className="w-3 h-3 mr-1" />;
    case "delivered":
      return <CheckCircle className="w-3 h-3 mr-1" />;
    case "active":
      return <CheckCircle className="w-3 h-3 mr-1" />;
    case "completed":
      return <CheckCircle className="w-3 h-3 mr-1" />;
    default:
      return null;
  }
};

import { useAuth } from '../../contexts/AuthContext';

function formatBudget(budget: any) {
  if (!budget) return 'N/A';
  if (typeof budget === 'string' || typeof budget === 'number') return budget;
  const min = typeof budget.min === 'number' ? budget.min : Number(budget.min);
  const max = typeof budget.max === 'number' ? budget.max : Number(budget.max);
  if (isNaN(min) || isNaN(max)) return 'N/A';
  if (budget.type === 'fixed') {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  } else if (budget.type === 'hourly') {
    return `₹${min} - ₹${max}/hr`;
  }
  return `₹${min} - ₹${max}`;
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const { data, loading, error } = useClientDashboard(userId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading dashboard...</span>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        <span>{error || 'Failed to load dashboard data.'}</span>
      </div>
    );
  }

  const { userName, stats, orders, postedJobs, recentMessages } = data;

  return (
    <div className="flex-1">
      <main className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Welcome back, {userName || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your projects and hiring activity.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" asChild>
              <Link to="/messages">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/client/post-job">
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold">{stats.activeProjects}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">2 new this week</span>
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
                     ₹{stats.totalSpent.toLocaleString('en-IN')}
                   </p>
                </div>
                                 <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                   <IndianRupee className="h-6 w-6 text-green-600" />
                 </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                                 <IndianRupee className="h-4 w-4 text-blue-500 mr-1" />
                                 <span className="text-blue-600">
                   Saved ₹{stats.totalSavings.toLocaleString('en-IN')}
                 </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed Projects
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.completedProjects}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-yellow-600">
                  {stats.avgRating} avg rating
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Job Posts
                  </p>
                  <p className="text-2xl font-bold">{stats.activeJobs}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <MessageSquare className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-orange-600">35 new proposals</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="jobs">Posted Jobs</TabsTrigger>
            <TabsTrigger value="messages">Recent Messages</TabsTrigger>
          </TabsList>

          {/* Active Orders Tab */}
          <TabsContent value="orders">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Orders
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/client/orders">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(orders || []).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={order.freelancerAvatar} />
                          <AvatarFallback>
                            {order.freelancer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{order.title || "Untitled Order"}</h4>
                          <p className="text-sm text-muted-foreground">
                            by {order.freelancer}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.service}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-right">
                        <div>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            {order.status.replace("_", " ")}
                          </Badge>

                        </div>
                        <div>
                          <p className="font-semibold">₹{(order.amount || 0).toLocaleString('en-IN')}</p>
                          {order.deadline && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.deadline).toLocaleDateString('en-IN')}
                            </p>
                          )}
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

          {/* Posted Jobs Tab */}
          <TabsContent value="jobs">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Posted Jobs
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/client/post-job">
                      Post New Job
                      <Plus className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {postedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium">{job.title}</h4>
                            <Badge className={getStatusColor(job.status)}>
                              {job.status}
                            </Badge>
                            <Badge variant="outline">{job.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {job.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Budget: {formatBudget(job.budget)}</span>
                            <span>•</span>
                            <span>
                              Posted{" "}
                              {new Date(job.postedDate).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>
                                Duration: {job.duration ?? "N/A"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary">
                            {job.proposals}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            proposals
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/job/${job.id}`}>View Details</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/job/${job.id}/proposals`}>
                            View Proposals ({job.proposals})
                          </Link>
                        </Button>
                        {job.status === "active" && (
                          <Button variant="outline" size="sm">
                            Edit Job
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Messages Tab */}
          <TabsContent value="messages">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Messages
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/messages">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors ${
                        message.unread ? "bg-primary/5" : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback>
                          {message.freelancer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">
                              {message.freelancer}
                            </h4>
                            {message.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {message.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {message.project}
                        </p>
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          to={`/messages/${message.freelancer.replace(" ", "-").toLowerCase()}`}
                        >
                          Reply
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI-Powered Insights (moved below tabs) */}
        <PersonalizedDashboard userType="client" userId="USER-002" />
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
