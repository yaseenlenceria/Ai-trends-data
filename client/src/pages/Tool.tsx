import { ExternalLink, ArrowUp, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import TrendBadge from "@/components/TrendBadge";
import TrendingGraph from "@/components/TrendingGraph";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import ToolCard from "@/components/ToolCard";

export default function Tool() {
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(1247);
  const [copied, setCopied] = useState(false);

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
    const embedCode = `<iframe src="https://aitrendsdata.com/badge/chatgpt" width="300" height="100" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trendData = [
    { date: "Mon", views: 38000 },
    { date: "Tue", views: 41000 },
    { date: "Wed", views: 43500 },
    { date: "Thu", views: 42000 },
    { date: "Fri", views: 48000 },
    { date: "Sat", views: 52000 },
    { date: "Sun", views: 45632 },
  ];

  const screenshots = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop",
    "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=1200&h=675&fit=crop",
    "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=675&fit=crop",
  ];

  const relatedTools = [
    {
      id: "claude",
      name: "Claude",
      tagline: "Constitutional AI assistant focused on being helpful, harmless, and honest",
      logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
      category: "AI Assistant",
      upvotes: 892,
      views: 32145,
      trendPercentage: 34.2,
    },
    {
      id: "bard",
      name: "Google Bard",
      tagline: "Conversational AI service powered by Google's language models",
      logo: "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=128&h=128&fit=crop",
      category: "AI Assistant",
      upvotes: 756,
      views: 28934,
      trendPercentage: 18.7,
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

  return (
    <div className="pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop" 
                  alt="ChatGPT" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="font-mono font-bold text-3xl md:text-4xl" data-testid="text-tool-name">
                    ChatGPT
                  </h1>
                  <TrendBadge percentage={24.5} />
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  Conversational AI that understands and generates human-like text responses
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="gap-2" data-testid="button-visit-website">
                    Visit Website
                    <ExternalLink className="w-4 h-4" />
                  </Button>
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

            <ScreenshotCarousel images={screenshots} />

            <Card className="p-6">
              <h2 className="font-mono font-bold text-2xl mb-4">About</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                <p>
                  ChatGPT is a state-of-the-art conversational AI developed by OpenAI. It uses advanced natural language processing to understand context, generate human-like responses, and assist with a wide variety of tasks.
                </p>
                <p>
                  From answering questions and writing content to coding assistance and creative brainstorming, ChatGPT has become an essential tool for millions of users worldwide.
                </p>
                <h3 className="font-mono font-bold text-lg text-foreground mt-6 mb-3">Key Features</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Natural conversation flow with context awareness</li>
                  <li>Code generation and debugging assistance</li>
                  <li>Content writing and editing capabilities</li>
                  <li>Multi-language support</li>
                  <li>Integration with GPT-4 for enhanced performance</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-mono font-bold text-2xl mb-4">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-mono font-bold text-lg mb-2">Free</h3>
                  <p className="text-2xl font-bold mb-2">$0<span className="text-sm text-muted-foreground">/month</span></p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• GPT-3.5 access</li>
                    <li>• Standard response time</li>
                    <li>• Limited availability</li>
                  </ul>
                </div>
                <div className="border-2 border-primary rounded-lg p-4">
                  <Badge className="mb-2">Popular</Badge>
                  <h3 className="font-mono font-bold text-lg mb-2">Plus</h3>
                  <p className="text-2xl font-bold mb-2">$20<span className="text-sm text-muted-foreground">/month</span></p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• GPT-4 access</li>
                    <li>• Faster response time</li>
                    <li>• Priority access</li>
                    <li>• Plugin support</li>
                  </ul>
                </div>
              </div>
            </Card>

            <TrendingGraph data={trendData} />

            <div>
              <h2 className="font-mono font-bold text-2xl mb-6">Related Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTools.map((tool) => (
                  <ToolCard key={tool.id} {...tool} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-mono font-bold text-lg mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Category</p>
                  <Badge variant="secondary">AI Assistant</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total Views</p>
                  <p className="font-mono font-bold text-lg">45,632</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Weekly Views</p>
                  <p className="font-mono font-bold text-lg">12,847</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">AI Trend Score</p>
                  <p className="font-mono font-bold text-lg text-primary">94.2</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-mono font-bold text-lg mb-4">Embed Badge</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-4 bg-muted flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=64&h=64&fit=crop" 
                    alt="ChatGPT" 
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-sm">ChatGPT</p>
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
