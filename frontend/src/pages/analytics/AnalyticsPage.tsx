import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export default function AnalyticsPage() {
  // In a real app, this would come from user context/auth
  const userType = "freelancer"; // or "client"
  const userId = "USER-001";

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <AnalyticsDashboard userType={userType} userId={userId} />
      </main>

      <Footer />
    </div>
  );
}
