import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useFreelancerProfile from "@/hooks/useFreelancerProfile";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
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
  const freelancerId = userId || user?.id || user?._id;
  const { profile, loading, error } = useFreelancerProfile(freelancerId);
  const isOwnProfile = userId === undefined || (profile && profile._id === user?.id);
  const [activeTab, setActiveTab] = React.useState("overview");

  // Create fallback profile data if API fails
  const fallbackProfile = {
    _id: user?.id || 'unknown',
    name: user?.name || 'Freelancer',
    title: user?.title || 'Professional Freelancer',
    avatar: user?.avatar,
    coverPhoto: null,
    location: 'Remote',
    memberSince: user?.joinDate || new Date().toISOString(),
    isOnline: true,
    lastSeen: new Date().toISOString(),
    level: 'Level 1',
    isProVerified: false,
    stats: {
      rating: 0,
      totalReviews: 0,
      totalOrders: 0,
      responseTime: '--',
      onTimeDelivery: 0,
      repeatClients: 0,
    },
    overview: 'Professional freelancer with expertise in various domains.',
    skills: ['Web Development', 'Design', 'Writing'],
    languages: [{ name: 'English', level: 'Native' }],
    education: [],
    certifications: [],
    gigs: [],
    portfolio: [],
    reviews: [],
  };

  // Get saved profile from localStorage
  const getSavedProfile = () => {
    try {
      const saved = localStorage.getItem('freelancerProfile');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.log('Error reading saved profile:', err);
      return null;
    }
  };

  // Use saved profile, then API profile, then fallback profile
  const savedProfile = getSavedProfile();
  const displayProfile = savedProfile || profile || fallbackProfile;

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;
  }
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
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
      <main>
                 {/* Cover Photo / Banner */}
         <div className="relative h-64">
           {displayProfile.coverPhoto ? (
             <img
               src={displayProfile.coverPhoto}
               alt="Banner"
               className="w-full h-full object-cover"
             />
           ) : (
             <div className="w-full h-full flex justify-center items-start pt-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-7xl font-bold">
               {displayProfile.name?.[0] || "?"}
             </div>
           )}
         </div>

         {/* Profile Header */}
         <div className="relative">
           <div className="container mx-auto px-4">
             <div className="relative -mt-8 pb-8">
              <div className="bg-card rounded-2xl p-8 shadow-lg border">
                <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage src={displayProfile.avatar} />
                      <AvatarFallback>
                        {displayProfile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {displayProfile.isOnline && (
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h1 className="text-3xl font-bold">
                            {displayProfile.name}
                          </h1>
                          <Badge className="bg-brand-gradient text-white">
                            {displayProfile.level}
                          </Badge>
                          {displayProfile.isProVerified && (
                            <Badge variant="outline">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Pro Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xl text-muted-foreground mb-2">
                          {displayProfile.title}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {displayProfile.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Member since{" "}
                            {displayProfile.joinDate && !isNaN(new Date(displayProfile.joinDate).getTime())
                              ? formatDate(displayProfile.joinDate)
                              : displayProfile.createdAt && !isNaN(new Date(displayProfile.createdAt).getTime())
                                ? formatDate(displayProfile.createdAt)
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
                                to={displayProfile?.username ? `/messages/${displayProfile.username.slice(1)}` : '#'}
                                onClick={e => { if (!displayProfile?.username) e.preventDefault(); }}
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
                            {displayProfile.stats?.rating ?? '--'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          ({displayProfile.stats?.totalReviews ?? '--'} reviews)
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">
                          {displayProfile.stats?.totalOrders ?? '--'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Orders Completed
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">
                          {displayProfile.stats?.responseTime ?? '--'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Avg. Response
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">
                          {displayProfile.stats?.onTimeDelivery ?? '--'}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          On-time Delivery
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">
                          {displayProfile.stats?.repeatClients ?? '--'}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Repeat Clients
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {displayProfile.overview}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                             <Tabs value={activeTab} onValueChange={setActiveTab}>
                 <TabsList className="grid w-full grid-cols-3">
                   <TabsTrigger value="overview">Overview</TabsTrigger>
                   <TabsTrigger value="gigs">
                     Gigs ({displayProfile.gigs?.length ?? 0})
                   </TabsTrigger>
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
                          {(displayProfile.skills ?? []).map((skill) => (
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
                          {(displayProfile.languages ?? []).map((lang) => (
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
                          {(displayProfile.education ?? []).map((edu, index) => (
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
                   <div className="space-y-6">
                     <div className="flex items-center justify-between">
                       <h3 className="text-lg font-semibold">
                         My Gigs ({displayProfile.gigs?.length ?? 0})
                       </h3>
                       {isOwnProfile && (
                         <Button asChild>
                           <Link to="/freelancer/create-gig">
                             <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                             </svg>
                             Create New Gig
                           </Link>
                         </Button>
                       )}
                     </div>
                     
                     {displayProfile.gigs && displayProfile.gigs.length > 0 ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {displayProfile.gigs.map((gig) => (
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
                                   {gig.image && (
                                     <img 
                                       src={gig.image} 
                                       alt={gig.title}
                                       className="w-full h-full object-cover"
                                     />
                                   )}
                                 </div>
                                 <div className="p-4">
                                   <h3 className="font-medium mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                     {gig.title}
                                   </h3>
                                   <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                     {gig.description}
                                   </p>

                                 </div>
                               </Link>
                             </CardContent>
                           </Card>
                         ))}
                       </div>
                     ) : (
                       <Card>
                         <CardContent className="p-8 text-center">
                           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                             </svg>
                           </div>
                           <h3 className="text-lg font-semibold mb-2">No Gigs Yet</h3>
                           <p className="text-muted-foreground mb-4">
                             {isOwnProfile 
                               ? "Start creating your first gig to showcase your services"
                               : "This freelancer hasn't created any gigs yet"
                             }
                           </p>
                           {isOwnProfile && (
                             <Button asChild>
                               <Link to="/freelancer/create-gig">
                                 Create Your First Gig
                               </Link>
                             </Button>
                           )}
                         </CardContent>
                       </Card>
                     )}
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
                          {displayProfile.overview}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Languages Card */}
                    {displayProfile.languages && displayProfile.languages.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Languages className="w-5 h-5 mr-2" />
                            Languages
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {displayProfile.languages.map((lang: any, idx: number) => (
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
                          {(displayProfile.certifications ?? []).map(
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
                              {displayProfile.stats?.totalOrders ?? '--'}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Total Orders
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-2xl mb-1">
                              {displayProfile.stats?.onTimeDelivery ?? '--'}%
                            </div>
                            <p className="text-sm text-muted-foreground">
                              On-time Delivery
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-2xl mb-1">
                              {displayProfile.stats?.responseTime ?? '--'}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Response Time
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-2xl mb-1">
                              {displayProfile.stats?.repeatClients ?? '--'}%
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
    </div>
  );
}
