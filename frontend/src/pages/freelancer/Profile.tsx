import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useFreelancerProfile from "@/hooks/useFreelancerProfile";
import { useParams } from "react-router-dom";
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

export default function FreelancerProfile() {
  const { userId } = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const freelancerId = userId || user?._id;
  const { profile, loading, error } = useFreelancerProfile(freelancerId);
  const isOwnProfile = userId === undefined || (profile && profile._id === user?._id);
  const [activeTab, setActiveTab] = React.useState("overview");

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">No profile data found.</div>;
  }

  
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

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* Cover Photo / Banner */}
        <div className="relative h-64">
          {profile.coverPhoto ? (
            <img
              src={profile.coverPhoto}
              alt="Banner"
              className="w-full h-full object-cover rounded-b-2xl"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-start pt-12 rounded-b-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-7xl font-bold">
              {profile.name?.[0] || "?"}
            </div>
          )}
        </div>

        {/* Profile Header */}
        <div className="relative">
          <div className="container mx-auto px-4">
            <div className="relative -mt-32 pb-8">
              <div className="bg-card rounded-2xl p-8 shadow-lg border">
                <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback>
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {profile.isOnline && (
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h1 className="text-3xl font-bold">
                            {profile.name}
                          </h1>
                          <Badge className="bg-brand-gradient text-white">
                            {profile.level}
                          </Badge>
                          {profile.isProVerified && (
                            <Badge variant="outline">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Pro Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xl text-muted-foreground mb-2">
                          {profile.title}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {profile.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Member since{" "}
                            {profile.joinDate && !isNaN(new Date(profile.joinDate).getTime())
                              ? formatDate(profile.joinDate)
                              : profile.createdAt && !isNaN(new Date(profile.createdAt).getTime())
                                ? formatDate(profile.createdAt)
                                : "--"}
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
                              <Link to="/freelancer/edit-profile">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8" /></svg>
                                Edit Profile
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
                                to={profile?.username ? `/messages/${profile.username.slice(1)}` : '#'}
                                onClick={e => { if (!profile?.username) e.preventDefault(); }}
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
                            {profile.stats?.rating ?? '--'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          ({profile.stats?.totalReviews ?? '--'} reviews)
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">
                          {profile.stats?.totalOrders ?? '--'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Orders Completed
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">
                          {profile.stats?.responseTime ?? '--'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Avg. Response
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">
                          {profile.stats?.onTimeDelivery ?? '--'}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          On-time Delivery
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">
                          {profile.stats?.repeatClients ?? '--'}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Repeat Clients
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {profile.overview}
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
                    Gigs ({profile.gigs?.length ?? 0})
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    Reviews ({profile.stats?.totalReviews ?? '--'})
                  </TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio ({profile.portfolio?.length ?? 0})</TabsTrigger>
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
                          {(profile.skills ?? []).map((skill) => (
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
                          {(profile.languages ?? []).map((lang) => (
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
                          {(profile.education ?? []).map((edu, index) => (
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
                    {(profile.gigs ?? []).map((gig) => (
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
                        Reviews ({profile.stats?.totalReviews ?? '--'})
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {profile.stats?.rating ?? '--'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {(profile.reviews ?? []).map((review) => (
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
                    {(profile.portfolio ?? []).map((item) => (
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
                          {profile.overview}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Languages Card */}
                    {profile.languages && profile.languages.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Languages className="w-5 h-5 mr-2" />
                            Languages
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {profile.languages.map((lang: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="font-medium">{lang.name}</span>
                                <span className="text-muted-foreground text-sm">{lang.level}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Award className="w-5 h-5 mr-2" />
                          Certifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {(profile.certifications ?? []).map(
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
                              {profile.stats?.totalOrders ?? '--'}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Total Orders
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-2xl mb-1">
                              {profile.stats?.onTimeDelivery ?? '--'}%
                            </div>
                            <p className="text-sm text-muted-foreground">
                              On-time Delivery
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-2xl mb-1">
                              {profile.stats?.responseTime ?? '--'}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Response Time
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-2xl mb-1">
                              {profile.stats?.repeatClients ?? '--'}%
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
