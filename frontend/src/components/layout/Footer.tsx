import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold gradient-text">
                FreelanceHub
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Connecting talented freelancers with businesses worldwide. Find
              the perfect match for your project or skills.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-9 px-0">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* For Freelancers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">For Freelancers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/browse"
                  className="hover:text-primary transition-colors"
                >
                  Find Work
                </Link>
              </li>
              <li>
                <Link
                  to="/freelancer/create-gig"
                  className="hover:text-primary transition-colors"
                >
                  Create Services
                </Link>
              </li>
              <li>
                <Link
                  to="/freelancer/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  Freelancer Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="hover:text-primary transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/success-stories"
                  className="hover:text-primary transition-colors"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* For Clients */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">For Clients</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/client/post-job"
                  className="hover:text-primary transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  to="/browse"
                  className="hover:text-primary transition-colors"
                >
                  Find Talent
                </Link>
              </li>
              <li>
                <Link
                  to="/client/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/enterprise"
                  className="hover:text-primary transition-colors"
                >
                  Enterprise Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest updates on new features and opportunities.
            </p>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <GradientButton size="sm">
                  <Mail className="h-4 w-4" />
                </GradientButton>
              </div>
              <p className="text-xs text-muted-foreground">
                By subscribing you agree to our Privacy Policy
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <Link
                to="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="hover:text-primary transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                to="/accessibility"
                className="hover:text-primary transition-colors"
              >
                Accessibility
              </Link>
              <Link to="/help" className="hover:text-primary transition-colors">
                Help Center
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 FreelanceHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
