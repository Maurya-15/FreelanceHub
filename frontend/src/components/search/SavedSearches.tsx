import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Search,
  Plus,
  Edit3,
  Trash2,
  Mail,
  Smartphone,
  Clock,
  Filter,
  Bookmark,
} from "lucide-react";

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    deliveryTime?: string;
    rating?: number;
    location?: string;
  };
  alertsEnabled: boolean;
  alertFrequency: "instant" | "daily" | "weekly";
  alertMethods: ("email" | "push" | "sms")[];
  createdAt: string;
  lastTriggered?: string;
  newResults: number;
}

// Mock saved searches
const mockSavedSearches: SavedSearch[] = [
  {
    id: "SEARCH-001",
    name: "UI/UX Design Gigs",
    query: "UI UX design mobile app",
    filters: {
      category: "Design & Creative",
      priceMin: 500,
      priceMax: 2000,
      deliveryTime: "7 days",
      rating: 4.5,
    },
    alertsEnabled: true,
    alertFrequency: "daily",
    alertMethods: ["email", "push"],
    createdAt: "2024-01-10T10:00:00Z",
    lastTriggered: "2024-01-14T08:00:00Z",
    newResults: 3,
  },
  {
    id: "SEARCH-002",
    name: "Logo Design Under ₹3000",
    query: "logo design branding",
    filters: {
      category: "Design & Creative",
      priceMax: 300,
      rating: 4.0,
    },
    alertsEnabled: true,
    alertFrequency: "instant",
    alertMethods: ["email"],
    createdAt: "2024-01-08T15:30:00Z",
    lastTriggered: "2024-01-13T16:45:00Z",
    newResults: 1,
  },
  {
    id: "SEARCH-003",
    name: "React Developers",
    query: "React development frontend",
    filters: {
      category: "Development & IT",
      priceMin: 1000,
      deliveryTime: "14 days",
    },
    alertsEnabled: false,
    alertFrequency: "weekly",
    alertMethods: ["email"],
    createdAt: "2024-01-05T12:00:00Z",
    newResults: 0,
  },
];

interface SavedSearchesProps {
  userType: "client" | "freelancer";
}

export function SavedSearches({ userType }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] =
    useState<SavedSearch[]>(mockSavedSearches);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null);
  const [newSearchData, setNewSearchData] = useState({
    name: "",
    query: "",
    category: "",
    priceMin: "",
    priceMax: "",
    deliveryTime: "",
    rating: "",
    alertsEnabled: true,
    alertFrequency: "daily" as const,
    alertMethods: ["email"] as ("email" | "push" | "sms")[],
  });

  const handleCreateSearch = () => {
    const newSearch: SavedSearch = {
      id: `SEARCH-${Date.now()}`,
      name: newSearchData.name,
      query: newSearchData.query,
      filters: {
        category: newSearchData.category || undefined,
        priceMin: newSearchData.priceMin
          ? Number(newSearchData.priceMin)
          : undefined,
        priceMax: newSearchData.priceMax
          ? Number(newSearchData.priceMax)
          : undefined,
        deliveryTime: newSearchData.deliveryTime || undefined,
        rating: newSearchData.rating ? Number(newSearchData.rating) : undefined,
      },
      alertsEnabled: newSearchData.alertsEnabled,
      alertFrequency: newSearchData.alertFrequency,
      alertMethods: newSearchData.alertMethods,
      createdAt: new Date().toISOString(),
      newResults: 0,
    };

    setSavedSearches((prev) => [newSearch, ...prev]);
    setShowCreateDialog(false);
    resetNewSearchData();
  };

  const resetNewSearchData = () => {
    setNewSearchData({
      name: "",
      query: "",
      category: "",
      priceMin: "",
      priceMax: "",
      deliveryTime: "",
      rating: "",
      alertsEnabled: true,
      alertFrequency: "daily",
      alertMethods: ["email"],
    });
  };

  const handleDeleteSearch = (searchId: string) => {
    setSavedSearches((prev) => prev.filter((search) => search.id !== searchId));
  };

  const toggleAlerts = (searchId: string) => {
    setSavedSearches((prev) =>
      prev.map((search) =>
        search.id === searchId
          ? { ...search, alertsEnabled: !search.alertsEnabled }
          : search,
      ),
    );
  };

  const formatFilters = (filters: SavedSearch["filters"]) => {
    const parts = [];
    if (filters.category) parts.push(filters.category);
    if (filters.priceMin || filters.priceMax) {
      if (filters.priceMin && filters.priceMax) {
        parts.push(`$${filters.priceMin}-$${filters.priceMax}`);
      } else if (filters.priceMin) {
        parts.push(`>$${filters.priceMin}`);
      } else if (filters.priceMax) {
        parts.push(`<$${filters.priceMax}`);
      }
    }
    if (filters.deliveryTime) parts.push(`${filters.deliveryTime} delivery`);
    if (filters.rating) parts.push(`${filters.rating}+ rating`);
    return parts;
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case "instant":
        return <Bell className="w-3 h-3" />;
      case "daily":
        return <Clock className="w-3 h-3" />;
      case "weekly":
        return <Calendar className="w-3 h-3" />;
      default:
        return <Bell className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Saved Searches & Alerts</h2>
          <p className="text-muted-foreground">
            Never miss the perfect{" "}
            {userType === "client" ? "freelancer" : "opportunity"}
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <GradientButton>
              <Plus className="w-4 h-4 mr-2" />
              Create Alert
            </GradientButton>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Search Alert</DialogTitle>
              <DialogDescription>
                Set up an alert to be notified when new{" "}
                {userType === "client" ? "freelancers" : "gigs"} match your
                criteria.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-name">Alert Name</Label>
                <Input
                  id="search-name"
                  placeholder="e.g., UI/UX Designers"
                  value={newSearchData.name}
                  onChange={(e) =>
                    setNewSearchData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="search-query">Search Keywords</Label>
                <Input
                  id="search-query"
                  placeholder="e.g., logo design branding"
                  value={newSearchData.query}
                  onChange={(e) =>
                    setNewSearchData((prev) => ({
                      ...prev,
                      query: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Price ($)</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={newSearchData.priceMin}
                    onChange={(e) =>
                      setNewSearchData((prev) => ({
                        ...prev,
                        priceMin: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Price ($)</Label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={newSearchData.priceMax}
                    onChange={(e) =>
                      setNewSearchData((prev) => ({
                        ...prev,
                        priceMax: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Alert Frequency</Label>
                <Select
                  value={newSearchData.alertFrequency}
                  onValueChange={(value: "instant" | "daily" | "weekly") =>
                    setNewSearchData((prev) => ({
                      ...prev,
                      alertFrequency: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-alerts"
                  checked={newSearchData.alertsEnabled}
                  onCheckedChange={(checked) =>
                    setNewSearchData((prev) => ({
                      ...prev,
                      alertsEnabled: checked,
                    }))
                  }
                />
                <Label htmlFor="enable-alerts">Enable email alerts</Label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <GradientButton
                  onClick={handleCreateSearch}
                  className="flex-1"
                  disabled={!newSearchData.name || !newSearchData.query}
                >
                  Create Alert
                </GradientButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Saved Searches List */}
      <div className="grid grid-cols-1 gap-4">
        {savedSearches.map((search) => (
          <Card
            key={search.id}
            className="border-0 bg-card/50 backdrop-blur-sm floating-card"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">{search.name}</h3>
                    {search.alertsEnabled && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <Bell className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                    {search.newResults > 0 && (
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                        {search.newResults} New
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      "{search.query}"
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {formatFilters(search.filters).map((filter, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Filter className="w-3 h-3 mr-1" />
                        {filter}
                      </Badge>
                    ))}
                  </div>

                  {search.alertsEnabled && (
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        {getFrequencyIcon(search.alertFrequency)}
                        <span>{search.alertFrequency}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {search.alertMethods.includes("email") && (
                          <Mail className="w-3 h-3" />
                        )}
                        {search.alertMethods.includes("push") && (
                          <Bell className="w-3 h-3" />
                        )}
                        {search.alertMethods.includes("sms") && (
                          <Smartphone className="w-3 h-3" />
                        )}
                      </div>
                      {search.lastTriggered && (
                        <span>
                          Last:{" "}
                          {new Date(search.lastTriggered).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAlerts(search.id)}
                  >
                    {search.alertsEnabled ? (
                      <>
                        <Bell className="w-3 h-3 mr-1" />
                        Enabled
                      </>
                    ) : (
                      <>
                        <Bell className="w-3 h-3 mr-1" />
                        Disabled
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSearch(search.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {savedSearches.length === 0 && (
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No saved searches yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first search alert to get notified about new{" "}
              {userType === "client" ? "freelancers" : "opportunities"} that
              match your criteria.
            </p>
            <GradientButton onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Alert
            </GradientButton>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
