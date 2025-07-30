import React from "react";
import { Footer } from "@/components/layout/Footer";
import { SavedSearches } from "@/components/search/SavedSearches";

export default function SavedSearchesPage() {
  // In a real app, this would come from user context/auth
  const userType = "client"; // or "freelancer"

  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-8">
        <SavedSearches userType={userType} />
      </main>

      <Footer />
    </div>
  );
}
