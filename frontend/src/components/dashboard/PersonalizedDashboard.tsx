import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  Sparkles,
  Users,
  Target,
  Clock,
  Star,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
} from "lucide-react";

interface PersonalizedInsight {
  id: string;
  type: "opportunity" | "improvement" | "trend" | "achievement";
  title: string;
  description: string;
  actionText: string;
  actionUrl: string;
  priority: "high" | "medium" | "low";
  icon: React.ReactNode;
}

interface PersonalizedDashboardProps {
  userType: "client" | "freelancer";
  userId: string;
}

// Mock AI-generated insights
const freelancerInsights: PersonalizedInsight[] = [
  {
    id: "INSIGHT-001",
    type: "opportunity",
    title: "High Demand for Your Skills",
    description:
      "UI/UX design gigs are up 40% this week. Create a mobile design gig to capture this demand.",
    actionText: "Create Mobile Design Gig",
    actionUrl: "/freelancer/create-gig",
    priority: "high",
    icon: <TrendingUp className="w-5 h-5 text-green-600" />,
  },
  {
    id: "INSIGHT-002",
    type: "improvement",
    title: "Boost Your Profile Views",
    description:
      "Adding 2-3 more skills could increase your profile visibility by 35%.",
    actionText: "Update Skills",
    actionUrl: "/freelancer/profile/edit",
    priority: "medium",
    icon: <Target className="w-5 h-5 text-blue-600" />,
  },
  {
    id: "INSIGHT-003",
    type: "trend",
    title: "Emerging Technology Trend",
    description:
      "AI/ML design projects are trending. Consider adding these skills to stay competitive.",
    actionText: "Explore AI Design",
    actionUrl: "/browse?category=ai-design",
    priority: "medium",
    icon: <Sparkles className="w-5 h-5 text-purple-600" />,
  },
  {
    id: "INSIGHT-004",
    type: "achievement",
    title: "Congratulations!",
    description:
      "You've maintained a 4.9+ rating for 3 months. You're eligible for Top Rated status!",
    actionText: "Apply for Top Rated",
    actionUrl: "/freelancer/apply-top-rated",
    priority: "high",
    icon: <Award className="w-5 h-5 text-yellow-600" />,
  },
];

const clientInsights: PersonalizedInsight[] = [
  {
    id: "INSIGHT-001",
    type: "opportunity",
    title: "Perfect Match Found",
    description:
      "3 freelancers specializing in your industry just joined. They match your project requirements.",
    actionText: "View Matches",
    actionUrl: "/browse?recommended=true",
    priority: "high",
    icon: <Users className="w-5 h-5 text-green-600" />,
  },
  {
    id: "INSIGHT-002",
    type: "improvement",
    title: "Optimize Your Job Posts",
    description:
      "Jobs with detailed requirements get 60% more quality proposals. Add more details to your next post.",
    actionText: "Post Detailed Job",
    actionUrl: "/post-job",
    priority: "medium",
    icon: <BookOpen className="w-5 h-5 text-blue-600" />,
  },
  {
    id: "INSIGHT-003",
    type: "trend",
    title: "Budget Sweet Spot",
    description:
      "Projects in your typical range (₹10000-₹25000) are completing 25% faster this month.",
    actionText: "Post New Project",
    actionUrl: "/post-job",
    priority: "low",
    icon: <Zap className="w-5 h-5 text-orange-600" />,
  },
];

export function PersonalizedDashboard({
  userType,
  userId,
}: PersonalizedDashboardProps) {
  const insights =
    userType === "freelancer" ? freelancerInsights : clientInsights;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            High Priority
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            Medium Priority
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Low Priority
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-primary" />
          AI-Powered Insights
          <Badge variant="outline" className="ml-2 text-xs">
            Personalized for you
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border-l-4 bg-muted/30 ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">{insight.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      {getPriorityBadge(insight.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={insight.actionUrl}>
                        {insight.actionText}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">
                Weekly AI Performance Report
              </h4>
              <p className="text-sm text-muted-foreground">
                Get detailed insights about your{" "}
                {userType === "freelancer" ? "gigs" : "hiring"} performance and
                optimization tips.
              </p>
            </div>
            <Button variant="outline" size="sm">
              View Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
