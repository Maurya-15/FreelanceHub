import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  IndianRupee,
  Package,
  Activity,
  Download,
} from "lucide-react";

// Mock analytics data
const revenueData = [
  { month: "Jan", revenue: 125000, commissions: 6250, users: 1250 },
  { month: "Feb", revenue: 145000, commissions: 7250, users: 1420 },
  { month: "Mar", revenue: 165000, commissions: 8250, users: 1680 },
  { month: "Apr", revenue: 185000, commissions: 9250, users: 1950 },
  { month: "May", revenue: 195000, commissions: 9750, users: 2180 },
  { month: "Jun", revenue: 215000, commissions: 10750, users: 2450 },
  { month: "Jul", revenue: 235000, commissions: 11750, users: 2720 },
];

const categoryData = [
  { name: "Design & Creative", value: 35, color: "#8884d8" },
  { name: "Development & IT", value: 28, color: "#82ca9d" },
  { name: "Digital Marketing", value: 18, color: "#ffc658" },
  { name: "Writing & Translation", value: 12, color: "#ff7300" },
  { name: "Others", value: 7, color: "#00ff88" },
];

const userGrowthData = [
  { month: "Jan", freelancers: 850, clients: 400, total: 1250 },
  { month: "Feb", freelancers: 970, clients: 450, total: 1420 },
  { month: "Mar", freelancers: 1120, clients: 560, total: 1680 },
  { month: "Apr", freelancers: 1280, clients: 670, total: 1950 },
  { month: "May", freelancers: 1420, clients: 760, total: 2180 },
  { month: "Jun", freelancers: 1580, clients: 870, total: 2450 },
  { month: "Jul", freelancers: 1750, clients: 970, total: 2720 },
];

const topPerformersData = [
  { name: "Sarah Johnson", earnings: 45650, orders: 89, rating: 4.9 },
  { name: "Mike Chen", earnings: 38900, orders: 67, rating: 4.8 },
  { name: "Alex Rivera", earnings: 32450, orders: 54, rating: 4.7 },
  { name: "Priya Sharma", earnings: 28700, orders: 48, rating: 4.9 },
  { name: "John Davis", earnings: 25300, orders: 42, rating: 4.6 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7days");

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
            <h1 className="text-3xl font-bold">Platform Analytics</h1>
            <p className="text-muted-foreground">
              Deep insights into platform performance
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">₹21.5L</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% vs last month
                </div>
              </div>
                                      <IndianRupee className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Users
                </p>
                <p className="text-2xl font-bold">2,720</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2% vs last month
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </p>
                <p className="text-2xl font-bold">1,456</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15.3% vs last month
                </div>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Commission Earned
                </p>
                <p className="text-2xl font-bold">₹1.08L</p>
                <div className="flex items-center text-sm text-red-600 mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -2.1% vs last month
                </div>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
                  type="category"
                  axisLine={true}
                  tickLine={true}
                />
                <YAxis type="number" axisLine={true} tickLine={true} />
                <Tooltip
                  formatter={(value, name) => [
                    `₹${Number(value).toLocaleString()}`,
                    name === "revenue" ? "Revenue" : "Commission",
                  ]}
                  labelClassName="text-foreground"
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="commissions"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
                  type="category"
                  axisLine={true}
                  tickLine={true}
                />
                <YAxis type="number" axisLine={true} tickLine={true} />
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name === "freelancers"
                      ? "Freelancers"
                      : name === "clients"
                        ? "Clients"
                        : "Total",
                  ]}
                  labelClassName="text-foreground"
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="freelancers"
                  fill="hsl(var(--primary))"
                  name="Freelancers"
                />
                <Bar dataKey="clients" fill="#82ca9d" name="Clients" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Earning Freelancers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformersData.map((performer, index) => (
                <div
                  key={performer.name}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{performer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {performer.orders} orders • ⭐ {performer.rating}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ₹{performer.earnings.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Response Time</span>
              <span className="font-medium">2.3 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Success Rate</span>
              <span className="font-medium text-green-600">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User Satisfaction</span>
              <span className="font-medium">4.7/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Support Tickets</span>
              <span className="font-medium">23 open</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Order Value</span>
              <span className="font-medium">₹2,840</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commission Rate</span>
              <span className="font-medium">5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Failures</span>
              <span className="font-medium text-red-600">2.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Refund Rate</span>
              <span className="font-medium">1.8%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">🇮🇳 India</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">🇺🇸 United States</span>
              <span className="font-medium">15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">🇬🇧 United Kingdom</span>
              <span className="font-medium">8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">🌍 Others</span>
              <span className="font-medium">12%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
