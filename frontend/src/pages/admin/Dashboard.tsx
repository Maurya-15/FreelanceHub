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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your FreelanceHub platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            System Online
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          // Show loading skeleton or fallback
          [0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">&nbsp;</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-green-600" />
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
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">{stat.trend}</span>
                    <span>{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : null}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-center justify-between p-4 border border-border/40 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${
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
                      <span className="font-medium">
                        {activity.user?.name || 'System'}
                      </span>
                      <span>{activity.message}</span>
                    </div>
                    <div className="flex items-center gap-4">
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
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Manage Users
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Briefcase className="h-6 w-6" />
              Review Gigs
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ShoppingBag className="h-6 w-6" />
              View Orders
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CreditCard className="h-6 w-6" />
              Payment Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
