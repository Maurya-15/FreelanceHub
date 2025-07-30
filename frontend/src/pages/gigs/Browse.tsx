import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Footer } from "@/components/layout/Footer";
import { SearchAlertBar } from "@/components/search/SearchAlertBar";
import {
  Grid3X3,
  List,
  ChevronDown,
  Filter as FilterIcon,
  Star as StarIcon,
  Clock as ClockIcon,
  Heart as HeartIcon,
  Grid,
  ListIcon,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

// Mock data
const categories = [
  "Design & Creative",
  "Development & IT",
  "Writing & Translation",
  "Video & Animation",
  "Digital Marketing",
  "Data & Analytics",
  "Music & Audio",
  "Photography",
];

const deliveryOptions = [
  "Express 24H",
  "Up to 3 days",
  "Up to 7 days",
  "Anytime",
];

const serviceTypes = [
  "Pro services",
  "Local sellers",
  "Online sellers",
  "HubSpot Certified",
];

export default function BrowseGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [deliveryFilter, setDeliveryFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  // Fetch gigs from backend on mount and when filters/search change
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.append("category", selectedCategory);
    params.append("minBudget", priceRange[0].toString());
    params.append("maxBudget", priceRange[1].toString());
    params.append("sortBy", sortBy);
    if (searchQuery) params.append("search", searchQuery);
    fetch(`/api/gigs?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched gigs:", data.gigs);
        setGigs(data.gigs || []);
      })
      .catch(() => setGigs([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, priceRange, sortBy, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams);
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  const handleServiceFilterChange = (service: string, checked: boolean) => {
    if (checked) {
      setServiceFilter((prev) => [...prev, service]);
    } else {
      setServiceFilter((prev) => prev.filter((s) => s !== service));
    }
  };

  // Helper to get gig image URL
  function getGigImageUrl(gig: any) {
    if (Array.isArray(gig.images) && gig.images.length > 0) {
      if (typeof gig.images[0] === 'string') {
        return gig.images[0].startsWith('http') ? gig.images[0] : `${API_BASE_URL}${gig.images[0]}`;
      } else {
        return `/api/gigs/image/${gig._id}/0`;
      }
    }
    return '/default-image.png';
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {selectedCategory !== "all" ? selectedCategory : "Browse Services"}
          </h1>
          <p className="text-muted-foreground">
            Discover amazing services from talented freelancers around the world
          </p>
        </div>

        {/* Search Bar */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
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
            </div>
          </CardContent>
        </Card>

        {/* Search Alert Bar */}
        <SearchAlertBar
          searchQuery={searchQuery}
          filters={{
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            priceMin: priceRange[0] > 0 ? priceRange[0] : undefined,
            priceMax: priceRange[1] < 5000 ? priceRange[1] : undefined,
            deliveryTime: deliveryFilter || undefined,
          }}
          resultsCount={gigs.length}
        />

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 space-y-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden"
                  >
                    <FilterIcon className="w-4 h-4 mr-2" />
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>

                <div
                  className={`space-y-6 ${showFilters ? "block" : "hidden md:block"}`}
                >
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-3">Budget</h4>
                    <div className="space-y-3">
                      <div className="relative flex w-full touch-none select-none items-center">
                        <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                          <div
                            className="absolute h-full bg-purple-600 rounded-full"
                            style={{
                              width: `${(priceRange[1] / 5000) * 100}%`,
                            }}
                          />
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={5000}
                          step={50}
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([
                              priceRange[0],
                              parseInt(e.target.value),
                            ])
                          }
                          className="absolute w-full h-2 opacity-0 cursor-pointer"
                        />
                        <div
                          className="absolute block h-5 w-5 rounded-full border-2 border-purple-600 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                          style={{
                            left: `calc(${(priceRange[1] / 5000) * 100}% - 10px)`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Time */}
                  <div>
                    <h4 className="font-medium mb-3">Delivery Time</h4>
                    <div className="space-y-2">
                      {deliveryOptions.map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={option}
                            checked={deliveryFilter === option}
                            onCheckedChange={(checked) =>
                              setDeliveryFilter(checked ? option : "")
                            }
                          />
                          <label
                            htmlFor={option}
                            className="text-sm cursor-pointer"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Service Type */}
                  <div>
                    <h4 className="font-medium mb-3">Service Type</h4>
                    <div className="space-y-2">
                      {serviceTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={serviceFilter.includes(type)}
                            onCheckedChange={(checked: boolean) =>
                              handleServiceFilterChange(type, checked)
                            }
                          />
                          <label
                            htmlFor={type}
                            className="text-sm cursor-pointer"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seller Level */}
                  <div>
                    <h4 className="font-medium mb-3">Seller Level</h4>
                    <div className="space-y-2">
                      {["Top Rated", "Level 2", "Level 1", "New Seller"].map(
                        (level) => (
                          <div
                            key={level}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox id={level} />
                            <label
                              htmlFor={level}
                              className="text-sm cursor-pointer"
                            >
                              {level}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">
                  {gigs.length} services available
                </span>
                {(searchQuery || selectedCategory !== "all") && (
                  <div className="flex items-center space-x-2">
                    {searchQuery && (
                      <Badge variant="secondary">
                        Search: {searchQuery}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSearch("")}
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
                          onClick={() => handleCategoryChange("all")}
                          className="ml-2 h-auto p-0"
                        >
                          ×
                        </Button>
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Best Rating</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

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

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading services...</p>
              </div>
            ) : (
              <>
                {/* Gigs Grid/List */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {gigs.map((gig) => (
                    <Card
                      key={gig._id}
                      className={`border-0 bg-card/60 backdrop-blur-md shadow-lg transition-transform duration-200 group hover:scale-[1.03] hover:shadow-2xl ${viewMode === "list" ? "flex" : ""}`}
                      style={{ minHeight: 0 }}
                    >
                      <CardContent className={`p-0 ${viewMode === "list" ? "flex w-full" : ""}`}>
                        <Link
                          to={`/gigs/detail/${gig._id}`}
                          className={viewMode === "list" ? "flex w-full" : "block"}
                        >
                          {/* Image */}
                          <div
                            className={`relative overflow-hidden ${
                              viewMode === "list"
                                ? "w-56 flex-shrink-0"
                                : "aspect-[4/3]"
                            } ${viewMode === "grid" ? "rounded-xl" : "rounded-l-xl"}`}
                            style={{ marginBottom: 0, paddingBottom: 0 }}
                          >
                            <img
                              src={getGigImageUrl(gig)}
                              alt={gig.title}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              style={{ minHeight: 0 }}
                              onError={(e) => (e.currentTarget.src = '/default-image.png')}
                            />
                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex gap-2 z-10">
                              {gig.isChoice && (
                                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-0.5 shadow">
                                  Choice
                                </Badge>
                              )}
                              {gig.hasVideo && (
                                <Badge className="bg-emerald-500 text-white text-xs px-2 py-0.5">
                                  Video
                                </Badge>
                              )}
                            </div>
                            {/* Heart Icon */}
                            <Button
                              variant="secondary"
                              size="sm"
                              className="absolute top-2 right-2 rounded-full w-7 h-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <HeartIcon className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Content */}
                          <div className="p-4 flex-1 min-w-0">
                            {/* Seller Info */}
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="w-5 h-5 border">
                                <AvatarImage src={gig.freelancer?.avatar || '/default-avatar.png'} />
                                <AvatarFallback className="text-[10px]">
                                  {gig.freelancer
                                    ? (gig.freelancer.name?.split(' ').map((n: string) => n[0]).join('') ||
                                       gig.freelancer.username?.[0]?.toUpperCase() ||
                                       '?')
                                    : '?'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium truncate max-w-[80px]">
                                {gig.freelancer?.name || gig.freelancer?.username || "Unknown"}
                              </span>
                              <Badge
                                variant={gig.freelancer?.isTopRated ? "default" : "secondary"}
                                className="text-[10px] px-1.5 py-0.5"
                              >
                                {gig.freelancer?.level || "N/A"}
                              </Badge>
                            </div>

                            {/* Title */}
                            <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors text-base">
                              {gig.title}
                            </h3>
                            {/* Description */}
                            {gig.description && (
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {gig.description}
                              </p>
                            )}
                            {/* Extra Images Thumbnails */}
                            {Array.isArray(gig.images) && gig.images.length > 1 && (
                              <div className="flex gap-1 mb-2">
                                {gig.images.slice(1, 4).map((img, i) => (
                                  <img
                                    key={i}
                                    src={typeof img === "string" ? (img.startsWith('http') ? img : `${API_BASE_URL}${img}`) : `/api/gigs/image/${gig._id}/${i+1}`}
                                    alt={`Gig extra ${i+1}`}
                                    className="w-8 h-8 object-cover rounded border"
                                    onError={(e) => (e.currentTarget.src = '/default-image.png')}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Rating & Reviews */}
                            <div className="flex items-center space-x-1 mb-2">
                              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">
                                {gig.rating || "N/A"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({gig.reviews || 0})
                              </span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {(gig.tags || []).slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0.5"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Price & Delivery */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {gig.deliveryTime || "N/A"}
                                </span>
                              </div>
                              <div className="text-right">
                                {gig.originalPrice && (
                                  <span className="text-xs text-muted-foreground line-through mr-1">
                                    ₹{gig.originalPrice}
                                  </span>
                                )}
                                <span className="text-lg font-bold text-primary">
                                  ₹{gig.price || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More Button */}
                {gigs.length > 0 && (
                  <div className="flex justify-center mt-12">
                    <Button variant="outline" size="lg" className="px-8">
                      Load More Services
                    </Button>
                  </div>
                )}

                {/* No Results */}
                {gigs.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground text-lg mb-4">
                      No services found
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}