import { useEffect, useState } from "react";
import axios from "axios";

export interface DashboardStats {
  activeProjects: number;
  totalSpent: number;
  completedProjects: number;
  avgRating: number;
  totalSavings: number;
  activeJobs: number;
}

export interface Order {
  id: string;
  title: string;
  freelancer: string;
  freelancerAvatar: string;
  service: string;
  amount: number;
  status: string;
  deadline: string;
  progress: number;
  lastUpdate: string;
}

// For backward compatibility
export type ActiveOrder = Order;

export interface PostedJob {
  id: string;
  title: string;
  description: string;
  budget: string;
  postedDate: string;
  proposals: number;
  status: string;
  category: string;
  deadline: string;
}

export interface RecentMessage {
  id: string;
  freelancer: string;
  avatar: string;
  message: string;
  time: string;
  unread: boolean;
  project: string;
}

export interface ClientDashboardData {
  stats: DashboardStats;
  orders: Order[]; // All orders, not just active
  activeOrders?: ActiveOrder[]; // Optional, for backward compatibility
  postedJobs: PostedJob[];
  recentMessages: RecentMessage[];
}

export default function useClientDashboard(userId: string) {
  const [data, setData] = useState<ClientDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/client/dashboard/${userId}`);
        setData(res.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchDashboard();
  }, [userId]);

  return { data, loading, error };
}
