import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Users, Star, Briefcase } from "lucide-react";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePopularSearch = (service: string) => {
    navigate(`/browse?search=${encodeURIComponent(service)}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-brand-gradient opacity-5 animate-gradient-x"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute top-40 right-20 w-24 h-24 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-20 left-20 w-20 h-20 bg-orange-200 dark:bg-orange-800 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 mb-8">
            <Star className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="text-sm font-medium">
              Trusted by 5 lakh+ professionals across India
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find the perfect <span className="gradient-text">freelancer</span>{" "}
            for your project
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with talented Indian professionals and global experts. Get
            your projects done faster, better, and at competitive prices in ₹.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-gradient rounded-2xl opacity-20 blur-xl"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-xl border border-white/20 dark:border-gray-700/20">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What service are you looking for today?"
                      className="pl-12 h-14 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <GradientButton type="submit" size="lg" className="h-14 px-8">
                    Search
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </GradientButton>
                </div>
              </div>
            </div>
          </form>

          {/* Popular searches */}
          <div className="mb-12">
            <p className="text-muted-foreground mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Logo Design",
                "WordPress Development",
                "Hindi Voice Over",
                "Video Editing",
                "Data Entry",
                "Hindi Translation",
              ].map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePopularSearch(tag)}
                  className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <GradientButton size="lg" asChild>
              <Link to="/register" className="px-8">
                Join as Freelancer
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </GradientButton>
            <GradientButton variant="secondary" size="lg" asChild>
              <Link to="/post-job" className="px-8">
                Post a Job
                <Briefcase className="ml-2 h-5 w-5" />
              </Link>
            </GradientButton>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
