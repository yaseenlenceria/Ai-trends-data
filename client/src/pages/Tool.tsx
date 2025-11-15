import { ExternalLink, ArrowUp, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";
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
  
  if (!tool) {
    return <NotFound />;
  }

  const handleUpvote = () => {
    if (upvoted) {
      setUpvotes(upvotes - 1);
    } else {
      setUpvotes(upvotes + 1);
    }
    setUpvoted(!upvoted);
    console.log("Upvote toggled");
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="https://aitrendsdata.com/badge/${tool.slug}" width="300" height="100" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trendData = tool.trendData || [];
  const screenshots = tool.screenshots || [];
  const relatedTools = tools.filter(t => t.categoryId === tool.categoryId && t.id !== tool.id).slice(0, 3);

  return (
    <div className="pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img 
                  src={tool.logo} 
                  alt={tool.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="font-mono font-bold text-3xl md:text-4xl" data-testid="text-tool-name">
                    {tool.name}
                  </h1>
                  <TrendBadge percentage={tool.trendPercentage} />
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  {tool.tagline}
                </p>
                <div className="flex flex-wrap gap-3">
                  {tool.website && (
                    <a href={tool.website} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="gap-2" data-testid="button-visit-website">
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
                    <ArrowUp className="w-4 h-4" />
                    {upvotes}
                  </Button>
                </div>
              </div>
            </div>

            {screenshots.length > 0 && <ScreenshotCarousel images={screenshots} />}

            {tool.description && (
              <Card className="p-6">
                <h2 className="font-mono font-bold text-2xl mb-4">About</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{tool.description}</p>
                </div>
              </Card>
            )}

            {tool.pricing && (
              <Card className="p-6">
                <h2 className="font-mono font-bold text-2xl mb-4">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.pricing.plans.map((plan, index) => (
                    <div key={plan.name} className={`border rounded-lg p-4 ${index === 1 ? 'border-2 border-primary' : ''}`}>
                      {index === 1 && <Badge className="mb-2">Popular</Badge>}
                      <h3 className="font-mono font-bold text-lg mb-2">{plan.name}</h3>
                      <p className="text-2xl font-bold mb-2">{plan.price}</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {plan.features.map(feature => (
                          <li key={feature}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {trendData.length > 0 && <TrendingGraph data={trendData} />}

            {relatedTools.length > 0 && (
              <div>
                <h2 className="font-mono font-bold text-2xl mb-6">Related Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedTools.map((relatedTool) => (
                    <ToolCard key={relatedTool.id} {...relatedTool} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-mono font-bold text-lg mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Category</p>
                  <Badge variant="secondary">{tool.category}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total Views</p>
                  <p className="font-mono font-bold text-lg">{tool.views.toLocaleString()}</p>
                </div>
                {tool.viewsWeek && (
                  <div>
                    <p className="text-muted-foreground mb-1">Weekly Views</p>
                    <p className="font-mono font-bold text-lg">{tool.viewsWeek.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground mb-1">AI Trend Score</p>
                  <p className="font-mono font-bold text-lg text-primary">
                    {((tool.trendPercentage + 100) / 2).toFixed(1)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-mono font-bold text-lg mb-4">Embed Badge</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-4 bg-muted flex items-center gap-3">
                  <img 
                    src={tool.logo} 
                    alt={tool.name} 
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-sm">{tool.name}</p>
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
