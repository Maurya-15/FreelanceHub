import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import usePostedJobsSocket from "@/hooks/usePostedJobsSocket";
import {
  ArrowLeft,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  IndianRupee,
  MapPin,
  Star,
  Clock,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Pause,
  Play,
} from "lucide-react";

const PostedJobs: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Not logged in.');
        setJobs([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/jobs/client/${userId}`, {
          headers: {
            'user-id': `userId-clientId-${userId}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message || 'Failed to fetch jobs.');
          setJobs([]);
        } else {
          setJobs(data.jobs);
          console.log('Fetched jobs:', data.jobs);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch jobs.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // Real-time proposal update for jobs
  usePostedJobsSocket(user?.id, (proposal) => {
    setJobs((prevJobs) => prevJobs.map(job => {
      if (job._id === proposal.jobId) {
        // If proposals is an array, push; if number, increment
        if (Array.isArray(job.proposals)) {
          return { ...job, proposals: [proposal, ...job.proposals] };
        } else if (typeof job.proposals === 'number') {
          return { ...job, proposals: job.proposals + 1 };
        } else {
          return { ...job, proposals: [proposal] };
        }
      }
      return job;
    }));
  });


  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "paused":
        return <Pause className="w-3 h-3 mr-1" />;
      case "completed":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "draft":
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return <AlertCircle className="w-3 h-3 mr-1" />;
    }
  };

  const formatBudget = (budget: { min?: any; max?: any; type?: string }) => {
    if (!budget) return 'N/A';
    const min = typeof budget.min === 'number' ? budget.min : Number(budget.min);
    const max = typeof budget.max === 'number' ? budget.max : Number(budget.max);
    if (isNaN(min) || isNaN(max)) return 'N/A';
    if (budget.type === 'fixed') {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    } else {
      return `$${min} - $${max}/hr`;
    }
  };

  const getTimeAgo = (date: string) => {
    if (!date) return 'Unknown date';
    const jobDate = new Date(date);
    if (isNaN(jobDate.getTime())) return 'Unknown date';
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - jobDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const filteredJobs =
    selectedStatus === "all"
      ? jobs
      : jobs.filter((job) => job.status === selectedStatus);

  const handleDeleteJob = (jobId: string) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
  };

  const handleToggleStatus = (jobId: string, newStatus: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job,
      ),
    );
  };

  if (loading) return <div className="text-center py-12">Loading posted jobs...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  if (!jobs.length) return <div className="text-center py-12">No jobs found.</div>;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/client/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Posted Jobs</h1>
            <p className="text-muted-foreground">
              Manage your job postings and track applications
            </p>
          </div>
        </div>
        <Button
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          asChild
        >
          <Link to="/client/post-job">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Jobs
                </p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Jobs
                </p>
                <p className="text-2xl font-bold">
                  {jobs.filter((j) => j.status === "active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Proposals
                </p>
                <p className="text-2xl font-bold">
                  {jobs.reduce((sum, job) => {
                    if (Array.isArray(job.proposals)) {
                      return sum + job.proposals.length;
                    } else if (typeof job.proposals === 'number') {
                      return sum + job.proposals;
                    } else {
                      return sum + 0;
                    }
                  }, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Views
                </p>
                <p className="text-2xl font-bold">
                  {jobs.reduce((sum, job) => sum + (typeof job.views === 'number' ? job.views : 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant={selectedStatus === "all" ? "default" : "outline"}
          onClick={() => setSelectedStatus("all")}
        >
          All Jobs ({jobs.length})
        </Button>
        <Button
          variant={selectedStatus === "active" ? "default" : "outline"}
          onClick={() => setSelectedStatus("active")}
        >
          Active ({jobs.filter((j) => j.status === "active").length})
        </Button>
        <Button
          variant={selectedStatus === "paused" ? "default" : "outline"}
          onClick={() => setSelectedStatus("paused")}
        >
          Paused ({jobs.filter((j) => j.status === "paused").length})
        </Button>
        <Button
          variant={selectedStatus === "completed" ? "default" : "outline"}
          onClick={() => setSelectedStatus("completed")}
        >
          Completed ({jobs.filter((j) => j.status === "completed").length})
        </Button>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {filteredJobs.filter(job => job && (job._id || job.id)).map((job, idx) => (
          <Card key={job._id || job.id || idx} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold hover:text-primary cursor-pointer">
                      <Link to={`/job/${job.id}`}>{job.title}</Link>
                    </h3>
                    {job.featured && (
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        Featured
                      </Badge>
                    )}
                    <Badge className={getStatusColor(job.status)}>
                      {getStatusIcon(job.status)}
                      {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : ''}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/job/${job.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Job
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/job/${job.id}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Job
                      </Link>
                    </DropdownMenuItem>
                    {job.status === "active" ? (
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(job.id, "paused")}
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Job
                      </DropdownMenuItem>
                    ) : job.status === "paused" ? (
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(job.id, "active")}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Activate Job
                      </DropdownMenuItem>
                    ) : null}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Job
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Job Posting
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this job posting?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                                          <IndianRupee className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{formatBudget(job.budget)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{job.duration || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">{job.location || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">
                    Posted {getTimeAgo(job.postedDate || job.createdAt)}
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Stats and Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span className="flex items-center">
  <Users className="w-4 h-4 mr-1 text-primary" />
  <span className="font-semibold text-base bg-primary/10 text-primary px-3 py-1 rounded-full">
    {Array.isArray(job.proposals) ? job.proposals.length : (typeof job.proposals === 'number' ? job.proposals : 0)} proposals
  </span>
</span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {typeof job.views === 'number' ? job.views : 0} views
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {typeof job.bookmarks === 'number' ? job.bookmarks : 0} bookmarks
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/job/${job._id}/proposals`}>View Proposals</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to={`/job/${job._id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-6">
            {selectedStatus === "all"
              ? "You haven't posted any jobs yet. Create your first job posting to get started."
              : `No ${selectedStatus} jobs found. Try selecting a different status filter.`}
          </p>
          <Button asChild>
            <Link to="/client/post-job">
              <Plus className="w-4 h-4 mr-2" />
              Post Your First Job
            </Link>
          </Button>
        </div>
      )}
      </div>
    </div>
  );
};

export default PostedJobs;
