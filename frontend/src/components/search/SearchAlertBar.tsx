import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell, Bookmark, Plus, Search } from "lucide-react";

interface SearchAlertBarProps {
  searchQuery: string;
  filters: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    deliveryTime?: string;
    rating?: number;
  };
  resultsCount: number;
}

export function SearchAlertBar({
  searchQuery,
  filters,
  resultsCount,
}: SearchAlertBarProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [alertName, setAlertName] = useState("");

  const handleSaveSearch = () => {
    // In real app, save to user's saved searches
    console.log("Saving search:", { alertName, searchQuery, filters });
    setShowSaveDialog(false);
    setAlertName("");

    // Show success toast
    // toast.success("Search alert created successfully!");
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "",
  );

  const generateAlertName = () => {
    if (searchQuery) {
      return `${searchQuery} alerts`;
    }
    if (filters.category) {
      return `${filters.category} alerts`;
    }
    return "Custom search alerts";
  };

  if (!searchQuery && !hasActiveFilters) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">
              {resultsCount} results found
              {searchQuery && (
                <span className="text-muted-foreground">
                  {" "}
                  for "{searchQuery}"
                </span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              Get notified when new matches are posted
            </p>
          </div>
        </div>

        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <GradientButton size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Create Alert
            </GradientButton>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Save Search Alert</DialogTitle>
              <DialogDescription>
                We'll notify you when new gigs matching your search criteria are
                posted.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alert-name">Alert Name</Label>
                <Input
                  id="alert-name"
                  placeholder={generateAlertName()}
                  value={alertName}
                  onChange={(e) => setAlertName(e.target.value)}
                />
              </div>

              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Search Criteria</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {searchQuery && (
                    <div className="flex items-center">
                      <span className="font-medium">Keywords:</span>
                      <span className="ml-2">"{searchQuery}"</span>
                    </div>
                  )}
                  {filters.category && (
                    <div className="flex items-center">
                      <span className="font-medium">Category:</span>
                      <span className="ml-2">{filters.category}</span>
                    </div>
                  )}
                  {(filters.priceMin || filters.priceMax) && (
                    <div className="flex items-center">
                      <span className="font-medium">Price:</span>
                      <span className="ml-2">
                        {filters.priceMin && filters.priceMax
                          ? `$${filters.priceMin} - $${filters.priceMax}`
                          : filters.priceMin
                            ? `From $${filters.priceMin}`
                            : `Up to $${filters.priceMax}`}
                      </span>
                    </div>
                  )}
                  {filters.deliveryTime && (
                    <div className="flex items-center">
                      <span className="font-medium">Delivery:</span>
                      <span className="ml-2">{filters.deliveryTime}</span>
                    </div>
                  )}
                  {filters.rating && (
                    <div className="flex items-center">
                      <span className="font-medium">Rating:</span>
                      <span className="ml-2">{filters.rating}+ stars</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <GradientButton
                  onClick={handleSaveSearch}
                  className="flex-1"
                  disabled={!alertName && !searchQuery}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Alert
                </GradientButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
