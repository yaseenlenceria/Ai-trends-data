import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, Search, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-12 text-center">
          <div className="mb-6">
            <AlertTriangle className="w-20 h-20 text-primary mx-auto mb-4 opacity-50" />
            <h1 className="font-mono font-bold text-6xl md:text-8xl mb-4 text-primary">
              404
            </h1>
            <h2 className="font-mono font-bold text-2xl md:text-3xl mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="gap-2">
                <Search className="w-4 h-4" />
                Browse Tools
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
