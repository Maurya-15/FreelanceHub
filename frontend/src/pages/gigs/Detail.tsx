import React, { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { SmartRecommendations } from "@/components/recommendations/SmartRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Clock,
  RotateCcw,
  Check,
  Heart,
  Share2,
  MessageCircle,
  User,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { API_BASE_URL, getApiUrl } from "@/lib/api";

export default function GigDetail() {
  const { gigId } = useParams();
  console.log("gigId", gigId);
  
  const [gigData, setGigData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("standard");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (!gigId) return;
    setLoading(true);
    setError("");
    fetch(getApiUrl(`/api/gigs/${gigId}`))
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setGigData(data.gig);
        else setError("Gig not found");
      })
      .catch(() => setError("Failed to fetch gig data"))
      .finally(() => setLoading(false));
  }, [gigId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-muted-foreground">Loading...</span>
      </div>
    );
  }
  if (error || !gigData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-xl mx-auto border-0 bg-card/70 shadow-lg">
          <CardContent className="p-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {error || "Sorry, the page or gig you are looking for does not exist or has been removed."}
            </p>
            <Button asChild className="w-full max-w-xs mx-auto">
              <Link to="/browse">Return to Browse</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Defensive fallback for missing fields
  let images: string[] = [];
  if (Array.isArray(gigData.images) && gigData.images.length > 0) {
    if (typeof gigData.images[0] === 'string') {
      images = gigData.images.map((img: string) =>
        img.startsWith('http') ? img : `${API_BASE_URL}${img}`
      );
    } else {
      images = gigData.images.map((_: any, idx: number) => getApiUrl(`/api/gigs/image/${gigData._id}/${idx}`));
    }
  } else {
    images = ["https://placehold.co/600x400"];
  }
  const gigImage = images[currentImageIndex] || "https://placehold.co/600x400";
  const packages = typeof gigData.packages === 'object' && gigData.packages ? gigData.packages : {};
  const freelancer = typeof gigData.freelancer === 'object' && gigData.freelancer ? gigData.freelancer : {};
  const tags = Array.isArray(gigData.tags) ? gigData.tags : [];
  const stats = typeof gigData.stats === 'object' && gigData.stats ? gigData.stats : {};
  const reviews = Array.isArray(gigData.reviews) ? gigData.reviews : [];
  const faqs = Array.isArray(gigData.faqs) ? gigData.faqs : [];

  // Defensive fallback for freelancer fields
  const freelancerName = typeof freelancer.name === 'string' && freelancer.name.trim() ? freelancer.name : (typeof freelancer.username === 'string' && freelancer.username.trim() ? freelancer.username : '');
  const isValidAvatar = (url?: string) => !!url && !url.includes('/api/placeholder/');
const freelancerAvatar =
  isValidAvatar(freelancer.profilePicture) ? freelancer.profilePicture
  : isValidAvatar(freelancer.avatar) ? freelancer.avatar
  : 'https://placehold.co/60x60';
  const freelancerUsername = typeof freelancer.username === 'string' && freelancer.username ? freelancer.username : '';
  const freelancerLevel = typeof freelancer.level === 'string' && freelancer.level ? freelancer.level : '';
  const freelancerRating = typeof freelancer.rating === 'number' ? freelancer.rating : 0;
  const freelancerTotalReviews = typeof freelancer.totalReviews === 'number' ? freelancer.totalReviews : 0;
  const freelancerCompletedOrders = typeof freelancer.completedOrders === 'number' ? freelancer.completedOrders : 0;
  const freelancerDescription = typeof freelancer.description === 'string' ? freelancer.description : '';
  const freelancerLocation = typeof freelancer.location === 'string' && freelancer.location ? freelancer.location : '-';
  const freelancerMemberSince = freelancer.memberSince ? new Date(freelancer.memberSince).getFullYear() : '-';
  const freelancerResponseTime = typeof freelancer.responseTime === 'string' ? freelancer.responseTime : '-';
  const freelancerLanguages = Array.isArray(freelancer.languages) ? freelancer.languages : [];
  const freelancerSkills = Array.isArray(freelancer.skills) ? freelancer.skills : [];
  const freelancerId = typeof freelancer.id === 'string' ? freelancer.id : '';

  // Defensive fallback for stats
  const rating = typeof stats.rating === 'number' ? stats.rating : (typeof gigData.rating === 'number' ? gigData.rating : 0);
  const totalReviews = typeof stats.totalReviews === 'number' ? stats.totalReviews : (Array.isArray(gigData.reviews) ? gigData.reviews.length : 0);
  const totalOrders = typeof stats.totalOrders === 'number' ? stats.totalOrders : (typeof gigData.orders === 'number' ? gigData.orders : 0);

  // Defensive fallback for reviews
  const safeReviews = reviews.filter(r => r && typeof r === 'object' && r.user);

  // Defensive fallback for faqs
  const safeFaqs = faqs.filter(f => f && typeof f === 'object' && f.question);

  const safePackageKeys = ['basic', 'standard', 'premium'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gig Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link to="/browse" className="hover:text-primary">
                Browse
              </Link>
              <span>/</span>
              <span>{gigData.category}</span>
              {gigData.subcategory && <><span>/</span><span>{gigData.subcategory}</span></>}
            </div>
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{gigData.title}</h1>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">{gigData.category}</Badge>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{rating}</span>
                  <span className="text-muted-foreground">
                    ({totalReviews} reviews)
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {totalOrders} orders
                </span>
              </div>
            </div>
            {/* Image Gallery */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col items-center gap-4 p-6">
                  {/* Main Image */}
                  <div className="w-full">
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
                      <img
                        src={images[currentImageIndex]}
                        alt="Gig"
                        className="object-cover w-full h-full"
                        onError={e => (e.currentTarget.src = 'https://placehold.co/600x400')}
                      />
                    </div>
                  </div>
                  {/* Thumbnails - horizontal row */}
                  <div className="flex flex-row gap-3 mt-4 overflow-x-auto justify-center w-full">
                    {images.map((img: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setShowVideo(false);
                        }}
                        className={`w-20 h-14 rounded-lg border-2 transition-colors bg-white/40 dark:bg-black/20 shadow-sm flex-shrink-0 ${
                          index === currentImageIndex
                            ? "border-primary ring-2 ring-primary"
                            : "border-border"
                        }`}
                        style={{ outline: 'none' }}
                      >
                        <img
                          src={img}
                          alt={`thumb-${index}`}
                          className="object-cover w-full h-full rounded-lg"
                          onError={e => (e.currentTarget.src = 'https://placehold.co/120x80')}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Tabs Content */}
            <Tabs defaultValue="description" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="about">About Seller</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>About This Gig</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none dark:prose-invert">
                      <div className="whitespace-pre-line">
                        {gigData.description}
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag: string, idx: number) => (
                          <Badge key={tag || idx} variant="outline">
                            {tag || "Tag"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="about">
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-6">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={freelancerAvatar} onError={e => (e.currentTarget.src = 'https://placehold.co/60x60')} />
                        <AvatarFallback>
                          {freelancerName
                            ? freelancerName.split(" ").map((n: string) => n[0]).join("")
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold">
                            {freelancerName || ''}
                          </h3>
                          {freelancerLevel && (
                            <Badge className="bg-brand-gradient text-white">
                              {freelancerLevel}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {freelancerUsername}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{freelancerRating}</span>
                            <span className="text-muted-foreground">
                              ({freelancerTotalReviews})
                            </span>
                          </div>
                          <span className="text-muted-foreground">
                            {freelancerCompletedOrders} orders
                          </span>
                        </div>
                      </div>
                      <Button variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      {freelancerDescription}
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Info</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">From</span>
                            <span>{freelancerLocation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Member since</span>
                            <span>
                              {freelancerMemberSince}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg. response time</span>
                            <span>{freelancerResponseTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Languages</span>
                            <span>
                              {freelancerLanguages.join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {freelancerSkills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews">
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Reviews ({totalReviews})
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-bold">{rating}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {safeReviews.length === 0 && <div className="text-muted-foreground">No reviews yet.</div>}
                    {safeReviews.map((review: any, idx: number) => (
                      <div
                        key={review.id || idx}
                        className="border-b border-border pb-6 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={isValidAvatar(review.avatar) ? review.avatar : 'https://placehold.co/40x40'} onError={e => (e.currentTarget.src = 'https://placehold.co/40x40')} />
                            <AvatarFallback>
                              {review.user
                                ? review.user.split(" ").map((n: string) => n[0]).join("")
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{review.user}</h4>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <span>
                                    {review.date
                                      ? new Date(review.date).toLocaleDateString()
                                      : "-"}
                                  </span>
                                  <span>•</span>
                                  <span>{review.package}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground">
                              {review.review}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="faq">
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {safeFaqs.length === 0 && <div className="text-muted-foreground">No FAQs yet.</div>}
                    {safeFaqs.map((faq: any, index: number) => (
                      <div
                        key={faq.id || index}
                        className="border-b border-border pb-4 last:border-b-0 last:pb-0"
                      >
                        <h4 className="font-medium mb-2">{faq.question}</h4>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          {/* Right Column - Pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Package Selection */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                  <Tabs
                    value={selectedPackage}
                    onValueChange={setSelectedPackage}
                  >
                    <TabsList className="grid w-full grid-cols-3 rounded-t-lg rounded-b-none">
                      {safePackageKeys.map((key) => (
                        <TabsTrigger
                          key={key}
                          value={key}
                          className="rounded-t-lg rounded-b-none"
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {['basic', 'standard', 'premium'].map((packageType) => {
                      const pkg = packages[packageType] || {};
                      return (
                        <TabsContent
                          key={packageType}
                          value={packageType}
                          className="m-0"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-bold">
                                {pkg.name || '-'}
                              </h3>
                              <span className="text-2xl font-bold">
                                {pkg.price ? `₹${pkg.price}` : '-'}
                              </span>
                            </div>
                            <p className="text-muted-foreground mb-4">
                              {pkg.description || '-'}
                            </p>
                            <div className="flex items-center space-x-4 mb-6 text-sm">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {pkg.deliveryTime ? `${pkg.deliveryTime} day delivery` : '-'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <RotateCcw className="w-4 h-4" />
                                <span>{pkg.revisions ? `${pkg.revisions} revisions` : '-'}</span>
                              </div>
                            </div>
                            <ul className="space-y-2 mb-6">
                              {(pkg.features && pkg.features.length > 0 ? pkg.features : ['-']).map((feature: string, index: number) => (
                                <li
                                  key={feature || index}
                                  className="flex items-center space-x-2 text-sm"
                                >
                                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <GradientButton
                              className="w-full mb-3"
                              onClick={async () => {
                                // Get user/client info (assume from localStorage or context)
                                const userId = localStorage.getItem('userId');
                                if (!userId) {
                                  alert('Please log in to place an order.');
                                  return;
                                }
                                try {
                                  const res = await fetch(getApiUrl('/api/orders'), {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      client: userId,
                                      freelancer: freelancer?._id || freelancer?.id,
                                      gig: gigData._id,
                                      package: packageType,
                                      amount: pkg.price,
                                    }),
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    window.location.href = '/client/orders';
                                  } else {
                                    alert(data.message || 'Failed to place order');
                                  }
                                } catch (err) {
                                  alert('Failed to place order');
                                }
                              }}
                            >
                              {pkg.price ? `Continue (₹${pkg.price})` : 'Continue'}
                            </GradientButton>
                            <Button variant="outline" className="w-full">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Contact Seller
                            </Button>
                          </div>
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                </CardContent>
              </Card>
              {/* Seller Info Card */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={freelancerAvatar} onError={e => (e.currentTarget.src = 'https://placehold.co/60x60')} />
                      <AvatarFallback>
                        {freelancerName
                          ? freelancerName.split(" ").map((n: string) => n[0]).join("")
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{freelancerName || ''}</h4>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{freelancerRating}</span>
                        <span className="text-muted-foreground">
                          ({freelancerTotalReviews})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response time</span>
                      <span>{freelancerResponseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recent delivery</span>
                      <span>24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orders in queue</span>
                      <span>3</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  {/* View Profile button: links to freelancer profile page, robustly extracts freelancerId */}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/freelancer/profile/${freelancerId}`}>
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* Smart Recommendations */}
        <div className="mt-16">
          <SmartRecommendations
            type="both"
            currentGigId={gigData._id}
            currentCategory={gigData.category}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
