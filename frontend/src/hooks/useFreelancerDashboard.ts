import { useEffect, useState } from "react";
import axios from "axios";

export interface FreelancerDashboardStats {
  totalEarnings: number;
  activeGigs: number;
  totalOrders: number;
  totalGigs: number;
  avgRating: number;
  profileViews: number;
  responseTime: string;
  name: string;
}

export interface RecentOrder {
  id: string;
  title: string;
  client: string;
  amount: number;
  status: string;
  deadline: string;
  avatar: string;
}

export interface TopGig {
  id: string;
  title: string;
  image: string;
  price: number;
  orders: number;
  rating: number;
  reviews: number;
  impressions: number;
}

export interface FreelancerDashboardData {
  stats: FreelancerDashboardStats;
  recentOrders: RecentOrder[];
  topGigs: TopGig[];
}

export default function useFreelancerDashboard(userId: string) {
  const [data, setData] = useState<FreelancerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchDashboard() {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/freelancer/dashboard/${userId}`);
        setData(res.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      fetchDashboard();
      // Poll every 15 seconds for real-time updates
      interval = setInterval(fetchDashboard, 15000);
    }
    return () => clearInterval(interval);
  }, [userId]);

  return { data, loading, error };
}
