import { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';

export interface ClientProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  company?: string;
  location?: string;
  timezone?: string;
  memberSince?: string;
  verified?: boolean;
  bio?: string;
  website?: string;
  linkedin?: string;
  stats?: {
    totalJobsPosted?: number;
    totalSpent?: number;
    avgRating?: number;
    totalReviews?: number;
    activeProjects?: number;
    completedProjects?: number;
    responseRate?: number;
    responseTime?: string;
  };
  preferences?: {
    budgetRange?: string;
    preferredCategories?: string[];
    workingHours?: string;
    communicationStyle?: string;
    projectTypes?: string[];
  };
  recentProjects?: any[];
  reviews?: any[];
}

export default function useClientProfile(userId: string | undefined) {
  const [data, setData] = useState<ClientProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    // Fetch both user and dashboard data in parallel
    Promise.all([
      axios.get(getApiUrl(`/api/users/${userId}`)),
      axios.get(getApiUrl(`/api/client/dashboard/${userId}`))
    ])
      .then(([userRes, dashboardRes]) => {
        const user = userRes.data;
        const dashboard = dashboardRes.data;
        // Merge data for the profile page
        setData({
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          title: user.title,
          company: user.company,
          location: user.location,
          timezone: user.timezone,
          memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : (user.joinDate ? new Date(user.joinDate).toLocaleDateString() : undefined),
          verified: user.verified,
          bio: user.bio,
          website: user.website,
          linkedin: user.linkedin,
          stats: dashboard.stats || {},
          preferences: user.preferences || {},
          recentProjects: dashboard.postedJobs || [],
          reviews: user.reviews || [],
        });
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch profile');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading, error };
}
