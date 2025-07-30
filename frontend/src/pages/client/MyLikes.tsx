import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Star,
  Clock,
  Search,
  Filter,
  Trash2,
  Eye,
  MessageSquare,
  Grid3X3,
  List,
  Calendar,
  SortAsc,
} from "lucide-react";

// Mock data for liked services
const likedServices = [
  {
    id: "GIG-001",
    title: "I will design a modern logo for your business",
    image: "/api/placeholder/300/200",
    seller: {
      name: "Rajesh Kumar",
      avatar: "/api/placeholder/40/40",
      level: "Top Rated",
      isTopRated: true,
    },
    rating: 4.9,
    reviews: 89,
    price: 2999,
    originalPrice: 3999,
    deliveryTime: "3 days",
    category: "Design & Creative",
    tags: ["logo", "branding", "design"],
    likedAt: "2024-01-15T10:30:00Z",
    isChoice: true,
    hasVideo: true,
  },
  {
    id: "GIG-002",
    title: "I will create a complete brand identity package",
    image: "/api/placeholder/300/200",
    seller: {
      name: "Priya Sharma",
      avatar: "/api/placeholder/40/40",
      level: "Level 2",
      isTopRated: false,
    },
    rating: 4.8,
    reviews: 156,
    price: 8500,
    deliveryTime: "5 days",
    category: "Design & Creative",
    tags: ["branding", "identity", "package"],
    likedAt: "2024-01-14T15:20:00Z",
    isChoice: false,
    hasVideo: false,
  },
  {
    id: "GIG-003",
    title: "I will develop a responsive website",
    image: "/api/placeholder/300/200",
    seller: {
      name: "Amit Verma",
      avatar: "/api/placeholder/40/40",
      level: "Level 2",
      isTopRated: false,
    },
    rating: 4.7,
    reviews: 234,
    price: 12500,
    deliveryTime: "7 days",
    category: "Development & IT",
    tags: ["website", "responsive", "development"],
    likedAt: "2024-01-12T09:15:00Z",
    isChoice: true,
    hasVideo: true,
  },
  {
    id: "GIG-004",
    title: "I will write engaging Hindi and English content",
    image: "/api/placeholder/300/200",
    seller: {
      name: "Neha Gupta",
      avatar: "/api/placeholder/40/40",
      level: "Level 1",
      isTopRated: false,
    },
    rating: 4.6,
    reviews: 67,
    price: 1250,
    deliveryTime: "2 days",
    category: "Writing & Translation",
    tags: ["blog", "content", "writing", "hindi"],
    likedAt: "2024-01-10T14:45:00Z",
    isChoice: false,
    hasVideo: false,
  },
  {
    id: "GIG-005",
    title: "I will create stunning social media videos",
    image: "/api/placeholder/300/200",
    seller: {
      name: "Vikash Singh",
      avatar: "/api/placeholder/40/40",
      level: "Top Rated",
      isTopRated: true,
    },
    rating: 4.9,
    reviews: 312,
    price: 4500,
    deliveryTime: "4 days",
    category: "Video & Animation",
    tags: ["video", "social media", "animation"],
    likedAt: "2024-01-08T11:30:00Z",
    isChoice: true,
    hasVideo: true,
  },
];

export default function MyLikes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [likes, setLikes] = useState(likedServices);

  const categories = [
    "Design & Creative",
    "Development & IT",
    "Writing & Translation",
    "Video & Animation",
    "Digital Marketing",
    "Data & Analytics",
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  };

  const removeLike = (gigId: string) => {
    setLikes(likes.filter((like) => like.id !== gigId));
  };

  const filteredLikes = likes
    .filter((gig) => {
      const matchesSearch =
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.seller.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || gig.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime();
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-red-500" />
            My Liked Services
          </h1>
          <p className="text-muted-foreground">
            Services you've saved for later • {likes.length} saved
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search your liked services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-64 h-12">
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

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Liked</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">
              {filteredLikes.length} liked services
            </span>
            {(searchQuery || selectedCategory !== "all") && (
              <div className="flex items-center space-x-2">
                {searchQuery && (
                  <Badge variant="secondary">
                    Search: {searchQuery}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="ml-2 h-auto p-0"
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary">
                    Category: {selectedCategory}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                      className="ml-2 h-auto p-0"
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredLikes.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No liked services found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your filters or search terms."
                : "Start exploring services and save the ones you like!"}
            </p>
            <Button asChild>
              <Link to="/browse">Browse Services</Link>
            </Button>
          </div>
        )}

        {/* Services Grid/List */}
        {filteredLikes.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredLikes.map((gig) => (
              <Card
                key={gig.id}
                className={`border-0 bg-card/50 backdrop-blur-sm floating-card group ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                <CardContent
                  className={`p-0 ${viewMode === "list" ? "flex w-full" : ""}`}
                >
                  {/* Image */}
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "list"
                        ? "w-80 h-48 flex-shrink-0"
                        : "aspect-video"
                    } ${viewMode === "grid" ? "rounded-t-lg" : "rounded-l-lg"}`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center p-6">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded"></div>
                            </div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                              {gig.category}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {gig.isChoice && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          FreelanceHub's Choice
                        </Badge>
                      )}
                      {gig.hasVideo && (
                        <Badge className="bg-emerald-500 text-white">
                          Video
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full w-8 h-8 p-0"
                        asChild
                      >
                        <Link to={`/gig/${gig.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full w-8 h-8 p-0"
                        onClick={() => removeLike(gig.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    {/* Liked timestamp */}
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatTimeAgo(gig.likedAt)}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1">
                    {/* Seller Info */}
                    <div className="flex items-center space-x-2 mb-3">
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
                      <Badge
                        variant={
                          gig.seller.isTopRated ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {gig.seller.level}
                      </Badge>
                    </div>

                    {/* Title */}
                    <Link to={`/gig/${gig.id}`}>
                      <h3 className="font-medium mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {gig.title}
                      </h3>
                    </Link>

                    {/* Rating & Reviews */}
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{gig.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({gig.reviews})
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {gig.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {gig.deliveryTime}
                        </span>
                      </div>
                      <div className="text-right">
                        {gig.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through mr-2">
                            ₹{gig.originalPrice}
                          </span>
                        )}
                        <span className="text-lg font-bold">₹{gig.price}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1" asChild>
                        <Link to={`/gig/${gig.id}`}>View Details</Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
