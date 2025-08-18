import React, { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";

// Helper to get relative time (e.g., '2 minutes ago')
function getRelativeTime(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // in seconds
  if (diff < 60) return `${diff} second${diff !== 1 ? 's' : ''} ago`;
  if (diff < 3600) {
    const min = Math.floor(diff / 60);
    return `${min} minute${min !== 1 ? 's' : ''} ago`;
  }
  if (diff < 86400) {
    const hr = Math.floor(diff / 3600);
    return `${hr} hour${hr !== 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(diff / 86400);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

// Helper to get status color
function getStatusColor(status?: string) {
  switch (status) {
    case 'success': return { dot: '#22c55e', badge: 'bg-purple-600 text-white' };
    case 'pending': return { dot: '#3b82f6', badge: 'bg-orange-600 text-white' };
    case 'warning': return { dot: '#eab308', badge: 'bg-red-900 text-white' };
    case 'error': return { dot: '#ef4444', badge: 'bg-red-700 text-white' };
    default: return { dot: '#a1a1aa', badge: 'bg-gray-700 text-white' };
  }
}

type Activity = {
  _id: string;
  type: string;
  description?: string;
  message?: string;
  createdAt: string;
  status?: string;
  user?: {
    name?: string;
    role?: string;
  };
  meta?: Record<string, any>;
};

const RecentActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(getApiUrl("/api/recent-activities"))
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch activities");
        return res.json();
      })
      .then((data) => {
        setActivities(data.activities || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading recent activity...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (activities.length === 0) return <div>No recent activity.</div>;

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const statusColor = getStatusColor(activity.status);
        return (
          <div
            key={activity._id}
            className="flex items-center justify-between p-4 border border-border/40 rounded-lg bg-card dark:bg-[#18181b]"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: statusColor.dot, display: 'inline-block' }}
              ></span>
              <div>
                <div className="font-semibold text-base">
                  {activity.message || activity.description || activity.type}
                </div>
                {/* User name and role */}
                {activity.user?.name && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {activity.user.name}
                    {activity.user.role ? ` (${activity.user.role})` : ''}
                  </div>
                )}
                {/* Extra meta details */}
                {activity.meta && Object.keys(activity.meta).length > 0 && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {Object.entries(activity.meta).map(([key, value]) => (
                      <span key={key} style={{ marginRight: 8 }}>
                        <b>{key}:</b> {String(value)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 min-w-[90px]">
              <span className="text-xs text-muted-foreground">
                {getRelativeTime(activity.createdAt)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor.badge}`}
                style={{ minWidth: 60, textAlign: 'center' }}
              >
                {activity.status || 'info'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentActivityFeed; 