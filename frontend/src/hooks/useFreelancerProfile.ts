import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export interface FreelancerProfile {
  _id: string;
  name: string;
  title?: string;
  avatar?: string;
  coverPhoto?: string;
  location?: string;
  memberSince?: string;
  isOnline?: boolean;
  lastSeen?: string;
  level?: string;
  isProVerified?: boolean;
  stats?: {
    rating?: number;
    totalReviews?: number;
    totalOrders?: number;
    responseTime?: string;
    onTimeDelivery?: number;
    repeatClients?: number;
  };
  overview?: string;
  skills?: string[];
  languages?: { name: string; level: string }[];
  education?: { degree: string; school: string; year: string }[];
  certifications?: { name: string; issuer: string; year: string }[];
  gigs?: any[];
  portfolio?: any[];
  reviews?: any[];
}

export default function useFreelancerProfile(freelancerId: string) {
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/users/${freelancerId}`);
      // Normalize joinDate and lastSeen
      let data = res.data;
      // Support both joinDate and createdAt as 'joinDate' for display
      if (!data.joinDate && data.createdAt) data.joinDate = data.createdAt;
      // Fallback lastSeen: if not present, use updatedAt or similar
      if (!data.lastSeen && data.updatedAt) data.lastSeen = data.updatedAt;
      setProfile(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [freelancerId]);

  useEffect(() => {
    if (!freelancerId) return;
    fetchProfile();
    const interval = setInterval(fetchProfile, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [freelancerId, fetchProfile]);

  return { profile, loading, error };
}
