import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  User,
  Users,
  Eye,
  Share2,
  Flag,
  Briefcase,
  FileText,
  MessageSquare,
} from "lucide-react";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function JobDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/jobs/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setJobData(data.job);
        else setError("Job not found");
      })
      .catch(() => setError("Failed to fetch job data"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !jobData) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Job not found"}</div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(jobData.deadline);

  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/browse" className="hover:text-primary">
            Browse Jobs
          </Link>
          <span>/</span>
          <Link
            to={`/browse?category=${jobData.category}`}
            className="hover:text-primary"
          >
            {jobData.category}
          </Link>
          <span>/</span>
          <span>Job Details</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/browse">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              {jobData.views} views
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline">
              <Flag className="w-4 h-4 mr-2" />
              Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-4">{jobData.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
  <div className="flex items-center">
    <Calendar className="w-4 h-4 mr-1" />
    {(() => {
      // Robust time ago
      const now = new Date('2025-07-10T23:15:17+05:30');
      const dateStr = jobData.postedDate || jobData.createdAt;
      const date = dateStr ? new Date(dateStr) : null;
      if (!date || isNaN(date.getTime())) return 'Unknown';
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffMonths = Math.floor(diffDays / 30);
      if (diffDays < 1) return 'Today';
      if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    })()}
  </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {daysRemaining > 0
                          ? `${daysRemaining} days left`
                          : "Deadline passed"}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {Array.isArray(jobData.proposals) ? jobData.proposals.length : (jobData.proposals || 0)} proposals
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {jobData.status}
                    </Badge>
                    {jobData.isUrgent && (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                                            <IndianRupee className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Budget</p>
                    <p className="text-sm text-muted-foreground">
                      {typeof jobData.budget?.min !== "undefined" && typeof jobData.budget?.max !== "undefined"
                        ? `₹${jobData.budget.min} - ₹${jobData.budget.max}`
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Briefcase className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Experience</p>
                    <p className="text-sm text-muted-foreground">
                      {jobData.experienceLevel || jobData.experience || "N/A"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {jobData.projectLength ? jobData.projectLength.replace("-", " to ") : (jobData.duration || "N/A")}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Proposals</p>
                    <p className="text-sm text-muted-foreground">
                      {Array.isArray(jobData.proposals) ? jobData.proposals.length : (jobData.proposals || 0)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(jobData.skills) && jobData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none dark:prose-invert">
                  <p className="whitespace-pre-line">{jobData.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {Array.isArray(jobData.attachments) && jobData.attachments.length > 0 && (
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {jobData.attachments.map((attachment, index) => (
  <div
    key={index}
    className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"
  >
    <FileText className="w-6 h-6 text-muted-foreground" />
    <div className="flex-1">
      <p className="font-medium">{attachment.name}</p>
      <p className="text-sm text-muted-foreground">
        {formatFileSize(attachment.size)}
      </p>
    </div>
    <a
      href={attachment.url}
      download={attachment.name}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button variant="outline" size="sm">
        Download
      </Button>
    </a>
  </div>
))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Questions */}
            {Array.isArray(jobData.questions) && jobData.questions.length > 0 && (
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Additional Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {jobData.questions.map((question, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <p className="font-medium">Q{index + 1}:</p>
                        <p className="text-muted-foreground">{question}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Apply Section */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">
                    ${jobData.budget.min} - ${jobData.budget.max}
                  </h3>
                  <p className="text-muted-foreground">Fixed Price Budget</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Proposals</span>
                    <span className="font-medium">{Array.isArray(jobData.proposals) ? jobData.proposals.length : (jobData.proposals || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last activity</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Interviewing</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Invites sent</span>
                    <span className="font-medium">5</span>
                  </div>
                </div>

                <Link to={`/proposal-submission/${id}`} className="w-full mb-3 block">
  <GradientButton className="w-full mb-3">
    Submit a Proposal
  </GradientButton>
</Link>

                <Button variant="outline" className="w-full">
                  Save Job
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Connects required: 2
                </p>
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>About the Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={jobData.client.avatar} />
                    <AvatarFallback>
                      {jobData.client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{jobData.client.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {jobData.client.username}
                    </p>
                    {jobData.client.verified && (
                      <Badge variant="outline" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span>{jobData.client.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span>
                      {(() => {
                        const ms = jobData.client?.memberSince;
                        const date = ms ? new Date(ms) : null;
                        return date && !isNaN(date.getTime()) ? date.getFullYear() : "N/A";
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jobs posted</span>
                    <span>{typeof jobData.client?.totalJobsPosted === "number" ? jobData.client.totalJobsPosted : "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total spent</span>
                    <span>
                      {typeof jobData.client?.totalSpent === "number"
                        ? `₹${jobData.client.totalSpent.toLocaleString()}`
                        : "₹0"}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button variant="outline" className="w-full mb-2" onClick={() => navigate(`/messages?userId=${jobData.client._id}`)}>
  <MessageSquare className="w-4 h-4 mr-2" />
  Contact Seller
</Button>
<Button variant="outline" className="w-full" asChild>
  <Link to={`/client/${jobData.client.id}`}>
    <User className="w-4 h-4 mr-2" />
    View Profile
  </Link>
</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
