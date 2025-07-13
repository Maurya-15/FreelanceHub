import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Construction, ArrowLeft, Home } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  comingSoon?: boolean;
}

export function PlaceholderPage({
  title,
  description,
  comingSoon = true,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardContent className="p-12">
              <div className="w-20 h-20 rounded-full bg-brand-gradient flex items-center justify-center mx-auto mb-6">
                <Construction className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{title}</h1>
              <p className="text-muted-foreground text-lg mb-8">
                {description}
              </p>

              {comingSoon && (
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-8">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                  Coming Soon
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
