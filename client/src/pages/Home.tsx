import { ArrowRight, TrendingUp, Sparkles, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ToolCard from "@/components/ToolCard";
import CategoryCard from "@/components/CategoryCard";
import SponsorCard from "@/components/SponsorCard";
import { useData } from "@/context/DataContext";
import heroImage from "@assets/generated_images/Hero_dashboard_visualization_106dee3b.png";

export default function Home() {
  const { getTrendingTools, getFastestRisingTools, categories, sponsors } = useData();
  
  const trendingTools = getTrendingTools().slice(0, 3);
  const fastestRising = getFastestRisingTools().slice(0, 3);

  return (
    <div className="pb-24 md:pb-8">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted">
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
            <h1 className="font-mono font-bold text-4xl md:text-6xl mb-6 leading-tight" data-testid="text-hero-title">
              Discover the Best New AI Tools
              <br />
              <span className="text-primary">Updated Daily</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The most comprehensive leaderboard of AI tools, ranked by real usage data and trends. Find the perfect AI solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/submit">
                <Button size="lg" className="gap-2" data-testid="button-submit-tool-hero">
                  Submit Your Tool
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" data-testid="button-browse-tools">
                  Browse All Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="font-mono font-bold text-3xl">Trending Today</h2>
          </div>
          <Link href="/search?filter=trending" className="text-primary hover:underline font-medium" data-testid="link-view-all-trending">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="font-mono font-bold text-3xl">Fastest Rising</h2>
          </div>
          <Link href="/search?filter=rising" className="text-primary hover:underline font-medium" data-testid="link-view-all-rising">
            View All
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
