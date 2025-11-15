import { ArrowRight, TrendingUp, Sparkles, Grid3x3, Rocket, Users, BarChart3, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import ToolCard from "@/components/ToolCard";
import CategoryCard from "@/components/CategoryCard";
import SponsorCard from "@/components/SponsorCard";
import { useData } from "@/context/DataContext";
import heroImage from "@assets/generated_images/Hero_dashboard_visualization_106dee3b.png";

export default function Home() {
  const { getTrendingTools, getFastestRisingTools, getNewTools, categories, sponsors, tools, isLoading } = useData();

  const trendingTools = getTrendingTools().slice(0, 6);
  const fastestRising = getFastestRisingTools().slice(0, 6);
  const newTools = getNewTools().slice(0, 6);
  const totalTools = tools.length;
  const totalCategories = categories.length;

  if (isLoading) {
    return (
      <div className="pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-24">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted border-b">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Discover {totalTools}+ AI Tools</span>
            </div>
            <h1 className="font-mono font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight" data-testid="text-hero-title">
              Discover the Best
              <br />
              <span className="text-primary">AI Tools</span> Daily
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The most comprehensive directory of AI tools, ranked by real usage data and community votes. Find the perfect AI solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <Button size="lg" className="gap-2" data-testid="button-browse-tools">
                  <Rocket className="w-4 h-4" />
                  Browse All Tools
                </Button>
              </Link>
              <Link href="/submit">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-submit-tool-hero">
                  Submit Your Tool
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div className="font-mono font-bold text-3xl md:text-4xl mb-1">{totalTools}+</div>
            <p className="text-sm text-muted-foreground">AI Tools</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <Grid3x3 className="w-8 h-8 text-primary" />
            </div>
            <div className="font-mono font-bold text-3xl md:text-4xl mb-1">{totalCategories}</div>
            <p className="text-sm text-muted-foreground">Categories</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="font-mono font-bold text-3xl md:text-4xl mb-1">500K+</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <div className="font-mono font-bold text-3xl md:text-4xl mb-1">Daily</div>
            <p className="text-sm text-muted-foreground">Updates</p>
          </Card>
        </div>
      </section>

      {/* Trending Tools */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            <div>
              <h2 className="font-mono font-bold text-3xl">Trending Today</h2>
              <p className="text-sm text-muted-foreground">Most popular tools right now</p>
            </div>
          </div>
          <Link href="/search?filter=trending" className="text-primary hover:underline font-medium flex items-center gap-1" data-testid="link-view-all-trending">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      {/* New Tools */}
      {newTools.length > 0 && (
        <section className="container mx-auto px-4 py-16 bg-muted/30">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-primary" />
              <div>
                <h2 className="font-mono font-bold text-3xl">New Arrivals</h2>
                <p className="text-sm text-muted-foreground">Recently added to the directory</p>
              </div>
            </div>
            <Link href="/search?filter=new" className="text-primary hover:underline font-medium flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </section>
      )}

      {/* Fastest Rising */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <div>
              <h2 className="font-mono font-bold text-3xl">Fastest Rising</h2>
              <p className="text-sm text-muted-foreground">Tools gaining momentum</p>
            </div>
          </div>
          <Link href="/search?filter=rising" className="text-primary hover:underline font-medium flex items-center gap-1" data-testid="link-view-all-rising">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fastestRising.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Grid3x3 className="w-6 h-6 text-primary" />
            <h2 className="font-mono font-bold text-3xl">Categories</h2>
          </div>
          <Link href="/categories" className="text-primary hover:underline font-medium" data-testid="link-view-all-categories">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              {...category}
              gradient="bg-gradient-to-br from-card to-card"
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="font-mono font-bold text-3xl mb-2">Featured Sponsors</h2>
          <p className="text-muted-foreground">
            Companies supporting the AI tools community
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sponsors.map((sponsor) => (
            <SponsorCard key={sponsor.id} {...sponsor} />
          ))}
        </div>
        <div className="text-center">
          <Link href="/sponsors">
            <Button variant="outline" data-testid="button-become-sponsor">
              Become a Sponsor
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
