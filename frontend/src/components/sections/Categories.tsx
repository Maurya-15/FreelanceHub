import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Palette,
  Code,
  PenTool,
  Camera,
  Megaphone,
  BarChart3,
  Music,
  Globe,
  Video,
  Smartphone,
  Database,
  HeadphonesIcon,
} from "lucide-react";

const categories = [
  {
    name: "Design & Creative",
    icon: Palette,
    count: "12,450+",
    color: "from-pink-500 to-rose-500",
    description: "Logo, UI/UX, Graphics",
  },
  {
    name: "Development & IT",
    icon: Code,
    count: "8,720+",
    color: "from-blue-500 to-cyan-500",
    description: "Web, Mobile, Software",
  },
  {
    name: "Writing & Translation",
    icon: PenTool,
    count: "6,340+",
    color: "from-emerald-500 to-teal-500",
    description: "Content, Copywriting, SEO",
  },
  {
    name: "Video & Animation",
    icon: Video,
    count: "4,200+",
    color: "from-purple-500 to-violet-500",
    description: "Video Editing, Motion Graphics",
  },
  {
    name: "Digital Marketing",
    icon: Megaphone,
    count: "9,150+",
    color: "from-orange-500 to-amber-500",
    description: "SEO, Social Media, Ads",
  },
  {
    name: "Data & Analytics",
    icon: BarChart3,
    count: "3,680+",
    color: "from-indigo-500 to-blue-500",
    description: "Data Analysis, Visualization",
  },
  {
    name: "Music & Audio",
    icon: HeadphonesIcon,
    count: "2,840+",
    color: "from-red-500 to-pink-500",
    description: "Voice Over, Audio Editing",
  },
  {
    name: "Photography",
    icon: Camera,
    count: "3,120+",
    color: "from-slate-500 to-gray-500",
    description: "Photo Editing, Retouching",
  },
];

export function Categories() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Explore by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover talented freelancers across various categories and find the
            perfect match for your project needs.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to={`/browse?category=${category.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                className="group"
              >
                <Card className="h-full border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 floating-card">
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} p-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">
                        {category.count} services
                      </span>
                      <div className="w-6 h-6 rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 flex items-center justify-center">
                        <span className="text-xs">→</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/browse"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-background border border-border hover:border-primary hover:text-primary transition-colors group"
          >
            View All Categories
            <span className="ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
