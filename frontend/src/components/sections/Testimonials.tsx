import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Marketing Director",
    company: "TechStart India",
    avatar: "/api/placeholder/40/40",
    rating: 5,
    content:
      "FreelanceHub helped us find an amazing designer from Bangalore who completely transformed our brand. The process was smooth and payments in ₹ made it very convenient.",
  },
  {
    name: "Rahul Kumar",
    role: "Freelance Developer",
    company: "Independent, Delhi",
    avatar: "/api/placeholder/40/40",
    rating: 5,
    content:
      "As a freelancer from Delhi, FreelanceHub has been game-changing. I've found consistent projects from Indian startups and the UPI payments are instant.",
  },
  {
    name: "Anjali Patel",
    role: "Startup Founder",
    company: "EcoTech Mumbai",
    avatar: "/api/placeholder/40/40",
    rating: 5,
    content:
      "We built our entire development team through FreelanceHub. The Indian talent pool is incredible and we've saved lakhs compared to traditional hiring agencies.",
  },
  {
    name: "Arjun Singh",
    role: "Creative Director",
    company: "Digital Agency, Pune",
    avatar: "/api/placeholder/40/40",
    rating: 5,
    content:
      "The variety of creative talent available from across India is outstanding. We've completed multiple projects and each experience was excellent.",
  },
  {
    name: "Shreya Gupta",
    role: "Content Manager",
    company: "E-commerce Startup",
    avatar: "/api/placeholder/40/40",
    rating: 5,
    content:
      "Finding quality Hindi and English content writers used to be challenging. FreelanceHub solved that completely with talented writers from across India.",
  },
  {
    name: "Vikash Agarwal",
    role: "Freelance Designer",
    company: "Independent, Hyderabad",
    avatar: "/api/placeholder/40/40",
    rating: 5,
    content:
      "The platform is intuitive and client quality is top-notch. I've grown my freelance business significantly and earning in ₹ directly to my bank account is great.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What our <span className="gradient-text">community</span> says
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied freelancers and clients who have found
            success on our platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 floating-card"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-primary/20 mb-2" />
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-brand-gradient text-white">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              50K+
            </div>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              100K+
            </div>
            <p className="text-muted-foreground">Projects Completed</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              4.9★
            </div>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              98%
            </div>
            <p className="text-muted-foreground">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
