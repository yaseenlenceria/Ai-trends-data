import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const allTools = [
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

  const filteredTools = allTools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-mono font-bold text-4xl mb-4">Search AI Tools</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover the perfect AI tool for your needs
          </p>
          <SearchBar 
            placeholder="Search by name, description, or category..."
            onSearch={setSearchQuery}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Tabs value={filter} onValueChange={setFilter} className="flex-1">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="trending" data-testid="tab-trending">Trending</TabsTrigger>
              <TabsTrigger value="new" data-testid="tab-new">New</TabsTrigger>
              <TabsTrigger value="top" data-testid="tab-top">Top Rated</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ai-assistant">AI Assistant</SelectItem>
                <SelectItem value="image-generation">Image Generation</SelectItem>
                <SelectItem value="video-generation">Video Generation</SelectItem>
                <SelectItem value="code-assistant">Code Assistant</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]" data-testid="select-pricing-filter">
                <SelectValue placeholder="Pricing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pricing</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="freemium">Freemium</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-mono font-bold text-foreground">{filteredTools.length}</span> tools found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">No tools found matching your search</p>
            <Button variant="outline" onClick={() => setSearchQuery("")} data-testid="button-clear-filters">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
