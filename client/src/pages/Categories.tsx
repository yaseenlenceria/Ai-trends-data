import CategoryCard from "@/components/CategoryCard";
import ToolCard from "@/components/ToolCard";
import { MessageSquare, Image, Video, Code, Mic, FileText, Database, Zap } from "lucide-react";

export default function Categories() {
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

  const topToolsByCategory = {
    chat: [
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
        id: "perplexity",
        name: "Perplexity AI",
        tagline: "AI-powered answer engine for complex questions",
        logo: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=128&h=128&fit=crop",
        category: "AI Assistant",
        upvotes: 512,
        views: 21456,
        trendPercentage: 134.7,
      },
    ],
  };

  return (
    <div className="pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="font-mono font-bold text-4xl mb-4">Browse by Category</h1>
          <p className="text-lg text-muted-foreground">
            Explore AI tools organized by their primary use case and functionality
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <span className="font-mono font-bold text-2xl text-foreground">586</span> tools across <span className="font-mono font-bold text-foreground">8</span> categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              {...category}
              gradient="bg-gradient-to-br from-card to-card"
            />
          ))}
        </div>

        <div className="space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h2 className="font-mono font-bold text-3xl">AI Assistant</h2>
              <span className="text-muted-foreground">124 tools</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topToolsByCategory.chat.map((tool) => (
                <ToolCard key={tool.id} {...tool} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
