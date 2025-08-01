import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { io } from 'socket.io-client';

export default function AdminDashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);





  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/activities');
        const data = await res.json();
        if (data.success) setActivities(data.activities);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) setStats(data);
      } catch (err) {
        // handle error
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "pending":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };



  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Monitor and manage your FreelanceHub platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            System Online
          </Badge>
        </div>
      </div>

      {/* Stats Grid - 2x2 on mobile/tablet, 1x4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statsLoading ? (
          // Show loading skeleton or fallback
          [0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">&nbsp;</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold animate-pulse bg-gray-200 h-6 sm:h-8 w-12 sm:w-16 rounded"></div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2 sm:mt-3">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span className="text-green-600">--</span>
                  <span>&nbsp;</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : stats ? (
          [
            {
              title: "Total Users",
              value: stats.totalUsers,
              icon: Users,
              trend: "+12.5%",
              description: "Active users this month",
            },
            {
              title: "Active Gigs",
              value: stats.activeGigs,
              icon: Briefcase,
              trend: "+8.3%",
              description: "Live gigs on platform",
            },
            {
              title: "Total Orders",
              value: stats.totalOrders,
              icon: ShoppingBag,
              trend: "+15.2%",
              description: "Orders completed",
            },
            {
              title: "Jobs",
              value: stats.totalJobs,
              icon: Briefcase,
              trend: "+10.1%",
              description: "Jobs posted on platform",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2 sm:mt-3">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    <span className="text-green-600">{stat.trend}</span>
                    <span className="hidden sm:inline">{stat.description}</span>
                    <span className="sm:hidden">{stat.description.split(' ')[0]}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : null}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 lg:gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-border/40 rounded-lg gap-2 sm:gap-3"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                        activity.status === 'success'
                          ? 'bg-green-500'
                          : activity.status === 'pending'
                          ? 'bg-blue-500'
                          : activity.status === 'warning'
                          ? 'bg-yellow-400'
                          : activity.status === 'error'
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                      }`}></span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 flex-1">
                        <span className="font-medium text-sm sm:text-base truncate">
                          {activity.user?.name || 'System'}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground truncate">
                          {activity.message}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="h-16 sm:h-20 flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
              <Users className="h-4 w-4 sm:h-6 sm:w-6" />
              Manage Users
            </Button>
            <Button variant="outline" className="h-16 sm:h-20 flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
              <Briefcase className="h-4 w-4 sm:h-6 sm:w-6" />
              Review Gigs
            </Button>
            <Button variant="outline" className="h-16 sm:h-20 flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
              <ShoppingBag className="h-4 w-4 sm:h-6 sm:w-6" />
              View Orders
            </Button>
            <Button variant="outline" className="h-16 sm:h-20 flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
              <CreditCard className="h-4 w-4 sm:h-6 sm:w-6" />
              Payment Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
