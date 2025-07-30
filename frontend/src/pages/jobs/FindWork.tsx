import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  IndianRupee,
  Clock,
  Briefcase,
  Star,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Users,
  Zap,
  ArrowRight,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";

const FindWork = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch jobs from backend API on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        if (Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setJobs([]);
        }
      } catch (err) {
        setJobs([]);
      }
    };
    fetchJobs();
  }, []);


  const categories = [
    "Web Development",
    "Mobile Development",
    "Design",
    "Data Science",
    "Marketing",
    "Writing & Translation",
    "Video & Animation",
    "Music & Audio",
    "Programming & Tech",
  ];

  const jobTypes = [
    { value: "fixed", label: "Fixed Price" },
    { value: "hourly", label: "Hourly Rate" },
  ];

  const budgetRanges = [
    { value: "under-500", label: "Under ₹50,000" },
    { value: "500-1000", label: "₹50,000 - ₹1,00,000" },
    { value: "1000-2500", label: "₹1,00,000 - ₹2,50,000" },
    { value: "2500-5000", label: "₹2,50,000 - ₹5,00,000" },
    { value: "over-5000", label: "₹5,00,000+" },
  ];

  const durations = [
    { value: "less-than-1-month", label: "Less than 1 month" },
    { value: "1-3-months", label: "1-3 months" },
    { value: "3-6-months", label: "3-6 months" },
    { value: "ongoing", label: "Ongoing" },
  ];

  

  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    // Job type filter
    if (selectedJobType !== "all") {
      filtered = filtered.filter((job) => job.jobType === selectedJobType);
    }

    // Budget filter
    if (selectedBudget !== "all") {
      filtered = filtered.filter((job) => {
        const budget =
          job.budget.type === "fixed" ? job.budget.max : job.budget.max * 40; // Assume 40 hours/week for hourly
        switch (selectedBudget) {
          case "under-500":
            return budget < 500;
          case "500-1000":
            return budget >= 500 && budget <= 1000;
          case "1000-2500":
            return budget >= 1000 && budget <= 2500;
          case "2500-5000":
            return budget >= 2500 && budget <= 5000;
          case "over-5000":
            return budget > 5000;
          default:
            return true;
        }
      });
    }

    // Duration filter
    if (selectedDuration !== "all") {
      filtered = filtered.filter((job) => {
        switch (selectedDuration) {
          case "less-than-1-month":
            return job.duration.includes("week");
          case "1-3-months":
            return job.duration.includes("1-3") || job.duration.includes("2-3");
          case "3-6-months":
            return job.duration.includes("3-6");
          case "ongoing":
            return job.duration.includes("Ongoing");
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case "latest":
        filtered.sort(
          (a, b) => new Date(b.postedDate) - new Date(a.postedDate),
        );
        break;
      case "budget-high":
        filtered.sort((a, b) => {
          const budgetA =
            a.budget.type === "fixed" ? a.budget.max : a.budget.max * 40;
          const budgetB =
            b.budget.type === "fixed" ? b.budget.max : b.budget.max * 40;
          return budgetB - budgetA;
        });
        break;
      case "budget-low":
        filtered.sort((a, b) => {
          const budgetA =
            a.budget.type === "fixed" ? a.budget.min : a.budget.min * 40;
          const budgetB =
            b.budget.type === "fixed" ? b.budget.min : b.budget.min * 40;
          return budgetA - budgetB;
        });
        break;
      case "proposals":
        filtered.sort((a, b) => a.proposals - b.proposals);
        break;
    }

    setFilteredJobs(filtered);
  }, [
    jobs,
    searchQuery,
    selectedCategory,
    selectedJobType,
    selectedBudget,
    selectedDuration,
    sortBy,
  ]);

  const handleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatBudget = (budget) => {
    if (budget.type === "fixed") {
      return `₹${budget.min.toLocaleString()} - ₹${budget.max.toLocaleString()}`;
    } else {
      return `₹${budget.min} - ₹${budget.max}/hr`;
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const jobDate = new Date(date);
    const diffTime = Math.abs(now - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card rounded-xl p-10 shadow-lg flex flex-col items-center max-w-md w-full">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="mb-4 text-green-500">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="text-2xl font-bold mb-2 text-center">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Your proposal has been sent to the client. You'll be notified if they're interested.
          </p>
          <Link to="/find-work">
            <Button className="w-full mb-3" size="lg">Find More Jobs</Button>
          </Link>
          <Link to="/freelancer/dashboard">
            <Button className="w-full" variant="outline" size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                    />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent
                className={`space-y-6 ${showFilters || "hidden lg:block"}`}
              >
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Search Jobs
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by title, skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Job Type
                  </label>
                  <Select
                    value={selectedJobType}
                    onValueChange={setSelectedJobType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {jobTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Budget Range
                  </label>
                  <Select
                    value={selectedBudget}
                    onValueChange={setSelectedBudget}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Budgets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Budgets</SelectItem>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Project Duration
                  </label>
                  <Select
                    value={selectedDuration}
                    onValueChange={setSelectedDuration}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Durations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Durations</SelectItem>
                      {durations.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedJobType("all");
                    setSelectedBudget("all");
                    setSelectedDuration("all");
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Jobs List */}
          <div className="flex-1">
            {/* Sort and Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Available Jobs</h2>
                <p className="text-muted-foreground">
                  {filteredJobs.length} jobs found • Updated hourly
                </p>
              </div>

              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-48">
                      Sort by:{" "}
                      {sortBy === "latest"
                        ? "Latest"
                        : sortBy === "budget-high"
                          ? "Budget (High)"
                          : sortBy === "budget-low"
                            ? "Budget (Low)"
                            : "Proposals"}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy("latest")}>
                      Latest
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("budget-high")}>
                      Budget (High to Low)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("budget-low")}>
                      Budget (Low to High)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("proposals")}>
                      Fewest Proposals
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Jobs Grid */}
            <div className="space-y-6">
              {filteredJobs.map((job) => (
  <Card
    key={job._id || job.id}
    className="hover:shadow-lg transition-shadow border-l-4 border-l-transparent hover:border-l-primary"
  >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Job Content */}
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Link
                                to={`/job/${job.id}`}
                                className="text-xl font-bold hover:text-primary transition-colors"
                              >
                                {job.title}
                              </Link>
                              {job.featured && (
                                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              {job.verified && (
                                <Badge
                                  variant="secondary"
                                  className="text-green-600 bg-green-100"
                                >
                                  Verified
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
  <span className="flex items-center">
    <Clock className="w-4 h-4 mr-1" />
    {getTimeAgo(job.postedDate)}
  </span>
  <span className="flex items-center">
    <Users className="w-4 h-4 mr-1 text-primary" />
    <span className="font-semibold text-base bg-primary/10 text-primary px-3 py-1 rounded-full">
      {Array.isArray(job.proposals) ? job.proposals.length : (typeof job.proposals === 'number' ? job.proposals : 0)} proposals
    </span>
  </span>
                              <Badge
                                className={`text-xs ${getUrgencyColor(job.urgency)}`}
                              >
                                {job.urgency} priority
                              </Badge>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveJob(job.id)}
                            className="text-muted-foreground hover:text-primary"
                          >
                            {savedJobs.has(job.id) ? (
                              <BookmarkCheck className="w-5 h-5" />
                            ) : (
                              <Bookmark className="w-5 h-5" />
                            )}
                          </Button>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {job.description}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        {/* Job Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-sm">
                            <IndianRupee className="w-4 h-4 mr-2 text-green-600" />
                            <span className="font-medium">
                              {formatBudget(job.budget)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                            <span>{job.duration}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Briefcase className="w-4 h-4 mr-2 text-purple-600" />
                            <span>
                              {job.jobType === "fixed"
                                ? "Fixed Price"
                                : "Hourly"}
                            </span>
                          </div>
                        </div>

                        {/* Client Info */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={job.client.avatar} />
                              <AvatarFallback>
                                {job.client.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{job.client.name}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                {job.client.rating} ({job.client.reviewsCount}{" "}
                                reviews)
                                <span className="mx-2">•</span>
                                <MapPin className="w-4 h-4 mr-1" />
                                {job.client.location}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {job._id && (
  <>
    <Link to={`/job/${job._id}`}>
      <Button variant="outline" size="sm">
        View Details
      </Button>
    </Link>
    <Link to={`/proposal-submission/${job._id}`}>
      <Button
        size="sm"
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        Apply Now
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Link>
  </>
)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {filteredJobs.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Jobs
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms to find more
                    opportunities.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedJobType("all");
                      setSelectedBudget("all");
                      setSelectedDuration("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindWork;
