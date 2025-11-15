import { ArrowRight, TrendingUp, Sparkles, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ToolCard from "@/components/ToolCard";
import CategoryCard from "@/components/CategoryCard";
import SponsorCard from "@/components/SponsorCard";
import { MessageSquare, Image, Video, Code, Mic, FileText, Database, Zap } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_dashboard_visualization_106dee3b.png";

export default function Home() {
  const trendingTools = [
    {
      id: "chatgpt",
      name: "ChatGPT",
      tagline: "Conversational AI that understands and generates human-like text",
      logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
      category: "AI Assistant",
      upvotes: 1247,
      views: 45632,
      trendPercentage: 24.5,
    },
    {
      id: "midjourney",
      name: "Midjourney",
      tagline: "AI art generator creating stunning images from text descriptions",
      logo: "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=128&h=128&fit=crop",
      category: "Image Generation",
      upvotes: 892,
      views: 32145,
      trendPercentage: 156.8,
      isNew: true,
    },
    {
      id: "copilot",
      name: "GitHub Copilot",
      tagline: "AI pair programmer that helps you write code faster",
      logo: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=128&h=128&fit=crop",
      category: "Code Assistant",
      upvotes: 1056,
      views: 38421,
      trendPercentage: 42.1,
    },
  ];

  const fastestRising = [
    {
      id: "suno",
      name: "Suno AI",
      tagline: "Generate music and songs from text prompts",
      logo: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=128&h=128&fit=crop",
      category: "Audio & Voice",
      upvotes: 423,
      views: 15234,
      trendPercentage: 289.4,
      isNew: true,
    },
    {
      id: "runway",
      name: "Runway ML",
      tagline: "Creative tools powered by machine learning for video editing",
      logo: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=128&h=128&fit=crop",
      category: "Video Generation",
      upvotes: 634,
      views: 18423,
      trendPercentage: 178.2,
    },
    {
      id: "perplexity",
      name: "Perplexity AI",
      tagline: "AI-powered answer engine for complex questions",
      logo: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=128&h=128&fit=crop",
      category: "AI Assistant",
      upvotes: 512,
      views: 21456,
      trendPercentage: 134.7,
    },
  ];

  const categories = [
    { id: "chat", name: "AI Assistant", icon: MessageSquare, toolCount: 124 },
    { id: "image", name: "Image Generation", icon: Image, toolCount: 89 },
    { id: "video", name: "Video Generation", icon: Video, toolCount: 45 },
    { id: "code", name: "Code Assistant", icon: Code, toolCount: 67 },
    { id: "audio", name: "Audio & Voice", icon: Mic, toolCount: 53 },
    { id: "writing", name: "Writing", icon: FileText, toolCount: 98 },
    { id: "data", name: "Data Analysis", icon: Database, toolCount: 34 },
    { id: "automation", name: "Automation", icon: Zap, toolCount: 76 },
  ];

  const sponsors = [
    {
      id: "openai",
      name: "OpenAI",
      logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
      description: "Building safe and beneficial artificial intelligence",
      url: "https://openai.com",
      tier: "premium" as const,
    },
    {
      id: "anthropic",
      name: "Anthropic",
      logo: "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=128&h=128&fit=crop",
      description: "AI safety and research company",
      url: "https://anthropic.com",
      tier: "standard" as const,
    },
    {
      id: "huggingface",
      name: "Hugging Face",
      logo: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=128&h=128&fit=crop",
      description: "The AI community building the future",
      url: "https://huggingface.co",
      tier: "standard" as const,
    },
  ];

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
                <a>
                  <Button size="lg" className="gap-2" data-testid="button-submit-tool-hero">
                    Submit Your Tool
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </Link>
              <Link href="/search">
                <a>
                  <Button size="lg" variant="outline" data-testid="button-browse-tools">
                    Browse All Tools
                  </Button>
                </a>
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
          <Link href="/search?filter=trending">
            <a className="text-primary hover:underline font-medium" data-testid="link-view-all-trending">
              View All
            </a>
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
          <Link href="/search?filter=rising">
            <a className="text-primary hover:underline font-medium" data-testid="link-view-all-rising">
              View All
            </a>
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
          <Link href="/categories">
            <a className="text-primary hover:underline font-medium" data-testid="link-view-all-categories">
              View All
            </a>
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
            <a>
              <Button variant="outline" data-testid="button-become-sponsor">
                Become a Sponsor
              </Button>
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
