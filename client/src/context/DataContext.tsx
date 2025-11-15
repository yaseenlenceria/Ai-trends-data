import { createContext, useContext, ReactNode, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LucideIcon, MessageSquare, Image, Video, Code, Mic, FileText, Database, Zap } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description?: string;
  logo: string;
  category?: string;
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
  slug: string;
  icon: LucideIcon | string;
  description?: string;
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
  isLoading: boolean;
  getToolBySlug: (slug: string) => Tool | undefined;
  getToolsByCategory: (categoryId: string) => Tool[];
  getTrendingTools: () => Tool[];
  getFastestRisingTools: () => Tool[];
  getNewTools: () => Tool[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  Image,
  Video,
  Code,
  Mic,
  FileText,
  Database,
  Zap,
};

// API fetching functions
async function fetchTools(): Promise<Tool[]> {
  const response = await fetch("/api/tools");
  if (!response.ok) throw new Error("Failed to fetch tools");
  const data = await response.json();
  // Check if tools were created in the last 7 days
  return data.map((tool: any) => {
    const createdAt = new Date(tool.createdAt);
    const now = new Date();
    const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    return {
      ...tool,
      category: undefined, // Will be resolved from categoryId
      isNew: daysSinceCreated <= 7,
    };
  });
}

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) throw new Error("Failed to fetch categories");
  const data = await response.json();
  return data.map((cat: any) => ({
    ...cat,
    icon: iconMap[cat.icon] || MessageSquare,
  }));
}

async function fetchSponsors(): Promise<Sponsor[]> {
  const response = await fetch("/api/sponsors");
  if (!response.ok) throw new Error("Failed to fetch sponsors");
  return response.json();
}

// Fallback mock data for development (in case API is not available)
const FALLBACK_TOOLS: Tool[] = [
  // AI Assistants
  {
    id: "1",
    name: "ChatGPT",
    slug: "chatgpt",
    tagline: "Conversational AI that understands and generates human-like text",
    description: "ChatGPT is a state-of-the-art conversational AI developed by OpenAI. It uses advanced natural language processing to understand context, generate human-like responses, and assist with a wide variety of tasks.",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
    category: "AI Assistant",
    categoryId: "chat",
    upvotes: 2847,
    views: 125632,
    viewsWeek: 28847,
    viewsToday: 4521,
    trendPercentage: 24.5,
    website: "https://chat.openai.com",
    screenshots: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 118000 },
      { date: "Tue", views: 121000 },
      { date: "Wed", views: 123500 },
      { date: "Thu", views: 122000 },
      { date: "Fri", views: 128000 },
      { date: "Sat", views: 132000 },
      { date: "Sun", views: 125632 },
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
    name: "Claude",
    slug: "claude",
    tagline: "Constitutional AI assistant focused on being helpful, harmless, and honest",
    description: "Claude is Anthropic's advanced AI assistant built on constitutional AI principles. It excels at long-form content creation, detailed analysis, coding tasks, and maintaining context in extended conversations. Claude is designed to be helpful, harmless, and honest, with strong capabilities in reasoning and creative tasks.",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
    category: "AI Assistant",
    categoryId: "chat",
    upvotes: 1892,
    views: 78145,
    viewsWeek: 18234,
    viewsToday: 2841,
    trendPercentage: 34.2,
    website: "https://claude.ai",
    twitter: "https://twitter.com/AnthropicAI",
    screenshots: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 72000 },
      { date: "Tue", views: 74500 },
      { date: "Wed", views: 76800 },
      { date: "Thu", views: 75200 },
      { date: "Fri", views: 79500 },
      { date: "Sat", views: 81000 },
      { date: "Sun", views: 78145 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["Claude 3 Haiku access", "Standard features", "Limited usage"]
        },
        {
          name: "Pro",
          price: "$20/month",
          features: ["Claude 3 Opus access", "5x more usage", "Priority access", "Early feature access"]
        }
      ]
    }
  },
  {
    id: "3",
    name: "Perplexity AI",
    slug: "perplexity",
    tagline: "AI-powered answer engine for complex questions with real-time sources",
    description: "Perplexity AI is an answer engine that combines the power of large language models with real-time web search to provide accurate, sourced answers to your questions. Unlike traditional chatbots, Perplexity cites its sources and can access the latest information from the internet. Perfect for research, fact-checking, and getting up-to-date information on any topic.",
    logo: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=128&h=128&fit=crop",
    category: "AI Assistant",
    categoryId: "chat",
    upvotes: 1512,
    views: 42456,
    viewsWeek: 11234,
    viewsToday: 1876,
    trendPercentage: 89.7,
    website: "https://perplexity.ai",
    twitter: "https://twitter.com/perplexity_ai",
    isNew: true,
    screenshots: [
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 38000 },
      { date: "Tue", views: 39500 },
      { date: "Wed", views: 40200 },
      { date: "Thu", views: 41000 },
      { date: "Fri", views: 42800 },
      { date: "Sat", views: 44500 },
      { date: "Sun", views: 42456 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["5 Pro searches/day", "Standard AI model", "Basic features"]
        },
        {
          name: "Pro",
          price: "$20/month",
          features: ["Unlimited Pro searches", "GPT-4 & Claude 3", "File upload", "API access"]
        }
      ]
    }
  },
  {
    id: "4",
    name: "Google Gemini",
    slug: "google-gemini",
    tagline: "Google's most capable AI model for text, code, and multimodal tasks",
    description: "Google Gemini is a family of multimodal AI models developed by Google DeepMind. It can understand and generate text, code, images, audio, and video. Gemini Ultra is Google's most capable model, designed to compete with GPT-4 and Claude, with advanced reasoning capabilities and the ability to process multiple types of information simultaneously.",
    logo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=128&h=128&fit=crop",
    category: "AI Assistant",
    categoryId: "chat",
    upvotes: 1678,
    views: 56234,
    viewsWeek: 14562,
    viewsToday: 2341,
    trendPercentage: 45.3,
    website: "https://gemini.google.com",
    screenshots: [
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 52000 },
      { date: "Tue", views: 53500 },
      { date: "Wed", views: 54800 },
      { date: "Thu", views: 55200 },
      { date: "Fri", views: 57000 },
      { date: "Sat", views: 58500 },
      { date: "Sun", views: 56234 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["Gemini Pro access", "Standard features", "Google integration"]
        },
        {
          name: "Advanced",
          price: "$19.99/month",
          features: ["Gemini Ultra access", "2M token context", "Priority access", "Google One benefits"]
        }
      ]
    }
  },
  
  // Image Generation
  {
    id: "5",
    name: "Midjourney",
    slug: "midjourney",
    tagline: "AI art generator creating stunning images from text descriptions",
    description: "Midjourney is a leading AI image generator that creates high-quality, artistic images from text prompts. Known for its distinctive aesthetic and creative outputs.",
    logo: "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=128&h=128&fit=crop",
    category: "Image Generation",
    categoryId: "image",
    upvotes: 2192,
    views: 98145,
    viewsWeek: 24234,
    viewsToday: 3892,
    trendPercentage: 67.8,
    website: "https://midjourney.com",
  },
  {
    id: "6",
    name: "DALL-E 3",
    slug: "dalle-3",
    tagline: "OpenAI's advanced image generation model with precise prompt following",
    logo: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=128&h=128&fit=crop",
    category: "Image Generation",
    categoryId: "image",
    upvotes: 1823,
    views: 67234,
    viewsWeek: 16782,
    viewsToday: 2678,
    trendPercentage: 52.4,
    website: "https://openai.com/dall-e-3",
  },
  {
    id: "7",
    name: "Stable Diffusion",
    slug: "stable-diffusion",
    tagline: "Open-source AI image generator for creative freedom",
    logo: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=128&h=128&fit=crop",
    category: "Image Generation",
    categoryId: "image",
    upvotes: 1456,
    views: 54321,
    viewsWeek: 13456,
    viewsToday: 2145,
    trendPercentage: 38.9,
    website: "https://stability.ai",
  },
  
  // Code Assistants
  {
    id: "8",
    name: "GitHub Copilot",
    slug: "github-copilot",
    tagline: "AI pair programmer that helps you write code faster",
    description: "GitHub Copilot uses OpenAI Codex to suggest code and entire functions in real-time. Integrated directly into your IDE for seamless coding assistance.",
    logo: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=128&h=128&fit=crop",
    category: "Code Assistant",
    categoryId: "code",
    upvotes: 2156,
    views: 89421,
    viewsWeek: 21847,
    viewsToday: 3421,
    trendPercentage: 42.1,
    website: "https://github.com/features/copilot",
  },
  {
    id: "9",
    name: "Cursor",
    slug: "cursor",
    tagline: "AI-first code editor built for productivity",
    logo: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=128&h=128&fit=crop",
    category: "Code Assistant",
    categoryId: "code",
    upvotes: 1734,
    views: 62341,
    viewsWeek: 15678,
    viewsToday: 2456,
    trendPercentage: 112.5,
    website: "https://cursor.sh",
    isNew: true,
  },
  {
    id: "10",
    name: "Replit AI",
    slug: "replit-ai",
    tagline: "AI-powered collaborative coding platform",
    logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&h=128&fit=crop",
    category: "Code Assistant",
    categoryId: "code",
    upvotes: 1289,
    views: 48762,
    viewsWeek: 12234,
    viewsToday: 1923,
    trendPercentage: 78.3,
    website: "https://replit.com",
  },
  
  // Video Generation
  {
    id: "11",
    name: "Runway ML",
    slug: "runway-ml",
    tagline: "Creative tools powered by machine learning for video editing",
    description: "Runway ML provides AI-powered video editing tools including Gen-2 for text-to-video generation and advanced editing capabilities.",
    logo: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=128&h=128&fit=crop",
    category: "Video Generation",
    categoryId: "video",
    upvotes: 1634,
    views: 58423,
    viewsWeek: 14562,
    viewsToday: 2341,
    trendPercentage: 95.2,
    website: "https://runwayml.com",
  },
  {
    id: "12",
    name: "Pika Labs",
    slug: "pika",
    tagline: "AI video generator that brings your ideas to life",
    logo: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=128&h=128&fit=crop",
    category: "Video Generation",
    categoryId: "video",
    upvotes: 1423,
    views: 51234,
    viewsWeek: 13456,
    viewsToday: 2156,
    trendPercentage: 156.7,
    website: "https://pika.art",
    isNew: true,
  },
  {
    id: "13",
    name: "Synthesia",
    slug: "synthesia",
    tagline: "Create AI videos with avatars from text in minutes",
    logo: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=128&h=128&fit=crop",
    category: "Video Generation",
    categoryId: "video",
    upvotes: 1178,
    views: 45678,
    viewsWeek: 11234,
    viewsToday: 1876,
    trendPercentage: 51.3,
    website: "https://synthesia.io",
  },
  
  // Audio & Voice
  {
    id: "14",
    name: "ElevenLabs",
    slug: "elevenlabs",
    tagline: "AI voice generator with realistic text-to-speech technology",
    description: "ElevenLabs creates lifelike speech synthesis with emotion and intonation. Perfect for content creators, developers, and businesses.",
    logo: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=128&h=128&fit=crop",
    category: "Audio & Voice",
    categoryId: "audio",
    upvotes: 1892,
    views: 67234,
    viewsWeek: 16782,
    viewsToday: 2678,
    trendPercentage: 73.4,
    website: "https://elevenlabs.io",
  },
  {
    id: "15",
    name: "Suno AI",
    slug: "suno",
    tagline: "Generate complete songs with AI from text prompts",
    logo: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=128&h=128&fit=crop",
    category: "Audio & Voice",
    categoryId: "audio",
    upvotes: 1523,
    views: 54234,
    viewsWeek: 14562,
    viewsToday: 2341,
    trendPercentage: 203.4,
    website: "https://suno.ai",
    isNew: true,
  },
  {
    id: "16",
    name: "Murf AI",
    slug: "murf-ai",
    tagline: "AI voice generator for podcasts, videos, and presentations",
    logo: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=128&h=128&fit=crop",
    category: "Audio & Voice",
    categoryId: "audio",
    upvotes: 1087,
    views: 39876,
    viewsWeek: 10234,
    viewsToday: 1645,
    trendPercentage: 45.7,
    website: "https://murf.ai",
  },
  
  // Writing Tools
  {
    id: "17",
    name: "Jasper",
    slug: "jasper",
    tagline: "AI copilot for enterprise marketing teams",
    logo: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=128&h=128&fit=crop",
    category: "Writing",
    categoryId: "writing",
    upvotes: 1456,
    views: 52341,
    viewsWeek: 13234,
    viewsToday: 2123,
    trendPercentage: 38.2,
    website: "https://jasper.ai",
  },
  {
    id: "18",
    name: "Copy.ai",
    slug: "copy-ai",
    tagline: "AI-powered copywriter for marketing content",
    logo: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=128&h=128&fit=crop",
    category: "Writing",
    categoryId: "writing",
    upvotes: 1234,
    views: 45678,
    viewsWeek: 11456,
    viewsToday: 1834,
    trendPercentage: 42.8,
    website: "https://copy.ai",
  },
  {
    id: "19",
    name: "Notion AI",
    slug: "notion-ai",
    tagline: "AI assistant integrated into your Notion workspace",
    description: "Notion AI helps you write, brainstorm, edit, and summarize directly in your notes. Seamlessly integrated into the Notion experience.",
    logo: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=128&h=128&fit=crop",
    category: "Writing",
    categoryId: "writing",
    upvotes: 1789,
    views: 62345,
    viewsWeek: 15678,
    viewsToday: 2456,
    trendPercentage: 56.3,
    website: "https://notion.so/product/ai",
  },
  {
    id: "20",
    name: "Grammarly",
    slug: "grammarly",
    tagline: "AI-powered writing assistant for clear communication",
    logo: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=128&h=128&fit=crop",
    category: "Writing",
    categoryId: "writing",
    upvotes: 2123,
    views: 78945,
    viewsWeek: 19234,
    viewsToday: 3012,
    trendPercentage: 28.4,
    website: "https://grammarly.com",
  },
  
  // Data Analysis
  {
    id: "21",
    name: "Julius AI",
    slug: "julius-ai",
    tagline: "AI data analyst that interprets and visualizes your data",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop",
    category: "Data Analysis",
    categoryId: "data",
    upvotes: 987,
    views: 34567,
    viewsWeek: 8976,
    viewsToday: 1456,
    trendPercentage: 67.9,
    website: "https://julius.ai",
  },
  {
    id: "22",
    name: "ChatCSV",
    slug: "chatcsv",
    tagline: "Ask questions about your CSV files in natural language",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&h=128&fit=crop",
    category: "Data Analysis",
    categoryId: "data",
    upvotes: 756,
    views: 28345,
    viewsWeek: 7234,
    viewsToday: 1167,
    trendPercentage: 89.3,
    website: "https://chatcsv.co",
  },
  
  // Automation
  {
    id: "23",
    name: "Make (Integromat)",
    slug: "make",
    tagline: "Visual automation platform with AI capabilities",
    logo: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=128&h=128&fit=crop",
    category: "Automation",
    categoryId: "automation",
    upvotes: 1345,
    views: 48762,
    viewsWeek: 12456,
    viewsToday: 2001,
    trendPercentage: 41.2,
    website: "https://make.com",
  },
  {
    id: "24",
    name: "Zapier AI",
    slug: "zapier-ai",
    tagline: "Automate workflows with AI-powered integrations",
    logo: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=128&h=128&fit=crop",
    category: "Automation",
    categoryId: "automation",
    upvotes: 1567,
    views: 56234,
    viewsWeek: 14562,
    viewsToday: 2341,
    trendPercentage: 35.7,
    website: "https://zapier.com/ai",
  },
  
  // Additional Popular Tools
  {
    id: "25",
    name: "Llama 3",
    slug: "llama-3",
    tagline: "Meta's open-source large language model",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
    category: "AI Assistant",
    categoryId: "chat",
    upvotes: 1423,
    views: 52341,
    viewsWeek: 13456,
    viewsToday: 2167,
    trendPercentage: 71.2,
    website: "https://llama.meta.com",
  },
  {
    id: "26",
    name: "HeyGen",
    slug: "heygen",
    tagline: "AI video generator with customizable avatars",
    logo: "https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=128&h=128&fit=crop",
    category: "Video Generation",
    categoryId: "video",
    upvotes: 1178,
    views: 43567,
    viewsWeek: 11234,
    viewsToday: 1876,
    trendPercentage: 92.4,
    website: "https://heygen.com",
  },
  {
    id: "27",
    name: "Tabnine",
    slug: "tabnine",
    tagline: "AI code completion tool for developers",
    logo: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=128&h=128&fit=crop",
    category: "Code Assistant",
    categoryId: "code",
    upvotes: 1089,
    views: 39876,
    viewsWeek: 10234,
    viewsToday: 1645,
    trendPercentage: 33.8,
    website: "https://tabnine.com",
  },
  {
    id: "28",
    name: "Leonardo AI",
    slug: "leonardo-ai",
    tagline: "AI art generation with fine-tuned control",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
    category: "Image Generation",
    categoryId: "image",
    upvotes: 1234,
    views: 46789,
    viewsWeek: 12345,
    viewsToday: 1987,
    trendPercentage: 68.5,
    website: "https://leonardo.ai",
  },
  {
    id: "29",
    name: "Descript",
    slug: "descript",
    tagline: "AI-powered video and podcast editing",
    logo: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=128&h=128&fit=crop",
    category: "Video Generation",
    categoryId: "video",
    upvotes: 1456,
    views: 51234,
    viewsWeek: 13456,
    viewsToday: 2156,
    trendPercentage: 54.3,
    website: "https://descript.com",
  },
  {
    id: "30",
    name: "Wordtune",
    slug: "wordtune",
    tagline: "AI writing companion for rewriting and rephrasing",
    logo: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=128&h=128&fit=crop",
    category: "Writing",
    categoryId: "writing",
    upvotes: 987,
    views: 36789,
    viewsWeek: 9456,
    viewsToday: 1523,
    trendPercentage: 39.7,
    website: "https://wordtune.com",
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

const FALLBACK_CATEGORIES: Category[] = [
  { id: "chat", name: "AI Assistant", slug: "chat", icon: MessageSquare, toolCount: 0 },
  { id: "image", name: "Image Generation", slug: "image", icon: Image, toolCount: 0 },
  { id: "video", name: "Video Generation", slug: "video", icon: Video, toolCount: 0 },
  { id: "code", name: "Code Assistant", slug: "code", icon: Code, toolCount: 0 },
  { id: "audio", name: "Audio & Voice", slug: "audio", icon: Mic, toolCount: 0 },
  { id: "writing", name: "Writing", slug: "writing", icon: FileText, toolCount: 0 },
  { id: "data", name: "Data Analysis", slug: "data", icon: Database, toolCount: 0 },
  { id: "automation", name: "Automation", slug: "automation", icon: Zap, toolCount: 0 },
];

const FALLBACK_SPONSORS: Sponsor[] = [];

export function DataProvider({ children }: { children: ReactNode }) {
  // Fetch data using React Query
  const { data: tools = FALLBACK_TOOLS, isLoading: toolsLoading } = useQuery({
    queryKey: ["tools"],
    queryFn: fetchTools,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: categories = FALLBACK_CATEGORIES, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const { data: sponsors = FALLBACK_SPONSORS, isLoading: sponsorsLoading } = useQuery({
    queryKey: ["sponsors"],
    queryFn: fetchSponsors,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const isLoading = toolsLoading || categoriesLoading || sponsorsLoading;

  // Memoized helper functions
  const getToolBySlug = useMemo(
    () => (slug: string) => tools.find((tool) => tool.slug === slug),
    [tools]
  );

  const getToolsByCategory = useMemo(
    () => (categoryId: string) => tools.filter((tool) => tool.categoryId === categoryId),
    [tools]
  );

  const getTrendingTools = useMemo(() => {
    return () =>
      [...tools]
        .sort((a, b) => {
          const scoreA = (a.viewsToday || 0) * 0.5 + a.upvotes * 1.2;
          const scoreB = (b.viewsToday || 0) * 0.5 + b.upvotes * 1.2;
          return scoreB - scoreA;
        })
        .slice(0, 6);
  }, [tools]);

  const getFastestRisingTools = useMemo(() => {
    return () => [...tools].sort((a, b) => b.trendPercentage - a.trendPercentage).slice(0, 6);
  }, [tools]);

  const getNewTools = useMemo(() => {
    return () => tools.filter((tool) => tool.isNew).slice(0, 6);
  }, [tools]);

  const value = useMemo(
    () => ({
      tools,
      categories,
      sponsors,
      isLoading,
      getToolBySlug,
      getToolsByCategory,
      getTrendingTools,
      getFastestRisingTools,
      getNewTools,
    }),
    [tools, categories, sponsors, isLoading, getToolBySlug, getToolsByCategory, getTrendingTools, getFastestRisingTools, getNewTools]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
