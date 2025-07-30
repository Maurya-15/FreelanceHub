import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  Search,
  MessageSquare,
  CreditCard,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find the Right Talent",
    description:
      "Browse through thousands of verified Indian and global freelancers or post your project and let them come to you.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: MessageSquare,
    title: "Communicate & Negotiate",
    description:
      "Chat directly with freelancers in English, Hindi or your preferred language. Discuss project details and agree on terms.",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: CreditCard,
    title: "Secure Payment in ₹",
    description:
      "Pay securely in Indian Rupees through UPI, Net Banking, or Cards. Funds are held safely until you're satisfied.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: CheckCircle,
    title: "Get Your Project Done",
    description:
      "Review the completed work, request revisions if needed, and release payment when you're happy with the results.",
    color: "from-orange-500 to-amber-500",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How <span className="gradient-text">FreelanceHub</span> works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Getting started is simple. Follow these four easy steps to connect
            with talented Indian and global freelancers to get your project
            completed.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="h-full border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 floating-card">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-4 mx-auto mb-4`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-gradient text-white text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Two Column CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Freelancers */}
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">For Freelancers</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join our community of talented Indian professionals and start
                earning from your skills. Create your profile, showcase your
                work, and connect with clients from India and worldwide.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Access to Indian & global client base
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Secure payments in ₹ via UPI/Net Banking
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  24/7 customer support in Hindi & English
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Professional growth & skill development
                </li>
              </ul>
              <GradientButton className="w-full" asChild>
                <Link to="/register">
                  Start Freelancing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </GradientButton>
            </CardContent>
          </Card>

          {/* For Clients */}
          <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">For Clients</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Find the perfect freelancer for your project. Browse portfolios,
                read reviews, and hire with confidence. From small tasks to
                large projects, competitive rates in ₹.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Verified Indian & global freelancers
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  100% money-back guarantee
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Project management & milestone tracking
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Unlimited revisions until satisfied
                </li>
              </ul>
              <GradientButton variant="secondary" className="w-full" asChild>
                <Link to="/client/post-job">
                  Post a Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </GradientButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
