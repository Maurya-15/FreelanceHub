import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  MessageSquare,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  ThumbsUp,
  Flag,
  CreditCard,
  Package,
} from "lucide-react";

// Mock order data
const orderData = {
  id: "ORD-001",
  title: "Modern Logo Design Package",
  description:
    "Create a modern, professional logo for my tech startup including multiple concepts and file formats.",

  gig: {
    id: "GIG-001",
    title: "I will design a modern logo for your business",
    package: "Premium Package",
    image: "/api/placeholder/400/300",
  },

  freelancer: {
    id: "USER-001",
    name: "Sarah Johnson",
    username: "@sarahdesigns",
    avatar: "/api/placeholder/80/80",
    rating: 4.9,
    totalReviews: 156,
    responseTime: "1 hour",
    level: "Top Rated",
  },

  client: {
    id: "USER-002",
    name: "John Smith",
    username: "@johnsmith",
    avatar: "/api/placeholder/80/80",
  },

  status: "in_progress",
  createdAt: "2024-01-10T10:00:00Z",
  deadline: "2024-01-20T23:59:59Z",
  deliveredAt: null,
  completedAt: null,

  pricing: {
    gigPrice: 1299,
    serviceFee: 65,
    total: 1364,
  },

  requirements: [
    "Company logo with modern design aesthetic",
    "3 initial logo concepts",
    "Unlimited revisions",
    "All file formats (AI, EPS, PNG, JPG, PDF)",
    "3D mockup presentation",
    "Brand guidelines document",
  ],

  deliverables: [
    {
      id: "DEL-001",
      name: "Initial Logo Concepts",
      description: "Three initial logo design concepts for review",
      status: "completed",
      deliveredAt: "2024-01-12T14:30:00Z",
      files: [
        {
          name: "Logo_Concepts_v1.png",
          size: "2.4 MB",
          type: "image",
          url: "#",
          preview: "/api/placeholder/300/200",
        },
        {
          name: "Concept_Notes.pdf",
          size: "1.2 MB",
          type: "document",
          url: "#",
        },
      ],
    },
    {
      id: "DEL-002",
      name: "Revised Logo Design",
      description: "Updated logo based on client feedback",
      status: "in_progress",
      deliveredAt: null,
      files: [],
    },
    {
      id: "DEL-003",
      name: "Final Files & Brand Guidelines",
      description: "All file formats and comprehensive brand guidelines",
      status: "pending",
      deliveredAt: null,
      files: [],
    },
  ],

  timeline: [
    {
      id: "TL-001",
      type: "order_created",
      title: "Order Started",
      description: "Order was placed and payment processed",
      timestamp: "2024-01-10T10:00:00Z",
      actor: "client",
    },
    {
      id: "TL-002",
      type: "requirements_clarified",
      title: "Requirements Clarified",
      description: "Additional project details discussed",
      timestamp: "2024-01-10T11:30:00Z",
      actor: "freelancer",
    },
    {
      id: "TL-003",
      type: "delivery_submitted",
      title: "Initial Concepts Delivered",
      description: "First milestone completed - 3 logo concepts delivered",
      timestamp: "2024-01-12T14:30:00Z",
      actor: "freelancer",
    },
    {
      id: "TL-004",
      type: "revision_requested",
      title: "Revision Requested",
      description: "Client requested changes to concept #2",
      timestamp: "2024-01-13T09:15:00Z",
      actor: "client",
    },
  ],

  messages: [
    {
      id: "MSG-001",
      content: "Hi! I'm excited to work on your logo design project.",
      timestamp: "2024-01-10T10:15:00Z",
      sender: "freelancer",
    },
    {
      id: "MSG-002",
      content: "Great! Looking forward to seeing your concepts.",
      timestamp: "2024-01-10T10:30:00Z",
      sender: "client",
    },
  ],

  reviews: {
    clientReview: null,
    freelancerReview: null,
  },
};

const statusConfig = {
  pending: {
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    icon: Clock,
  },
  in_progress: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    icon: RefreshCw,
  },
  delivered: {
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    icon: Package,
  },
  completed: {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    icon: CheckCircle,
  },
  cancelled: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    icon: AlertCircle,
  },
};

export default function Order() {
  const { id } = useParams();
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [revisionRequest, setRevisionRequest] = useState("");
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressPercentage = () => {
    const completedDeliverables = orderData.deliverables.filter(
      (d) => d.status === "completed",
    ).length;
    return (completedDeliverables / orderData.deliverables.length) * 100;
  };

  const handleApproveDelivery = () => {
    console.log("Approving delivery");
    // In real app, update order status
  };

  const handleRequestRevisions = () => {
    console.log("Requesting revisions:", revisionRequest);
    setShowRevisionDialog(false);
    setRevisionRequest("");
  };

  const handleSubmitReview = () => {
    console.log("Submitting review:", { rating, reviewText });
    setShowReviewDialog(false);
    setRating(0);
    setReviewText("");
  };

  const StatusIcon = statusConfig[orderData.status]?.icon || Clock;
  const daysRemaining = getDaysRemaining(orderData.deadline);
  const progressPercentage = getProgressPercentage();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/client/dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Order #{orderData.id}</h1>
              <p className="text-muted-foreground">{orderData.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={statusConfig[orderData.status].color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {orderData.status.replace("_", " ")}
            </Badge>
            <Button variant="outline" asChild>
              <Link to={`/messages/${orderData.freelancer.username.slice(1)}`}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Progress */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Overall Progress
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Deadline</p>
                    <p className="text-sm text-muted-foreground">
                      {daysRemaining > 0
                        ? `${daysRemaining} days left`
                        : "Overdue"}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Started</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(orderData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Total Paid</p>
                    <p className="text-sm text-muted-foreground">
                      ${orderData.pricing.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deliverables */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Deliverables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.deliverables.map((deliverable) => (
                    <div
                      key={deliverable.id}
                      className="p-4 border border-border/40 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{deliverable.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {deliverable.description}
                          </p>
                        </div>
                        <Badge
                          className={statusConfig[deliverable.status].color}
                        >
                          {deliverable.status}
                        </Badge>
                      </div>

                      {deliverable.deliveredAt && (
                        <p className="text-sm text-muted-foreground mb-3">
                          Delivered on {formatDate(deliverable.deliveredAt)}
                        </p>
                      )}

                      {deliverable.files.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Files:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {deliverable.files.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"
                              >
                                {file.type === "image" ? (
                                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {file.size}
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {deliverable.status === "completed" && (
                        <div className="flex gap-2 mt-4">
                          <GradientButton
                            size="sm"
                            onClick={handleApproveDelivery}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Approve
                          </GradientButton>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowRevisionDialog(true)}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Request Revision
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.timeline.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.actor === "client"
                            ? "bg-blue-100 dark:bg-blue-900/20"
                            : "bg-purple-100 dark:bg-purple-900/20"
                        }`}
                      >
                        {event.type === "order_created" && (
                          <Package className="w-5 h-5" />
                        )}
                        {event.type === "requirements_clarified" && (
                          <MessageSquare className="w-5 h-5" />
                        )}
                        {event.type === "delivery_submitted" && (
                          <Upload className="w-5 h-5" />
                        )}
                        {event.type === "revision_requested" && (
                          <RefreshCw className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.title}</h4>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Freelancer Info */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Freelancer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={orderData.freelancer.avatar} />
                    <AvatarFallback>
                      {orderData.freelancer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {orderData.freelancer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {orderData.freelancer.username}
                    </p>
                    <Badge className="bg-brand-gradient text-white mt-1">
                      {orderData.freelancer.level}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{orderData.freelancer.rating}</span>
                      <span className="text-muted-foreground">
                        ({orderData.freelancer.totalReviews})
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time</span>
                    <span>{orderData.freelancer.responseTime}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Button className="w-full" variant="outline" asChild>
                    <Link
                      to={`/messages/${orderData.freelancer.username.slice(1)}`}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to={`/freelancer/${orderData.freelancer.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Package</h4>
                  <p className="text-sm text-muted-foreground">
                    {orderData.gig.package}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {orderData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Gig Price</span>
                    <span>${orderData.pricing.gigPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>${orderData.pricing.serviceFee}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${orderData.pricing.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderData.status === "completed" &&
                  !orderData.reviews.clientReview && (
                    <Button
                      className="w-full"
                      onClick={() => setShowReviewDialog(true)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Leave Review
                    </Button>
                  )}

                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download All Files
                </Button>

                <Button variant="outline" className="w-full">
                  <Flag className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Revision Request Dialog */}
        <Dialog open={showRevisionDialog} onOpenChange={setShowRevisionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Revisions</DialogTitle>
              <DialogDescription>
                Please describe what changes you'd like to see in the next
                revision.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Please explain what specific changes you'd like..."
                value={revisionRequest}
                onChange={(e) => setRevisionRequest(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRevisionDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <GradientButton
                  onClick={handleRequestRevisions}
                  className="flex-1"
                  disabled={!revisionRequest.trim()}
                >
                  Send Revision Request
                </GradientButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave a Review</DialogTitle>
              <DialogDescription>
                How was your experience working with {orderData.freelancer.name}
                ?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Review (Optional)
                </label>
                <Textarea
                  placeholder="Share your experience working with this freelancer..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowReviewDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <GradientButton
                  onClick={handleSubmitReview}
                  className="flex-1"
                  disabled={rating === 0}
                >
                  Submit Review
                </GradientButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}
