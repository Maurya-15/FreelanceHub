import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  MessageSquare,
  Heart,
  Share2,
  Award,
  TrendingUp,
  CheckCircle,
  ThumbsUp,
  Globe,
  Briefcase,
  GraduationCap,
  Languages,
} from "lucide-react";

// Mock freelancer data
const freelancerData = {
  name: "Sarah Johnson",
  title: "Senior Graphic Designer & Brand Strategist",
  username: "@sarah_designs",
  avatar: "/api/placeholder/120/120",
  coverPhoto: "/api/placeholder/1200/300",
  location: "New York, USA",
  memberSince: "2020-03-15",
  isOnline: true,
  lastSeen: "2024-01-15T10:30:00Z",
  level: "Top Rated",
  isProVerified: true,
  stats: {
    rating: 4.9,
    totalReviews: 127,
    totalOrders: 89,
    responseTime: "1 hour",
    onTimeDelivery: 98,
    repeatClients: 75,
  },
  overview:
    "I'm a passionate graphic designer with over 8 years of experience in creating compelling visual identities for brands. I specialize in logo design, brand identity, and print design. My goal is to help businesses stand out through thoughtful, strategic design that connects with their target audience.",
  skills: [
    "Logo Design",
    "Brand Identity",
    "Print Design",
    "Packaging Design",
    "Adobe Illustrator",
    "Adobe Photoshop",
    "Adobe InDesign",
    "Typography",
    "Color Theory",
    "Branding Strategy",
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Conversational" },
    { name: "French", level: "Basic" },
  ],
  education: [
    {
      degree: "Bachelor of Fine Arts in Graphic Design",
      school: "Rhode Island School of Design",
      year: "2016",
    },
    {
      degree: "Certificate in Digital Marketing",
      school: "Google Digital Academy",
      year: "2019",
    },
  ],
  certifications: [
    {
      name: "Adobe Certified Expert - Illustrator",
      issuer: "Adobe",
      year: "2021",
    },
    {
      name: "Brand Strategy Fundamentals",
      issuer: "Brand Institute",
      year: "2020",
    },
  ],
  gigs: [
    {
      id: "GIG-001",
      title: "I will design a modern logo for your business",
      image: "/api/placeholder/300/200",
      price: 299,
      rating: 4.9,
      orders: 89,
      deliveryTime: "3 days",
    },
    {
      id: "GIG-002",
      title: "I will create a complete brand identity package",
      image: "/api/placeholder/300/200",
      price: 850,
      rating: 4.8,
      orders: 45,
      deliveryTime: "7 days",
    },
    {
      id: "GIG-003",
      title: "I will design packaging for your product",
      image: "/api/placeholder/300/200",
      price: 450,
      rating: 5.0,
      orders: 32,
      deliveryTime: "5 days",
    },
  ],
  portfolio: [
    {
      id: "PORT-001",
      title: "Tech Startup Branding",
      category: "Brand Identity",
      image: "/api/placeholder/400/300",
    },
    {
      id: "PORT-002",
      title: "Restaurant Logo Design",
      category: "Logo Design",
      image: "/api/placeholder/400/300",
    },
    {
      id: "PORT-003",
      title: "Product Packaging",
      category: "Packaging Design",
      image: "/api/placeholder/400/300",
    },
    {
      id: "PORT-004",
      title: "E-commerce Brand",
      category: "Brand Identity",
      image: "/api/placeholder/400/300",
    },
    {
      id: "PORT-005",
      title: "Mobile App UI",
      category: "UI Design",
      image: "/api/placeholder/400/300",
    },
    {
      id: "PORT-006",
      title: "Print Advertisement",
      category: "Print Design",
      image: "/api/placeholder/400/300",
    },
  ],
  reviews: [
    {
      id: "REV-001",
      client: {
        name: "Mike Chen",
        avatar: "/api/placeholder/40/40",
        country: "United States",
      },
      rating: 5,
      date: "2024-01-10",
      gig: "Logo Design Package",
      review:
        "Absolutely fantastic work! Sarah understood exactly what I was looking for and delivered beyond my expectations. The logo perfectly captures our brand essence and we've received so many compliments. Communication was excellent throughout the process.",
    },
    {
      id: "REV-002",
      client: {
        name: "Emily Rodriguez",
        avatar: "/api/placeholder/40/40",
        country: "Canada",
      },
      rating: 5,
      date: "2024-01-08",
      gig: "Brand Identity Package",
      review:
        "Working with Sarah was an absolute pleasure. Her strategic approach to branding really impressed me. She didn't just create a logo - she created a complete visual identity that tells our story. Highly recommend!",
    },
    {
      id: "REV-003",
      client: {
        name: "David Park",
        avatar: "/api/placeholder/40/40",
        country: "Australia",
      },
      rating: 4,
      date: "2024-01-05",
      gig: "Packaging Design",
      review:
        "Great designer with excellent technical skills. The packaging design was exactly what we needed for our product launch. Very professional and delivered on time.",
    },
  ],
};

export default function FreelancerProfile() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if viewing own profile or someone else's profile
  const isOwnProfile = !userId || userId === undefined;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  // Get freelancer data based on userId parameter
  const getFreelancerData = () => {
    if (!userId) {
      return freelancerData; // Default data for own profile
    }

    // Mock data for different user IDs - in real app, this would fetch from API
    const mockUsers: { [key: string]: any } = {
      "USER-001": {
        ...freelancerData,
        name: "Rajesh Kumar",
        title: "Full-Stack Developer & WordPress Expert",
        username: "@rajesh_dev",
        location: "Mumbai, India",
        isOnline: true,
        stats: {
          ...freelancerData.stats,
          rating: 4.8,
          totalReviews: 247,
          totalOrders: 156,
        },
      },
      "USER-002": {
        ...freelancerData,
        name: "Priya Sharma",
        title: "UI/UX Designer & Brand Strategist",
        username: "@priya_designs",
        location: "Bangalore, India",
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    };

    return mockUsers[userId] || freelancerData; // Fallback to default if user not found
  };

  const currentFreelancerData = getFreelancerData();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* Cover Photo */}
        <div className="relative h-64 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Header */}
        <div className="relative">
          <div className="container mx-auto px-4">
            <div className="relative -mt-32 pb-8">
              <div className="bg-card rounded-2xl p-8 shadow-lg border">
                <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage src={currentFreelancerData.avatar} />
                      <AvatarFallback>
                        {currentFreelancerData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {currentFreelancerData.isOnline && (
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h1 className="text-3xl font-bold">
                            {currentFreelancerData.name}
                          </h1>
                          <Badge className="bg-brand-gradient text-white">
                            {currentFreelancerData.level}
                          </Badge>
                          {currentFreelancerData.isProVerified && (
                            <Badge variant="outline">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Pro Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xl text-muted-foreground mb-2">
                          {currentFreelancerData.title}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {currentFreelancerData.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Member since{" "}
                            {formatDate(currentFreelancerData.memberSince)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {currentFreelancerData.isOnline
                              ? "Online now"
                              : `Last seen ${getTimeAgo(currentFreelancerData.lastSeen)}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {isOwnProfile ? (
                          // Actions for own profile
                          <>
                            <Button variant="outline" asChild>
                              <Link to="/freelancer/my-gigs">
                                <Briefcase className="w-4 h-4 mr-2" />
                                Manage Gigs
                              </Link>
                            </Button>
                            <GradientButton asChild>
                              <Link to="/freelancer/create-gig">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Create New Gig
                              </Link>
                            </GradientButton>
                          </>
                        ) : (
                          // Actions for viewing other's profile
                          <>
                            <Button variant="outline">
                              <Heart className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button variant="outline">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                            <GradientButton asChild>
                              <Link
                                to={`/messages/${currentFreelancerData.username.slice(1)}`}
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Contact Me
                              </Link>
                            </GradientButton>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-lg">
                            {currentFreelancerData.stats.rating}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          ({currentFreelancerData.stats.totalReviews} reviews)
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">
                          {currentFreelancerData.stats.totalOrders}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Orders Completed
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">
                          {currentFreelancerData.stats.responseTime}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Avg. Response
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">
                          {currentFreelancerData.stats.onTimeDelivery}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          On-time Delivery
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">
                          {currentFreelancerData.stats.repeatClients}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Repeat Clients
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {currentFreelancerData.overview}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="gigs">
                    Gigs ({currentFreelancerData.gigs.length})
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    Reviews ({currentFreelancerData.stats.totalReviews})
                  </TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Skills & Expertise */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills & Expertise</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {currentFreelancerData.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Languages */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Languages className="w-5 h-5 mr-2" />
                          Languages
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {currentFreelancerData.languages.map((lang) => (
                            <div
                              key={lang.name}
                              className="flex justify-between items-center"
                            >
                              <span>{lang.name}</span>
                              <Badge variant="outline">{lang.level}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Education */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <GraduationCap className="w-5 h-5 mr-2" />
                          Education
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentFreelancerData.education.map((edu, index) => (
                            <div key={index}>
                              <h4 className="font-medium">{edu.degree}</h4>
                              <p className="text-sm text-muted-foreground">
                                {edu.school}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {edu.year}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="gigs" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentFreelancerData.gigs.map((gig) => (
                      <Card
                        key={gig.id}
                        className="group hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-0">
                          <Link to={`/gig/${gig.id}`}>
                            <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 relative overflow-hidden rounded-t-lg">
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-brand-gradient text-white">
                                  ₹{gig.price}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {gig.title}
                              </h3>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span>{gig.rating}</span>
                                  <span className="mx-1">•</span>
                                  <span>{gig.orders} orders</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {gig.deliveryTime}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Reviews ({currentFreelancerData.stats.totalReviews})
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {currentFreelancerData.stats.rating}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {currentFreelancerData.reviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={review.client.avatar} />
                                  <AvatarFallback>
                                    {review.client.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {review.client.name}
                                  </p>
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <span>{review.client.country}</span>
                                    <span>•</span>
                                    <span>{formatDate(review.date)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-2">
                              For: {review.gig}
                            </p>
                            <p className="leading-relaxed">{review.review}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentFreelancerData.portfolio.map((item) => (
                      <Card
                        key={item.id}
                        className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                      >
                        <CardContent className="p-0">
                          <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
                            {/* Mock portfolio image with beautiful placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center p-6">
                                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg"></div>
                                  </div>
                                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                    {item.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {item.category}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-white font-semibold mb-1">
                                  {item.title}
                                </h3>
                                <p className="text-white/90 text-sm">
                                  {item.category}
                                </p>
                                <div className="mt-2 flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-7 text-xs"
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="about" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>About Me</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="leading-relaxed">
                          {currentFreelancerData.overview}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Award className="w-5 h-5 mr-2" />
                          Certifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentFreelancerData.certifications.map(
                            (cert, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div>
                                  <h4 className="font-medium">{cert.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {cert.issuer}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {cert.year}
                                  </p>
                                </div>
                                <Badge variant="secondary">Verified</Badge>
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="font-bold text-2xl mb-1">
                              {currentFreelancerData.stats.totalOrders}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Total Orders
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-2xl mb-1">
                              {currentFreelancerData.stats.onTimeDelivery}%
                            </div>
                            <p className="text-sm text-muted-foreground">
                              On-time Delivery
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-2xl mb-1">
                              {currentFreelancerData.stats.responseTime}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Response Time
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-2xl mb-1">
                              {currentFreelancerData.stats.repeatClients}%
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Repeat Clients
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
