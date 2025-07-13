import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Eye,
  MousePointer,
  Users,
  DollarSign,
  RefreshCw,
  MapPin,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

// Mock analytics data
const gigPerformanceData = [
  {
    name: "Logo Design Gig",
    views: 1234,
    clicks: 156,
    conversions: 12,
    revenue: 3600,
  },
  {
    name: "Brand Identity",
    views: 890,
    clicks: 98,
    conversions: 8,
    revenue: 6800,
  },
  {
    name: "Business Cards",
    views: 567,
    clicks: 67,
    conversions: 15,
    revenue: 1875,
  },
  {
    name: "Social Media Kit",
    views: 445,
    clicks: 52,
    conversions: 6,
    revenue: 2700,
  },
];

const revenueData = [
  { month: "Jul", revenue: 2400, orders: 8 },
  { month: "Aug", revenue: 3200, orders: 12 },
  { month: "Sep", revenue: 2800, orders: 10 },
  { month: "Oct", revenue: 4100, orders: 15 },
  { month: "Nov", revenue: 3600, orders: 13 },
  { month: "Dec", revenue: 4800, orders: 18 },
  { month: "Jan", revenue: 5200, orders: 21 },
];

const countryData = [
  { name: "United States", value: 45, color: "#8B5CF6" },
  { name: "Canada", value: 18, color: "#3B82F6" },
  { name: "United Kingdom", value: 15, color: "#F97316" },
  { name: "Australia", value: 12, color: "#10B981" },
  { name: "Germany", value: 10, color: "#F59E0B" },
];

const activityData = [
  { hour: "00", activity: 5 },
  { hour: "04", activity: 8 },
  { hour: "08", activity: 25 },
  { hour: "12", activity: 45 },
  { hour: "16", activity: 35 },
  { hour: "20", activity: 20 },
];

interface AnalyticsDashboardProps {
  userType: "freelancer" | "client";
  userId: string;
}

export function AnalyticsDashboard({
  userType,
  userId,
}: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const metrics = [
    {
      title: "Total Views",
      value: "3,456",
      change: "+12.3%",
      icon: <Eye className="w-5 h-5" />,
      color: "text-blue-600",
      trend: "up",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.8%",
      icon: <MousePointer className="w-5 h-5" />,
      color: "text-green-600",
      trend: "up",
    },
    {
      title: "Repeat Clients",
      value: "68%",
      change: "+5.2%",
      icon: <Users className="w-5 h-5" />,
      color: "text-purple-600",
      trend: "up",
    },
    {
      title: "Avg. Order Value",
      value: "₹285",
      change: "-2.1%",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-orange-600",
      trend: "down",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your {userType === "freelancer" ? "gig" : "hiring"}{" "}
            performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-muted/50 ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp
                  className={`w-4 h-4 mr-1 ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.change}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  vs last period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gigs">Gig Performance</TabsTrigger>
          <TabsTrigger value="clients">Client Analytics</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      type="category"
                      axisLine={true}
                      tickLine={true}
                    />
                    <YAxis type="number" axisLine={true} tickLine={true} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Orders Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      type="category"
                      axisLine={true}
                      tickLine={true}
                    />
                    <YAxis type="number" axisLine={true} tickLine={true} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Activity Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    type="category"
                    axisLine={true}
                    tickLine={true}
                  />
                  <YAxis type="number" axisLine={true} tickLine={true} />
                  <Tooltip />
                  <Bar dataKey="activity" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gig Performance Tab */}
        <TabsContent value="gigs">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Gig Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gigPerformanceData.map((gig, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border/40 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">{gig.name}</h4>
                      <Badge variant="outline">${gig.revenue}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Views</p>
                        <p className="font-medium">
                          {gig.views.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicks</p>
                        <p className="font-medium">{gig.clicks}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversion Rate</p>
                        <p className="font-medium">
                          {((gig.conversions / gig.clicks) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-brand-gradient h-2 rounded-full"
                          style={{
                            width: `${(gig.clicks / gig.views) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click-through rate:{" "}
                        {((gig.clicks / gig.views) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Client Analytics Tab */}
        <TabsContent value="clients">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Client Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      New Clients
                    </span>
                    <span className="font-medium">32%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "32%" }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Repeat Clients
                    </span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "68%" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Client Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    4.9
                  </div>
                  <p className="text-muted-foreground mb-4">Average Rating</p>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center space-x-2">
                        <span className="text-sm w-8">{star}★</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{
                              width: `${star === 5 ? 75 : star === 4 ? 20 : 5}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">
                          {star === 5 ? "75%" : star === 4 ? "20%" : "5%"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Geography Tab */}
        <TabsContent value="geography">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {countryData.map((country, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: country.color }}
                        />
                        <span className="font-medium">{country.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${country.value}%`,
                              backgroundColor: country.color,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">
                          {country.value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={countryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {countryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
