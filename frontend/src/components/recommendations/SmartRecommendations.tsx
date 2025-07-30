import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Heart, TrendingUp, Sparkles, Eye } from "lucide-react";

interface SimilarGig {
  id: string;
  title: string;
  image: string;
  seller: {
    name: string;
    avatar: string;
    level: string;
  };
  price: number;
  rating: number;
  reviews: number;
  category: string;
  matchReason: string;
}

interface RecommendedFreelancer {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviews: number;
  skills: string[];
  hourlyRate: number;
  responseTime: string;
  matchReason: string;
  level: string;
}

interface SmartRecommendationsProps {
  type: "gigs" | "freelancers" | "both";
  currentGigId?: string;
  currentCategory?: string;
  userId?: string;
}

// Mock AI-powered recommendations
const similarGigs: SimilarGig[] = [
  {
    id: "GIG-REC-001",
    title: "I will design a premium logo with unlimited revisions",
    image: "/api/placeholder/300/200",
    seller: {
      name: "Alex Rivera",
      avatar: "https://placehold.co/40x40",
      level: "Top Rated",
    },
    price: 350,
    rating: 4.9,
    reviews: 127,
    category: "Logo Design",
    matchReason: "Similar style & price range",
  },
  {
    id: "GIG-REC-002",
    title: "I will create a complete brand identity package",
    image: "/api/placeholder/300/200",
    seller: {
      name: "Emma Wilson",
      avatar: "https://placehold.co/40x40",
      level: "Level 2",
    },
    price: 599,
    rating: 4.8,
    reviews: 89,
    category: "Brand Identity",
    matchReason: "Customers also viewed",
  },
  {
    id: "GIG-REC-003",
    title: "I will design minimalist logo with source files",
    image: "/api/placeholder/300/200",
    seller: {
      name: "David Park",
      avatar: "https://placehold.co/40x40",
      level: "Level 1",
    },
    price: 199,
    rating: 4.7,
    reviews: 156,
    category: "Logo Design",
    matchReason: "Based on your browsing history",
  },
];

const recommendedFreelancers: RecommendedFreelancer[] = [
  {
    id: "FREELANCER-REC-001",
    name: "Maria Garcia",
    title: "Senior Brand Designer & Strategist",
    avatar: "https://placehold.co/60x60",
    rating: 4.9,
    reviews: 234,
    skills: ["Logo Design", "Brand Strategy", "Adobe Illustrator"],
    hourlyRate: 45,
    responseTime: "2 hours",
    matchReason: "Specializes in your industry",
    level: "Top Rated",
  },
  {
    id: "FREELANCER-REC-002",
    name: "James Chen",
    title: "Creative Director & Visual Designer",
    avatar: "https://placehold.co/60x60",
    rating: 4.8,
    reviews: 178,
    skills: ["Creative Direction", "Brand Identity", "Design Systems"],
    hourlyRate: 65,
    responseTime: "1 hour",
    matchReason: "High success rate with similar projects",
    level: "Top Rated",
  },
  {
    id: "FREELANCER-REC-003",
    name: "Lisa Thompson",
    title: "Graphic Designer & Illustrator",
    avatar: "https://placehold.co/60x60",
    rating: 4.7,
    reviews: 145,
    skills: ["Graphic Design", "Illustration", "Print Design"],
    hourlyRate: 35,
    responseTime: "3 hours",
    matchReason: "Similar budget range preferences",
    level: "Level 2",
  },
];

export function SmartRecommendations({
  type,
  currentGigId,
  currentCategory,
  userId,
}: SmartRecommendationsProps) {
  const handleSaveGig = (gigId: string) => {
    console.log("Saving gig:", gigId);
    // In real app, save to user's favorites
  };

  if (type === "gigs" || type === "both") {
    return (
      <div className="space-y-8">
        {/* Similar Gigs Section */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              Similar Gigs You Might Like
              <Badge variant="outline" className="ml-2 text-xs">
                AI Powered
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarGigs.map((gig) => (
                <Card
                  key={gig.id}
                  className="border border-border/40 floating-card group"
                >
                  <CardContent className="p-0">
                    <Link to={`/gig/${gig.id}`}>
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-t-lg relative overflow-hidden">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveGig(gig.id);
                          }}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            {gig.matchReason}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={gig.seller.avatar} />
                            <AvatarFallback className="text-xs">
                              {gig.seller.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {gig.seller.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {gig.seller.level}
                          </Badge>
                        </div>
                        <h3 className="font-medium mb-2 line-clamp-2 text-sm group-hover:text-primary transition-colors">
                          {gig.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">
                              {gig.rating}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({gig.reviews})
                            </span>
                          </div>
                          <span className="font-bold">₹{gig.price}</span>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Freelancers You May Like Section */}
        {(type === "freelancers" || type === "both") && (
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Freelancers You May Like
                <Badge variant="outline" className="ml-2 text-xs">
                  Personalized
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedFreelancers.map((freelancer) => (
                  <Card
                    key={freelancer.id}
                    className="border border-border/40 floating-card"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={freelancer.avatar} />
                          <AvatarFallback>
                            {freelancer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">
                                {freelancer.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {freelancer.title}
                              </p>
                            </div>
                            <Badge className="bg-brand-gradient text-white">
                              {freelancer.level}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                              <span>{freelancer.rating}</span>
                              <span className="ml-1">
                                ({freelancer.reviews} reviews)
                              </span>
                            </div>
                            <span>${freelancer.hourlyRate}/hr</span>
                            <span>{freelancer.responseTime} response time</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {freelancer.skills.slice(0, 3).map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              {freelancer.matchReason}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/freelancer/${freelancer.id}`}>
                                  <Eye className="w-3 h-3 mr-1" />
                                  View Profile
                                </Link>
                              </Button>
                              <Button size="sm" asChild>
                                <Link
                                  to={`/messages/${freelancer.name.replace(" ", "-").toLowerCase()}`}
                                >
                                  Contact
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return null;
}
