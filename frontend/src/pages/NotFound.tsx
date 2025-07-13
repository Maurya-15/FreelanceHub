import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-xl mx-auto border-0 bg-card/70 shadow-lg">
        <CardContent className="p-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Sorry, the page or gig you are looking for does not exist or has been removed.
          </p>
          <Button asChild className="w-full max-w-xs mx-auto">
            <Link to="/browse">Return to Browse</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
