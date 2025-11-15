import { ExternalLink, ArrowUp, Copy, Check, Eye, TrendingUp, Calendar, Globe, Twitter as TwitterIcon, Github, Sparkles, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import TrendBadge from "@/components/TrendBadge";
import TrendingGraph from "@/components/TrendingGraph";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import ToolCard from "@/components/ToolCard";
import { useData } from "@/context/DataContext";
import NotFound from "./not-found";

export default function Tool() {
  const [, params] = useRoute("/tool/:slug");
  const { getToolBySlug, tools } = useData();

  const tool = params?.slug ? getToolBySlug(params.slug) : undefined;

  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(tool?.upvotes || 0);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Set page title for SEO
  useEffect(() => {
    if (tool) {
      document.title = `${tool.name} - ${tool.tagline} | AITRENDSDATA`;
    }
  }, [tool]);

  if (!tool) {
    return <NotFound />;
  }

  const handleUpvote = async () => {
    if (upvoted) {
      setUpvotes(upvotes - 1);
    } else {
      setUpvotes(upvotes + 1);
    }
    setUpvoted(!upvoted);

    // TODO: Call API to register upvote
    // await fetch('/api/upvotes', { method: 'POST', body: JSON.stringify({ toolId: tool.id }) });
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="https://ai-trends-data.vercel.app/badge/${tool.slug}" width="300" height="100" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `https://ai-trends-data.vercel.app/tool/${tool.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const trendData = tool.trendData || [];
  const screenshots = tool.screenshots || [];
  const relatedTools = tools.filter(t => t.categoryId === tool.categoryId && t.id !== tool.id).slice(0, 3);

  // Calculate growth metrics
  const weeklyGrowth = tool.viewsWeek || 0;
  const todayViews = tool.viewsToday || 0;

  return (
    <div className="pb-24 md:pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white border-2 border-border flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg">
              <img
                src={tool.logo}
                alt={tool.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-3 mb-3">
                {tool.isNew && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    New
                  </Badge>
                )}
                <Badge variant="secondary">{tool.category}</Badge>
                <TrendBadge percentage={tool.trendPercentage} />
              </div>
              <h1 className="font-mono font-bold text-3xl md:text-5xl mb-3 leading-tight" data-testid="text-tool-name">
                {tool.name}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl">
                {tool.tagline}
              </p>
              <div className="flex flex-wrap gap-3">
                {tool.website && (
                  <a href={tool.website} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="gap-2" data-testid="button-visit-website">
                      <Globe className="w-4 h-4" />
                      Visit Website
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                )}
                <Button
                  size="lg"
                  variant={upvoted ? "default" : "outline"}
                  className="gap-2"
                  onClick={handleUpvote}
                  data-testid="button-upvote"
                >
                  <ArrowUp className={`w-4 h-4 ${upvoted ? 'fill-current' : ''}`} />
                  {upvotes}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2"
                  onClick={handleCopyLink}
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {copiedLink ? "Copied!" : "Share"}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Total Views</span>
              </div>
              <p className="font-mono font-bold text-2xl">{tool.views.toLocaleString()}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Weekly Views</span>
              </div>
              <p className="font-mono font-bold text-2xl">{weeklyGrowth.toLocaleString()}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Today</span>
              </div>
              <p className="font-mono font-bold text-2xl">{todayViews.toLocaleString()}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm">Upvotes</span>
              </div>
              <p className="font-mono font-bold text-2xl">{upvotes.toLocaleString()}</p>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Screenshots */}
            {screenshots.length > 0 && (
              <div>
                <h2 className="font-mono font-bold text-2xl mb-6">Screenshots</h2>
                <ScreenshotCarousel images={screenshots} />
              </div>
            )}

            {/* About */}
            {tool.description && (
              <Card className="p-8">
                <h2 className="font-mono font-bold text-2xl mb-6">About {tool.name}</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                  <p>{tool.description}</p>
                </div>
              </Card>
            )}

            {/* Trend Analytics */}
            {trendData.length > 0 && (
              <div>
                <h2 className="font-mono font-bold text-2xl mb-6">Trend Analytics</h2>
                <TrendingGraph data={trendData} />
                <p className="text-sm text-muted-foreground mt-4">
                  7-day view trend showing {tool.name}'s popularity over time
                </p>
              </div>
            )}

            {/* Pricing */}
            {tool.pricing && (
              <Card className="p-8">
                <h2 className="font-mono font-bold text-2xl mb-6">Pricing Plans</h2>
                <div className="mb-4">
                  <Badge variant="outline" className="mb-4">
                    {tool.pricing.model.charAt(0).toUpperCase() + tool.pricing.model.slice(1)} Model
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tool.pricing.plans.map((plan, index) => (
                    <div
                      key={plan.name}
                      className={`border rounded-xl p-6 transition-all ${
                        index === 1
                          ? 'border-2 border-primary bg-primary/5 shadow-lg scale-105'
                          : 'hover:border-primary/50'
                      }`}
                    >
                      {index === 1 && (
                        <Badge className="mb-3 bg-primary">Most Popular</Badge>
                      )}
                      <h3 className="font-mono font-bold text-xl mb-2">{plan.name}</h3>
                      <div className="mb-6">
                        <span className="text-3xl font-bold">{plan.price}</span>
                      </div>
                      <Separator className="my-4" />
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {tool.website && (
                        <Button className="w-full mt-6" variant={index === 1 ? "default" : "outline"}>
                          Get Started
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div>
                <h2 className="font-mono font-bold text-2xl mb-6">Similar Tools in {tool.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedTools.map((relatedTool) => (
                    <ToolCard key={relatedTool.id} {...relatedTool} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="p-6 sticky top-4">
              <h3 className="font-mono font-bold text-lg mb-6">Tool Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Category</p>
                  <Badge variant="secondary" className="text-sm">{tool.category}</Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">AI Trend Score</p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-mono font-bold text-2xl text-primary">
                      {((tool.trendPercentage + 100) / 2).toFixed(1)}
                    </p>
                    <span className="text-sm text-muted-foreground">/ 100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on views and engagement
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Growth Rate</p>
                  <p className="font-mono font-bold text-xl">
                    {tool.trendPercentage > 0 ? '+' : ''}{tool.trendPercentage.toFixed(1)}%
                  </p>
                </div>
                {(tool.twitter || tool.github || tool.website) && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">Links</p>
                      <div className="space-y-2">
                        {tool.website && (
                          <a
                            href={tool.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                            Official Website
                            <ExternalLink className="w-3 h-3 ml-auto" />
                          </a>
                        )}
                        {tool.twitter && (
                          <a
                            href={tool.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                          >
                            <TwitterIcon className="w-4 h-4" />
                            Twitter
                            <ExternalLink className="w-3 h-3 ml-auto" />
                          </a>
                        )}
                        {tool.github && (
                          <a
                            href={tool.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            GitHub
                            <ExternalLink className="w-3 h-3 ml-auto" />
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Embed Badge */}
            <Card className="p-6">
              <h3 className="font-mono font-bold text-lg mb-4">Embed Badge</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-4 bg-muted flex items-center gap-3">
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">View on AITRENDSDATA</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleCopyEmbed}
                  data-testid="button-copy-embed"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Embed Code"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
