import { createContext, useContext, ReactNode } from "react";
import { LucideIcon, MessageSquare, Image, Video, Code, Mic, FileText, Database, Zap } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description?: string;
  logo: string;
  category: string;
  categoryId: string;
  upvotes: number;
  views: number;
  viewsWeek?: number;
  viewsToday?: number;
  trendPercentage: number;
  isNew?: boolean;
  website?: string;
  pricing?: {
    model: string;
    plans: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
  screenshots?: string[];
  trendData?: Array<{ date: string; views: number }>;
  twitter?: string;
  github?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  toolCount: number;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  description: string;
  url: string;
  tier: "premium" | "standard";
}

interface DataContextType {
  tools: Tool[];
  categories: Category[];
  sponsors: Sponsor[];
  getToolBySlug: (slug: string) => Tool | undefined;
  getToolsByCategory: (categoryId: string) => Tool[];
  getTrendingTools: () => Tool[];
  getFastestRisingTools: () => Tool[];
  getNewTools: () => Tool[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// ============================================================
// TODO: REPLACE THIS MOCK DATA WITH YOUR ACTUAL DATA
// ============================================================
// You can:
// 1. Replace these arrays with data from your backend API
// 2. Use fetch/axios to load data from your database
// 3. Import data from JSON files
// ============================================================

const MOCK_TOOLS: Tool[] = [
  {
    id: "1",
    name: "ChatGPT",
    slug: "chatgpt",
    tagline: "Conversational AI that understands and generates human-like text",
    description: "ChatGPT is a state-of-the-art conversational AI developed by OpenAI. It uses advanced natural language processing to understand context, generate human-like responses, and assist with a wide variety of tasks.",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
    category: "AI Assistant",
    categoryId: "chat",
    upvotes: 1247,
    views: 45632,
    viewsWeek: 12847,
    viewsToday: 3421,
    trendPercentage: 24.5,
    website: "https://chat.openai.com",
    screenshots: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 38000 },
      { date: "Tue", views: 41000 },
      { date: "Wed", views: 43500 },
      { date: "Thu", views: 42000 },
      { date: "Fri", views: 48000 },
      { date: "Sat", views: 52000 },
      { date: "Sun", views: 45632 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["GPT-3.5 access", "Standard response time", "Limited availability"]
        },
        {
          name: "Plus",
          price: "$20/month",
          features: ["GPT-4 access", "Faster response time", "Priority access", "Plugin support"]
        }
      ]
    }
  },
  {
    id: "2",
    name: "Midjourney",
    slug: "midjourney",
    tagline: "AI art generator creating stunning images from text descriptions",
    logo: "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=128&h=128&fit=crop",
    category: "Image Generation",
    categoryId: "image",
    upvotes: 892,
    views: 32145,
    trendPercentage: 156.8,
    isNew: true,
  },
  {
    id: "3",
    name: "GitHub Copilot",
    slug: "github-copilot",
    tagline: "AI pair programmer that helps you write code faster",
    logo: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=128&h=128&fit=crop",
    category: "Code Assistant",
    categoryId: "code",
    upvotes: 1056,
    views: 38421,
    trendPercentage: 42.1,
  },
];

const MOCK_CATEGORIES: Category[] = [
  { id: "chat", name: "AI Assistant", icon: MessageSquare, toolCount: 124 },
  { id: "image", name: "Image Generation", icon: Image, toolCount: 89 },
  { id: "video", name: "Video Generation", icon: Video, toolCount: 45 },
  { id: "code", name: "Code Assistant", icon: Code, toolCount: 67 },
  { id: "audio", name: "Audio & Voice", icon: Mic, toolCount: 53 },
  { id: "writing", name: "Writing", icon: FileText, toolCount: 98 },
  { id: "data", name: "Data Analysis", icon: Database, toolCount: 34 },
  { id: "automation", name: "Automation", icon: Zap, toolCount: 76 },
];

const MOCK_SPONSORS: Sponsor[] = [
  {
    id: "1",
    name: "OpenAI",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
    description: "Building safe and beneficial artificial intelligence",
    url: "https://openai.com",
    tier: "premium",
  },
  {
    id: "2",
    name: "Anthropic",
    logo: "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=128&h=128&fit=crop",
    description: "AI safety and research company",
    url: "https://anthropic.com",
    tier: "standard",
  },
  {
    id: "3",
    name: "Hugging Face",
    logo: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=128&h=128&fit=crop",
    description: "The AI community building the future",
    url: "https://huggingface.co",
    tier: "standard",
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const getToolBySlug = (slug: string) => {
    return MOCK_TOOLS.find(tool => tool.slug === slug);
  };

  const getToolsByCategory = (categoryId: string) => {
    return MOCK_TOOLS.filter(tool => tool.categoryId === categoryId);
  };

  const getTrendingTools = () => {
    return [...MOCK_TOOLS].sort((a, b) => {
      const scoreA = (a.viewsToday || 0) * 0.5 + a.upvotes * 1.2;
      const scoreB = (b.viewsToday || 0) * 0.5 + b.upvotes * 1.2;
      return scoreB - scoreA;
    }).slice(0, 6);
  };

  const getFastestRisingTools = () => {
    return [...MOCK_TOOLS].sort((a, b) => b.trendPercentage - a.trendPercentage).slice(0, 6);
  };

  const getNewTools = () => {
    return MOCK_TOOLS.filter(tool => tool.isNew).slice(0, 6);
  };

  return (
    <DataContext.Provider
      value={{
        tools: MOCK_TOOLS,
        categories: MOCK_CATEGORIES,
        sponsors: MOCK_SPONSORS,
        getToolBySlug,
        getToolsByCategory,
        getTrendingTools,
        getFastestRisingTools,
        getNewTools,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
