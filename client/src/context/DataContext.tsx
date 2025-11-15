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
    description: "Midjourney is an independent research lab producing a proprietary AI program that creates images from textual descriptions. Known for its distinctive artistic aesthetic and ability to generate highly creative, imaginative visuals, Midjourney has become one of the most popular AI art generators. It excels at creating concept art, illustrations, and unique visual styles that blend realism with artistic interpretation.",
    logo: "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=128&h=128&fit=crop",
    category: "Image Generation",
    categoryId: "image",
    upvotes: 2192,
    views: 98145,
    viewsWeek: 24234,
    viewsToday: 3892,
    trendPercentage: 67.8,
    website: "https://midjourney.com",
    twitter: "https://twitter.com/midjourney",
    screenshots: [
      "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 92000 },
      { date: "Tue", views: 94500 },
      { date: "Wed", views: 96200 },
      { date: "Thu", views: 95800 },
      { date: "Fri", views: 99500 },
      { date: "Sat", views: 102000 },
      { date: "Sun", views: 98145 },
    ],
    pricing: {
      model: "paid",
      plans: [
        {
          name: "Basic",
          price: "$10/month",
          features: ["200 images/month", "3.3 hrs fast GPU time", "Personal commercial terms"]
        },
        {
          name: "Standard",
          price: "$30/month",
          features: ["Unlimited relaxed", "15 hrs fast GPU", "Commercial terms", "Priority queue"]
        }
      ]
    }
  },
  {
    id: "6",
    name: "DALL-E 3",
    slug: "dalle-3",
    tagline: "OpenAI's advanced image generation model with precise prompt following",
    description: "DALL-E 3 is OpenAI's most advanced text-to-image AI system. It understands significantly more nuance and detail than previous versions, allowing you to easily translate your ideas into exceptionally accurate images. DALL-E 3 is natively integrated with ChatGPT, making it easier than ever to generate, refine, and iterate on images.",
    logo: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=128&h=128&fit=crop",
    category: "Image Generation",
    categoryId: "image",
    upvotes: 1823,
    views: 67234,
    viewsWeek: 16782,
    viewsToday: 2678,
    trendPercentage: 52.4,
    website: "https://openai.com/dall-e-3",
    screenshots: [
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 63000 },
      { date: "Tue", views: 65000 },
      { date: "Wed", views: 66500 },
      { date: "Thu", views: 65800 },
      { date: "Fri", views: 68000 },
      { date: "Sat", views: 69500 },
      { date: "Sun", views: 67234 },
    ],
    pricing: {
      model: "paid",
      plans: [
        {
          name: "ChatGPT Plus",
          price: "$20/month",
          features: ["DALL-E 3 access", "GPT-4 access", "Faster generation", "Priority access"]
        },
        {
          name: "API Access",
          price: "Pay per image",
          features: ["$0.04 per image (1024×1024)", "$0.08 per image (1024×1792)", "Scalable", "Commercial use"]
        }
      ]
    }
  },
  {
    id: "7",
    name: "Stable Diffusion",
    slug: "stable-diffusion",
    tagline: "Open-source AI image generator for creative freedom",
    description: "Stable Diffusion is a deep learning, text-to-image model that is open-source and gives artists unprecedented creative freedom. You can run it locally on your own hardware, fine-tune it for specific styles, and use it commercially without restrictions. The community has created thousands of custom models and extensions.",
    logo: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=128&h=128&fit=crop",
    category: "Image Generation",
    categoryId: "image",
    upvotes: 1456,
    views: 54321,
    viewsWeek: 13456,
    viewsToday: 2145,
    trendPercentage: 38.9,
    website: "https://stability.ai",
    github: "https://github.com/Stability-AI/stablediffusion",
    screenshots: [
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 51000 },
      { date: "Tue", views: 52500 },
      { date: "Wed", views: 53200 },
      { date: "Thu", views: 52800 },
      { date: "Fri", views: 54800 },
      { date: "Sat", views: 56000 },
      { date: "Sun", views: 54321 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Open Source",
          price: "Free",
          features: ["Run locally", "Full control", "Commercial use", "Community models"]
        },
        {
          name: "DreamStudio",
          price: "Pay as you go",
          features: ["Cloud hosting", "$10 for 5,000 credits", "Fast generation", "No setup needed"]
        }
      ]
    }
  },
  
  // Code Assistants
  {
    id: "8",
    name: "GitHub Copilot",
    slug: "github-copilot",
    tagline: "AI pair programmer that helps you write code faster",
    description: "GitHub Copilot is an AI-powered code completion tool developed by GitHub and OpenAI. It uses machine learning models trained on billions of lines of code to suggest whole lines or entire functions as you type. Copilot integrates directly into popular IDEs like VS Code, JetBrains, and Neovim, providing context-aware code suggestions, helping you write code faster and learn new frameworks more efficiently.",
    logo: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=128&h=128&fit=crop",
    category: "Code Assistant",
    categoryId: "code",
    upvotes: 2156,
    views: 89421,
    viewsWeek: 21847,
    viewsToday: 3421,
    trendPercentage: 42.1,
    website: "https://github.com/features/copilot",
    github: "https://github.com/features/copilot",
    screenshots: [
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 84000 },
      { date: "Tue", views: 86500 },
      { date: "Wed", views: 88200 },
      { date: "Thu", views: 87500 },
      { date: "Fri", views: 90500 },
      { date: "Sat", views: 92000 },
      { date: "Sun", views: 89421 },
    ],
    pricing: {
      model: "paid",
      plans: [
        {
          name: "Individual",
          price: "$10/month",
          features: ["Code completions", "Chat in IDE", "CLI assistance", "Multi-language support"]
        },
        {
          name: "Business",
          price: "$19/month/user",
          features: ["Everything in Individual", "License management", "Organization-wide policies", "Privacy controls"]
        }
      ]
    }
  },
  {
    id: "9",
    name: "Cursor",
    slug: "cursor",
    tagline: "AI-first code editor built for productivity",
    description: "Cursor is the AI-first code editor designed to make you extraordinarily productive. Built on VS Code, it offers the familiarity you love with powerful AI features like multi-line autocomplete, natural language code editing, and AI-powered debugging. Chat with your codebase, refactor entire functions, and let AI help you understand complex code. Cursor is designed for developers who want to code faster without compromising on control.",
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
    screenshots: [
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 56000 },
      { date: "Tue", views: 58500 },
      { date: "Wed", views: 60000 },
      { date: "Thu", views: 61200 },
      { date: "Fri", views: 63000 },
      { date: "Sat", views: 64500 },
      { date: "Sun", views: 62341 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["2000 completions", "50 slow premium requests", "Basic features"]
        },
        {
          name: "Pro",
          price: "$20/month",
          features: ["Unlimited completions", "Unlimited fast requests", "GPT-4 & Claude 3", "Priority support"]
        }
      ]
    }
  },
  {
    id: "10",
    name: "Replit AI",
    slug: "replit-ai",
    tagline: "AI-powered collaborative coding platform",
    description: "Replit AI brings artificial intelligence directly into your browser-based development environment. Code, collaborate, and deploy applications from anywhere with AI-powered assistance. Replit AI helps you write code faster with intelligent suggestions, complete projects with natural language, and debug issues instantly. Perfect for learning, prototyping, and building production apps.",
    logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&h=128&fit=crop",
    category: "Code Assistant",
    categoryId: "code",
    upvotes: 1289,
    views: 48762,
    viewsWeek: 12234,
    viewsToday: 1923,
    trendPercentage: 78.3,
    website: "https://replit.com",
    screenshots: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 45000 },
      { date: "Tue", views: 46500 },
      { date: "Wed", views: 47800 },
      { date: "Thu", views: 48200 },
      { date: "Fri", views: 49500 },
      { date: "Sat", views: 50000 },
      { date: "Sun", views: 48762 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["Public repls", "Basic AI features", "Community support"]
        },
        {
          name: "Hacker",
          price: "$7/month",
          features: ["Private repls", "Always-on repls", "Ghostwriter AI", "2GB RAM"]
        }
      ]
    }
  },
  
  // Video Generation
  {
    id: "11",
    name: "Runway ML",
    slug: "runway-ml",
    tagline: "Creative tools powered by machine learning for video editing",
    description: "Runway ML is a revolutionary AI-powered creative suite that brings advanced machine learning tools to video creators, filmmakers, and content producers. With its flagship Gen-2 model, users can generate high-quality videos from text prompts, transform existing footage with AI, and apply sophisticated editing effects that were previously impossible or extremely time-consuming. The platform democratizes professional-grade video production, making it accessible to creators at all skill levels.\n\nRunway's comprehensive toolkit includes features like background removal, motion tracking, object detection, and style transfer, all powered by cutting-edge AI models. The platform continuously evolves with new AI capabilities, allowing creators to experiment with generative video, real-time collaboration, and multi-modal content creation. Whether you're producing commercials, music videos, or social media content, Runway ML provides the tools to bring your creative vision to life faster and more efficiently than ever before.",
    logo: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=128&h=128&fit=crop",
    category: "Video Generation",
    categoryId: "video",
    upvotes: 1634,
    views: 58423,
    viewsWeek: 14562,
    viewsToday: 2341,
    trendPercentage: 95.2,
    website: "https://runwayml.com",
    twitter: "https://twitter.com/runwayml",
    screenshots: [
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 52000 },
      { date: "Tue", views: 54500 },
      { date: "Wed", views: 56200 },
      { date: "Thu", views: 57800 },
      { date: "Fri", views: 58000 },
      { date: "Sat", views: 58200 },
      { date: "Sun", views: 58423 },
    ],
    pricing: {
      model: "subscription",
      plans: [
        {
          name: "Standard",
          price: "$12/month",
          features: ["125 credits/month", "Gen-2 video generation", "720p exports", "Basic editing tools"]
        },
        {
          name: "Pro",
          price: "$28/month",
          features: ["625 credits/month", "4K exports", "Advanced AI tools", "Priority rendering", "Commercial usage"]
        }
      ]
    }
  },
  {
    id: "12",
    name: "Pika Labs",
    slug: "pika",
    tagline: "AI video generator that brings your ideas to life",
    description: "Pika Labs is an innovative AI video generation platform that transforms text and images into stunning video content. As one of the newest players in the generative AI space, Pika has quickly gained popularity for its intuitive interface and impressive video quality. Users can create videos by simply describing what they want to see, and Pika's advanced AI models bring those visions to reality with remarkable accuracy and creativity.\n\nWhat sets Pika apart is its ability to maintain temporal consistency across frames, ensuring smooth and coherent video output. The platform supports various styles from photorealistic to artistic, allowing creators to experiment with different aesthetics. Pika's rapid iteration cycle means users can quickly refine their generations, making it ideal for content creators, marketers, and anyone looking to explore the possibilities of AI-generated video content.",
    logo: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=128&h=128&fit=crop",
    category: "Video Generation",
    categoryId: "video",
    upvotes: 1423,
    views: 51234,
    viewsWeek: 13456,
    viewsToday: 2156,
    trendPercentage: 156.7,
    website: "https://pika.art",
    twitter: "https://twitter.com/pika_labs",
    isNew: true,
    screenshots: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 43000 },
      { date: "Tue", views: 45500 },
      { date: "Wed", views: 47200 },
      { date: "Thu", views: 48800 },
      { date: "Fri", views: 49500 },
      { date: "Sat", views: 50200 },
      { date: "Sun", views: 51234 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["Limited generations", "Standard quality", "Watermarked outputs", "Community access"]
        },
        {
          name: "Pro",
          price: "$10/month",
          features: ["Unlimited generations", "HD quality", "No watermark", "Priority queue", "Commercial license"]
        }
      ]
    }
  },
  {
    id: "13",
    name: "Synthesia",
    slug: "synthesia",
    tagline: "Create AI videos with avatars from text in minutes",
    description: "Synthesia is a leading AI video generation platform that enables users to create professional videos featuring AI avatars without cameras, microphones, or actors. Simply type your script, choose from over 140 diverse AI avatars speaking in 120+ languages, and Synthesia generates a polished video in minutes. This revolutionary approach to video creation has made it the go-to solution for corporate training, marketing, and educational content.\n\nThe platform excels at democratizing video production, removing traditional barriers like filming costs, scheduling talent, and post-production complexity. Synthesia's enterprise-grade features include custom avatar creation, brand templates, collaboration tools, and seamless integration with existing workflows. Whether you're creating product demos, explainer videos, or multilingual training materials, Synthesia streamlines the entire process while maintaining professional quality and consistency across all your video content.",
    logo: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=128&h=128&fit=crop",
    category: "Video Generation",
    categoryId: "video",
    upvotes: 1178,
    views: 45678,
    viewsWeek: 11234,
    viewsToday: 1876,
    trendPercentage: 51.3,
    website: "https://synthesia.io",
    twitter: "https://twitter.com/synthesiaIO",
    screenshots: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 41000 },
      { date: "Tue", views: 42200 },
      { date: "Wed", views: 43500 },
      { date: "Thu", views: 44200 },
      { date: "Fri", views: 44800 },
      { date: "Sat", views: 45200 },
      { date: "Sun", views: 45678 },
    ],
    pricing: {
      model: "subscription",
      plans: [
        {
          name: "Starter",
          price: "$22/month",
          features: ["10 minutes/month", "70+ avatars", "120+ languages", "Standard templates"]
        },
        {
          name: "Creator",
          price: "$67/month",
          features: ["30 minutes/month", "All avatars", "Custom templates", "Priority support", "1080p quality"]
        }
      ]
    }
  },
  
  // Audio & Voice
  {
    id: "14",
    name: "ElevenLabs",
    slug: "elevenlabs",
    tagline: "AI voice generator with realistic text-to-speech technology",
    description: "ElevenLabs is the industry leader in AI-powered voice synthesis, creating remarkably realistic and emotionally expressive speech that's virtually indistinguishable from human voices. The platform's advanced deep learning models capture subtle nuances like intonation, rhythm, and emotion, making it perfect for audiobooks, podcasts, video voiceovers, and accessibility applications. Users can choose from a diverse library of pre-built voices or clone their own voice for personalized content creation.\n\nWhat sets ElevenLabs apart is its multilingual support across 29 languages, voice cloning capabilities with just minutes of audio, and precise emotional control that allows creators to adjust tone, pacing, and style. The platform serves everyone from individual content creators to major publishers and game developers. With features like Projects for long-form content, Speech-to-Speech conversion, and an API for seamless integration, ElevenLabs is revolutionizing how we create and consume audio content in the digital age.",
    logo: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=128&h=128&fit=crop",
    category: "Audio & Voice",
    categoryId: "audio",
    upvotes: 1892,
    views: 67234,
    viewsWeek: 16782,
    viewsToday: 2678,
    trendPercentage: 73.4,
    website: "https://elevenlabs.io",
    twitter: "https://twitter.com/elevenlabsio",
    screenshots: [
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 61000 },
      { date: "Tue", views: 63200 },
      { date: "Wed", views: 64500 },
      { date: "Thu", views: 65800 },
      { date: "Fri", views: 66200 },
      { date: "Sat", views: 66800 },
      { date: "Sun", views: 67234 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["10,000 characters/month", "3 custom voices", "Multilingual support", "Basic voice library"]
        },
        {
          name: "Starter",
          price: "$5/month",
          features: ["30,000 characters/month", "10 custom voices", "Voice cloning", "Commercial license", "Priority support"]
        }
      ]
    }
  },
  {
    id: "15",
    name: "Suno AI",
    slug: "suno",
    tagline: "Generate complete songs with AI from text prompts",
    description: "Suno AI is revolutionizing music creation by enabling anyone to generate complete, professional-quality songs from simple text prompts. This groundbreaking platform uses advanced AI models to compose original music across any genre, complete with vocals, instrumentals, and production-quality mixing. Whether you describe a 'upbeat pop song about summer' or a 'melancholic jazz ballad,' Suno brings your musical ideas to life in seconds.\n\nWhat makes Suno truly remarkable is its ability to understand musical concepts, emotions, and styles, translating natural language into coherent, engaging songs. The platform handles everything from melody composition to lyric generation to vocal performance, making it accessible to both musicians looking for inspiration and non-musicians exploring creative expression. With its recent surge in popularity, Suno is democratizing music production and opening new possibilities for content creators, advertisers, and music enthusiasts worldwide.",
    logo: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=128&h=128&fit=crop",
    category: "Audio & Voice",
    categoryId: "audio",
    upvotes: 1523,
    views: 54234,
    viewsWeek: 14562,
    viewsToday: 2341,
    trendPercentage: 203.4,
    website: "https://suno.ai",
    twitter: "https://twitter.com/suno_ai_",
    isNew: true,
    screenshots: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 38000 },
      { date: "Tue", views: 42500 },
      { date: "Wed", views: 46200 },
      { date: "Thu", views: 49800 },
      { date: "Fri", views: 51500 },
      { date: "Sat", views: 53000 },
      { date: "Sun", views: 54234 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["50 credits/day", "Standard quality", "Public songs", "Community features"]
        },
        {
          name: "Pro",
          price: "$10/month",
          features: ["2,500 credits/month", "Priority generation", "Private songs", "Commercial use", "Higher quality"]
        }
      ]
    }
  },
  {
    id: "16",
    name: "Murf AI",
    slug: "murf-ai",
    tagline: "AI voice generator for podcasts, videos, and presentations",
    description: "Murf AI is a comprehensive AI voice generator designed specifically for professional content creators, offering studio-quality voiceovers for podcasts, videos, presentations, and e-learning content. With a library of over 120 natural-sounding voices across 20+ languages, Murf enables users to create engaging audio content without the need for professional voice actors or expensive recording equipment. The platform's intuitive editor allows precise control over pitch, speed, emphasis, and pauses.\n\nWhat distinguishes Murf is its focus on professional use cases and collaborative features. Teams can work together on projects, customize voice outputs with granular controls, and synchronize audio with video or slides. The platform also offers voice cloning for brand consistency and an API for integration into existing workflows. Whether you're creating training materials, marketing videos, or audiobooks, Murf AI delivers broadcast-quality voiceovers that sound authentic and engage your audience effectively.",
    logo: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=128&h=128&fit=crop",
    category: "Audio & Voice",
    categoryId: "audio",
    upvotes: 1087,
    views: 39876,
    viewsWeek: 10234,
    viewsToday: 1645,
    trendPercentage: 45.7,
    website: "https://murf.ai",
    screenshots: [
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 36000 },
      { date: "Tue", views: 37200 },
      { date: "Wed", views: 38100 },
      { date: "Thu", views: 38800 },
      { date: "Fri", views: 39200 },
      { date: "Sat", views: 39600 },
      { date: "Sun", views: 39876 },
    ],
    pricing: {
      model: "subscription",
      plans: [
        {
          name: "Basic",
          price: "$19/month",
          features: ["24 hours/year usage", "120+ voices", "10 languages", "Voice changer", "Basic support"]
        },
        {
          name: "Pro",
          price: "$26/month",
          features: ["48 hours/year usage", "All voices", "20+ languages", "Priority support", "Commercial rights", "Voice cloning"]
        }
      ]
    }
  },
  
  // Writing Tools
  {
    id: "17",
    name: "Jasper",
    slug: "jasper",
    tagline: "AI copilot for enterprise marketing teams",
    description: "Jasper is an enterprise-grade AI writing assistant designed to help marketing teams create high-quality content at scale. Built on advanced language models, Jasper generates blog posts, social media content, ad copy, emails, and more while maintaining your brand's unique voice and style. With features like Brand Voice customization, Teams collaboration, and SEO optimization, Jasper has become the go-to solution for businesses looking to accelerate their content production without sacrificing quality.\n\nWhat makes Jasper particularly powerful for enterprises is its ability to learn and replicate specific brand guidelines, tone of voice, and messaging frameworks. The platform integrates with popular tools like Surfer SEO for optimization, supports multiple languages, and offers templates for over 50 different content types. Whether you're scaling content marketing, running campaigns across multiple channels, or maintaining consistency across a large team, Jasper empowers marketers to work faster and smarter while maintaining creative control.",
    logo: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=128&h=128&fit=crop",
    category: "Writing",
    categoryId: "writing",
    upvotes: 1456,
    views: 52341,
    viewsWeek: 13234,
    viewsToday: 2123,
    trendPercentage: 38.2,
    website: "https://jasper.ai",
    twitter: "https://twitter.com/heyjasperai",
    screenshots: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 48000 },
      { date: "Tue", views: 49500 },
      { date: "Wed", views: 50200 },
      { date: "Thu", views: 51000 },
      { date: "Fri", views: 51800 },
      { date: "Sat", views: 52100 },
      { date: "Sun", views: 52341 },
    ],
    pricing: {
      model: "subscription",
      plans: [
        {
          name: "Creator",
          price: "$39/month",
          features: ["50,000 words/month", "50+ templates", "Brand voice", "Browser extension"]
        },
        {
          name: "Teams",
          price: "$99/month",
          features: ["Unlimited words", "3 seats", "SEO mode", "API access", "Priority support", "Custom templates"]
        }
      ]
    }
  },
  {
    id: "18",
    name: "Copy.ai",
    slug: "copy-ai",
    tagline: "AI-powered copywriter for marketing content",
    description: "Copy.ai is an AI-powered copywriting platform that helps marketers, entrepreneurs, and content creators generate high-converting marketing copy in seconds. From social media posts and product descriptions to email campaigns and blog content, Copy.ai's intelligent algorithms understand context and audience to produce engaging, on-brand content. The platform features over 90 copywriting tools and templates, making it easy to overcome writer's block and maintain consistent content output.\n\nWhat sets Copy.ai apart is its focus on marketing effectiveness and conversion optimization. The platform includes features like the Blog Wizard for long-form content, Campaign Builder for multi-channel marketing, and Infobase for brand knowledge management. With support for 25+ languages and continuous AI improvements, Copy.ai helps businesses scale their content marketing efforts while maintaining quality and relevance. Whether you're crafting ad copy, social posts, or sales emails, Copy.ai streamlines the creative process and delivers results.",
    logo: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=128&h=128&fit=crop",
    category: "Writing",
    categoryId: "writing",
    upvotes: 1234,
    views: 45678,
    viewsWeek: 11456,
    viewsToday: 1834,
    trendPercentage: 42.8,
    website: "https://copy.ai",
    twitter: "https://twitter.com/copy_ai",
    screenshots: [
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 41000 },
      { date: "Tue", views: 42500 },
      { date: "Wed", views: 43800 },
      { date: "Thu", views: 44500 },
      { date: "Fri", views: 45000 },
      { date: "Sat", views: 45400 },
      { date: "Sun", views: 45678 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["2,000 words/month", "90+ tools", "25+ languages", "Basic templates"]
        },
        {
          name: "Pro",
          price: "$36/month",
          features: ["Unlimited words", "Priority support", "Blog Wizard", "Brand voice", "Campaign Builder", "Infobase"]
        }
      ]
    }
  },
  {
    id: "19",
    name: "Notion AI",
    slug: "notion-ai",
    tagline: "AI assistant integrated into your Notion workspace",
    description: "Notion AI is a powerful writing and thinking assistant seamlessly integrated into the Notion workspace, helping millions of users write faster, think bigger, and work smarter. Unlike standalone AI tools, Notion AI understands the context of your entire workspace, allowing it to provide more relevant and personalized assistance. Whether you're drafting documents, summarizing meeting notes, generating action items, or brainstorming ideas, Notion AI works right where you're already working.\n\nWhat makes Notion AI particularly valuable is its contextual awareness and workspace integration. It can automatically fill database properties, translate content into multiple languages, adjust tone and style, and even help with coding or mathematical equations. For teams, it enhances collaboration by making information more accessible and actionable. With features like Q&A that searches across your entire workspace and autofill for databases, Notion AI transforms how individuals and teams capture, organize, and leverage knowledge.",
    logo: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=128&h=128&fit=crop",
    category: "Writing",
    categoryId: "writing",
    upvotes: 1789,
    views: 62345,
    viewsWeek: 15678,
    viewsToday: 2456,
    trendPercentage: 56.3,
    website: "https://notion.so/product/ai",
    twitter: "https://twitter.com/NotionHQ",
    screenshots: [
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 56000 },
      { date: "Tue", views: 58200 },
      { date: "Wed", views: 59500 },
      { date: "Thu", views: 60500 },
      { date: "Fri", views: 61200 },
      { date: "Sat", views: 61800 },
      { date: "Sun", views: 62345 },
    ],
    pricing: {
      model: "addon",
      plans: [
        {
          name: "Add-on",
          price: "$10/month",
          features: ["Unlimited AI responses", "Works across workspace", "All AI features", "Context awareness"]
        },
        {
          name: "Included Free",
          price: "20 responses",
          features: ["Trial AI features", "Basic assistance", "Limited responses", "Test before buying"]
        }
      ]
    }
  },
  {
    id: "20",
    name: "Grammarly",
    slug: "grammarly",
    tagline: "AI-powered writing assistant for clear communication",
    description: "Grammarly is the world's most popular AI-powered writing assistant, used by over 30 million people daily to write clearly and effectively. More than just a grammar checker, Grammarly provides real-time suggestions for grammar, spelling, punctuation, clarity, engagement, and delivery across all your devices and platforms. From emails and documents to social media posts and professional reports, Grammarly ensures your writing is polished, professional, and error-free.\n\nWhat distinguishes Grammarly is its comprehensive approach to writing improvement and broad platform support. The AI analyzes your writing style, suggests better word choices, detects tone, checks for plagiarism, and even provides genre-specific writing suggestions. With browser extensions, desktop apps, mobile keyboards, and integrations with Microsoft Office, Google Docs, Slack, and more, Grammarly works wherever you write. Whether you're a student, professional, or casual writer, Grammarly helps you communicate confidently and make a great impression every time.",
    logo: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=128&h=128&fit=crop",
    category: "Writing",
    categoryId: "writing",
    upvotes: 2123,
    views: 78945,
    viewsWeek: 19234,
    viewsToday: 3012,
    trendPercentage: 28.4,
    website: "https://grammarly.com",
    twitter: "https://twitter.com/Grammarly",
    screenshots: [
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 73000 },
      { date: "Tue", views: 75200 },
      { date: "Wed", views: 76500 },
      { date: "Thu", views: 77300 },
      { date: "Fri", views: 78000 },
      { date: "Sat", views: 78500 },
      { date: "Sun", views: 78945 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["Grammar checking", "Spelling", "Punctuation", "Conciseness", "Basic tone detection"]
        },
        {
          name: "Premium",
          price: "$12/month",
          features: ["All Free features", "Clarity suggestions", "Vocabulary enhancement", "Plagiarism detection", "Tone adjustments", "Full-sentence rewrites"]
        }
      ]
    }
  },
  
  // Data Analysis
  {
    id: "21",
    name: "Julius AI",
    slug: "julius-ai",
    tagline: "AI data analyst that interprets and visualizes your data",
    description: "Julius AI is an intelligent data analysis platform that acts as your personal data scientist, helping you analyze, visualize, and derive insights from your data through natural language conversations. Simply upload your data files (CSV, Excel, Google Sheets), ask questions in plain English, and Julius generates sophisticated analyses, charts, and statistical models without requiring coding knowledge. It's like having a data expert on demand, available 24/7 to answer your data questions.\n\nWhat makes Julius particularly powerful is its ability to perform complex statistical analyses, create publication-ready visualizations, and explain findings in clear, accessible language. The platform handles everything from basic descriptive statistics to advanced machine learning models, regression analyses, and predictive modeling. Whether you're a business analyst tracking KPIs, a researcher analyzing survey data, or a student working on a data project, Julius AI democratizes data science by making sophisticated analytical capabilities accessible to everyone, regardless of technical background.",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop",
    category: "Data Analysis",
    categoryId: "data",
    upvotes: 987,
    views: 34567,
    viewsWeek: 8976,
    viewsToday: 1456,
    trendPercentage: 67.9,
    website: "https://julius.ai",
    screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 29000 },
      { date: "Tue", views: 30500 },
      { date: "Wed", views: 31800 },
      { date: "Thu", views: 32900 },
      { date: "Fri", views: 33600 },
      { date: "Sat", views: 34100 },
      { date: "Sun", views: 34567 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["15 messages/month", "Basic analysis", "Chart generation", "Data upload"]
        },
        {
          name: "Pro",
          price: "$20/month",
          features: ["Unlimited messages", "Advanced analytics", "Python code execution", "API access", "Priority support", "Export reports"]
        }
      ]
    }
  },
  {
    id: "22",
    name: "ChatCSV",
    slug: "chatcsv",
    tagline: "Ask questions about your CSV files in natural language",
    description: "ChatCSV is a specialized AI tool that transforms how you interact with tabular data by allowing you to ask questions about your CSV files using everyday language. No SQL knowledge, no complex formulas—just upload your CSV file and start asking questions like 'What's the average sales by region?' or 'Show me the top 10 customers by revenue.' ChatCSV instantly processes your queries and returns accurate answers, charts, and insights, making data exploration accessible to everyone.\n\nWhat sets ChatCSV apart is its laser focus on simplicity and speed for CSV analysis. The platform handles large datasets efficiently, understands context from follow-up questions, and can generate various chart types to visualize your data. It's particularly valuable for business analysts, marketers, and anyone who regularly works with spreadsheet data but doesn't want to spend time writing formulas or pivot tables. With support for multiple file formats and the ability to ask unlimited questions, ChatCSV streamlines the entire data exploration process into a conversational interface.",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&h=128&fit=crop",
    category: "Data Analysis",
    categoryId: "data",
    upvotes: 756,
    views: 28345,
    viewsWeek: 7234,
    viewsToday: 1167,
    trendPercentage: 89.3,
    website: "https://chatcsv.co",
    screenshots: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 22000 },
      { date: "Tue", views: 23800 },
      { date: "Wed", views: 25200 },
      { date: "Thu", views: 26400 },
      { date: "Fri", views: 27200 },
      { date: "Sat", views: 27800 },
      { date: "Sun", views: 28345 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["5 files", "Limited messages", "Basic charts", "Up to 100MB files"]
        },
        {
          name: "Pro",
          price: "$9/month",
          features: ["Unlimited files", "Unlimited messages", "All chart types", "Up to 500MB files", "Priority processing", "Export results"]
        }
      ]
    }
  },
  
  // Automation
  {
    id: "23",
    name: "Make (Integromat)",
    slug: "make",
    tagline: "Visual automation platform with AI capabilities",
    description: "Make (formerly Integromat) is a powerful visual automation platform that enables users to design, build, and automate workflows across thousands of apps and services without writing code. With its intuitive drag-and-drop interface, users can create sophisticated automation scenarios that connect their favorite tools, transfer data, and execute complex business logic. The platform has embraced AI capabilities, allowing users to integrate AI services, process data intelligently, and create smart workflows that adapt to changing conditions.\n\nWhat makes Make exceptional is its visual workflow builder that clearly shows how data flows between apps, making complex automations easy to understand and debug. Unlike simple automation tools, Make offers advanced features like routers, iterators, aggregators, and error handling, enabling users to build enterprise-grade integrations. Whether you're synchronizing data between CRM and marketing tools, processing documents with AI, or building custom business workflows, Make provides the flexibility and power to automate virtually any task while maintaining complete visibility and control over your processes.",
    logo: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=128&h=128&fit=crop",
    category: "Automation",
    categoryId: "automation",
    upvotes: 1345,
    views: 48762,
    viewsWeek: 12456,
    viewsToday: 2001,
    trendPercentage: 41.2,
    website: "https://make.com",
    twitter: "https://twitter.com/make",
    screenshots: [
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 44000 },
      { date: "Tue", views: 45800 },
      { date: "Wed", views: 46900 },
      { date: "Thu", views: 47600 },
      { date: "Fri", views: 48100 },
      { date: "Sat", views: 48400 },
      { date: "Sun", views: 48762 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["1,000 operations/month", "Active scenarios: 2", "15-minute intervals", "Basic support"]
        },
        {
          name: "Core",
          price: "$9/month",
          features: ["10,000 operations/month", "Unlimited active scenarios", "1-minute intervals", "Priority support", "Custom functions"]
        }
      ]
    }
  },
  {
    id: "24",
    name: "Zapier AI",
    slug: "zapier-ai",
    tagline: "Automate workflows with AI-powered integrations",
    description: "Zapier AI brings artificial intelligence to the world's most popular automation platform, enabling users to create smarter, more adaptive workflows that connect over 6,000 apps. With AI-powered features like natural language automation building, intelligent data formatting, and ChatGPT integration, Zapier AI makes it easier than ever to automate complex business processes. Simply describe what you want to automate in plain English, and Zapier AI will suggest and build the workflow for you, dramatically reducing the time and technical knowledge needed to create powerful automations.\n\nWhat distinguishes Zapier AI is its combination of extensive app integrations with cutting-edge AI capabilities. The platform now includes AI-powered tools for content generation, data extraction, sentiment analysis, and decision-making within automated workflows. Whether you're automating customer support with AI responses, enriching data with intelligent categorization, or creating dynamic content pipelines, Zapier AI empowers businesses to work smarter by combining the power of automation with the intelligence of AI. With features like AI-assisted Zap building and pre-built AI templates, even non-technical users can create sophisticated, intelligent automations.",
    logo: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=128&h=128&fit=crop",
    category: "Automation",
    categoryId: "automation",
    upvotes: 1567,
    views: 56234,
    viewsWeek: 14562,
    viewsToday: 2341,
    trendPercentage: 35.7,
    website: "https://zapier.com/ai",
    twitter: "https://twitter.com/zapier",
    screenshots: [
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 51000 },
      { date: "Tue", views: 52800 },
      { date: "Wed", views: 54100 },
      { date: "Thu", views: 55000 },
      { date: "Fri", views: 55600 },
      { date: "Sat", views: 56000 },
      { date: "Sun", views: 56234 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["100 tasks/month", "5 Zaps", "15-minute updates", "Basic AI actions"]
        },
        {
          name: "Professional",
          price: "$19.99/month",
          features: ["750 tasks/month", "Unlimited Zaps", "2-minute updates", "Premium apps", "Advanced AI features", "Multi-step Zaps"]
        }
      ]
    }
  },
  
  // Additional Popular Tools
  {
    id: "25",
    name: "Llama 3",
    slug: "llama-3",
    tagline: "Meta's open-source large language model",
    description: "Llama 3 is Meta's latest generation of open-source large language models, representing a significant leap forward in accessible AI technology. As one of the most powerful openly available LLMs, Llama 3 comes in multiple sizes (8B, 70B parameters) and offers performance that rivals proprietary models like GPT-4 on many benchmarks. Being open-source, Llama 3 can be downloaded, customized, and deployed on your own infrastructure, giving developers and researchers unprecedented control and flexibility.\n\nWhat makes Llama 3 particularly significant is its combination of powerful capabilities with true openness. Unlike closed-source models, you can fine-tune Llama 3 for specific use cases, run it locally for privacy-sensitive applications, or integrate it into commercial products without restrictive API costs. The model excels at reasoning, coding, multilingual tasks, and following complex instructions. For organizations concerned about data privacy, cost control, or vendor lock-in, Llama 3 provides a viable alternative to commercial AI services while maintaining state-of-the-art performance.",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
    category: "AI Assistant",
    categoryId: "chat",
    upvotes: 1423,
    views: 52341,
    viewsWeek: 13456,
    viewsToday: 2167,
    trendPercentage: 71.2,
    website: "https://llama.meta.com",
    github: "https://github.com/meta-llama/llama3",
    screenshots: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 46000 },
      { date: "Tue", views: 48200 },
      { date: "Wed", views: 49500 },
      { date: "Thu", views: 50800 },
      { date: "Fri", views: 51500 },
      { date: "Sat", views: 52000 },
      { date: "Sun", views: 52341 },
    ],
    pricing: {
      model: "free",
      plans: [
        {
          name: "Open Source",
          price: "Free",
          features: ["Full model access", "Commercial use allowed", "Self-hosting", "Fine-tuning capable", "No API costs"]
        },
        {
          name: "Cloud Hosting",
          price: "Variable",
          features: ["Third-party hosting", "Managed infrastructure", "Scalable deployment", "Pay per usage", "Enterprise support"]
        }
      ]
    }
  },
  {
    id: "26",
    name: "HeyGen",
    slug: "heygen",
    tagline: "AI video generator with customizable avatars",
    description: "HeyGen is an innovative AI video platform that enables users to create engaging video content with customizable AI avatars that speak in over 40 languages. Unlike traditional video production that requires cameras, studios, and actors, HeyGen allows you to simply type your script, select an avatar, and generate professional-quality videos in minutes. The platform is particularly popular for creating training videos, product demos, social media content, and multilingual marketing materials without the traditional costs and complexity of video production.\n\nWhat sets HeyGen apart is its remarkably realistic avatar technology and voice synthesis that creates natural-looking videos with proper lip-syncing and expressions. Users can create custom avatars from photos, choose from diverse pre-built avatars, or even clone their own voice for personalized content at scale. The platform includes features like auto-captions, background customization, and templates for various use cases. For businesses looking to scale video content production globally, HeyGen provides an efficient, cost-effective solution that maintains quality and authenticity across multiple languages and markets.",
    logo: "https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=128&h=128&fit=crop",
    category: "Video Generation",
    categoryId: "video",
    upvotes: 1178,
    views: 43567,
    viewsWeek: 11234,
    viewsToday: 1876,
    trendPercentage: 92.4,
    website: "https://heygen.com",
    screenshots: [
      "https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 38000 },
      { date: "Tue", views: 39800 },
      { date: "Wed", views: 41200 },
      { date: "Thu", views: 42100 },
      { date: "Fri", views: 42800 },
      { date: "Sat", views: 43200 },
      { date: "Sun", views: 43567 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["1 minute credit", "120+ avatars", "300+ voices", "Basic templates"]
        },
        {
          name: "Creator",
          price: "$24/month",
          features: ["15 minutes/month", "Custom avatar", "Voice cloning", "Priority support", "1080p export", "API access"]
        }
      ]
    }
  },
  {
    id: "27",
    name: "Tabnine",
    slug: "tabnine",
    tagline: "AI code completion tool for developers",
    description: "Tabnine is a powerful AI code assistant that accelerates software development by providing intelligent code completions across your entire codebase. Unlike basic autocomplete tools, Tabnine uses advanced machine learning models trained on billions of lines of code to understand context and suggest whole-line and full-function completions. It supports over 30 programming languages and integrates seamlessly with popular IDEs like VS Code, IntelliJ, and PyCharm, making it a natural extension of your development workflow.\n\nWhat makes Tabnine particularly valuable for professional developers and enterprises is its privacy-first approach and customization capabilities. The platform offers both cloud-based and on-premises deployment options, ensuring your code never leaves your infrastructure if required. Tabnine can be trained on your private codebase to learn your team's coding patterns and standards, providing personalized suggestions that align with your specific architecture and style guidelines. With features like AI chat for code explanations and documentation, Tabnine helps developers write better code faster while maintaining security and compliance standards.",
    logo: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=128&h=128&fit=crop",
    category: "Code Assistant",
    categoryId: "code",
    upvotes: 1089,
    views: 39876,
    viewsWeek: 10234,
    viewsToday: 1645,
    trendPercentage: 33.8,
    website: "https://tabnine.com",
    screenshots: [
      "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 36000 },
      { date: "Tue", views: 37200 },
      { date: "Wed", views: 38100 },
      { date: "Thu", views: 38900 },
      { date: "Fri", views: 39400 },
      { date: "Sat", views: 39700 },
      { date: "Sun", views: 39876 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["Basic code completions", "Limited AI suggestions", "All IDEs supported", "Community support"]
        },
        {
          name: "Pro",
          price: "$12/month",
          features: ["Advanced completions", "Whole-line suggestions", "Natural language to code", "Priority support", "Team training"]
        }
      ]
    }
  },
  {
    id: "28",
    name: "Leonardo AI",
    slug: "leonardo-ai",
    tagline: "AI art generation with fine-tuned control",
    description: "Leonardo AI is a sophisticated AI art generation platform that provides creators with unprecedented control over their visual content. Unlike other AI image generators that produce unpredictable results, Leonardo focuses on giving users fine-grained control through features like custom AI models, controlnets, and advanced prompt engineering tools. The platform is particularly popular among game developers, concept artists, and digital illustrators who need consistent, production-ready assets with specific artistic styles and characteristics.\n\nWhat distinguishes Leonardo AI is its emphasis on creative control and asset generation for professional workflows. Users can train custom models on their own artwork to maintain consistent styles, use reference images to guide compositions, and generate variations of existing designs. The platform includes specialized tools for creating game assets, character designs, environments, and textures, with features like outpainting, background removal, and upscaling. With both web-based and API access, Leonardo AI bridges the gap between creative experimentation and production-grade content creation, making it indispensable for creative professionals seeking to leverage AI while maintaining artistic vision.",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
    category: "Image Generation",
    categoryId: "image",
    upvotes: 1234,
    views: 46789,
    viewsWeek: 12345,
    viewsToday: 1987,
    trendPercentage: 68.5,
    website: "https://leonardo.ai",
    screenshots: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 41000 },
      { date: "Tue", views: 42800 },
      { date: "Wed", views: 44200 },
      { date: "Thu", views: 45400 },
      { date: "Fri", views: 46100 },
      { date: "Sat", views: 46500 },
      { date: "Sun", views: 46789 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["150 tokens/day", "Basic models", "Community models", "Standard resolution"]
        },
        {
          name: "Apprentice",
          price: "$12/month",
          features: ["8,500 tokens/month", "Private generation", "Custom models", "High resolution", "Priority queue", "API access"]
        }
      ]
    }
  },
  {
    id: "29",
    name: "Descript",
    slug: "descript",
    tagline: "AI-powered video and podcast editing",
    description: "Descript revolutionizes video and podcast editing by treating media like a document—simply edit the transcript and your audio and video automatically update to match. This innovative approach makes professional editing accessible to non-editors, allowing creators to cut, rearrange, and refine their content by editing text rather than wrestling with traditional timeline editors. With AI-powered features like Studio Sound for audio enhancement, filler word removal, and Overdub for voice cloning, Descript streamlines the entire post-production workflow.\n\nWhat makes Descript truly exceptional is its comprehensive suite of AI-powered tools that go beyond basic editing. The platform includes automatic transcription with industry-leading accuracy, AI-generated titles and descriptions, eye contact correction for video calls, and green screen effects—all integrated into a single, intuitive interface. Whether you're a podcaster publishing weekly episodes, a YouTube creator producing video content, or a business professional creating training materials, Descript combines the power of professional editing tools with the simplicity of word processing, making high-quality content production faster and more accessible than ever.",
    logo: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=128&h=128&fit=crop",
    category: "Video Generation",
    categoryId: "video",
    upvotes: 1456,
    views: 51234,
    viewsWeek: 13456,
    viewsToday: 2156,
    trendPercentage: 54.3,
    website: "https://descript.com",
    screenshots: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 46000 },
      { date: "Tue", views: 47800 },
      { date: "Wed", views: 49100 },
      { date: "Thu", views: 50000 },
      { date: "Fri", views: 50600 },
      { date: "Sat", views: 51000 },
      { date: "Sun", views: 51234 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["1 hour transcription/month", "Basic editing", "Watermarked exports", "720p video"]
        },
        {
          name: "Creator",
          price: "$24/month",
          features: ["10 hours transcription", "Overdub voice cloning", "Studio Sound", "4K exports", "Screen recording", "AI features"]
        }
      ]
    }
  },
  {
    id: "30",
    name: "Wordtune",
    slug: "wordtune",
    tagline: "AI writing companion for rewriting and rephrasing",
    description: "Wordtune is an AI-powered writing companion that helps you express your ideas more clearly and effectively by offering intelligent suggestions for rewriting and rephrasing your text. Unlike grammar checkers that only fix errors, Wordtune understands the meaning and context of your writing, offering multiple ways to rewrite sentences to improve clarity, adjust tone, or enhance impact. With a simple highlight and click, you can see alternative phrasings that range from formal to casual, concise to expanded, making it perfect for emails, documents, articles, and more.\n\nWhat makes Wordtune particularly valuable is its focus on helping you sound like yourself, only better. The AI suggests rewrites that maintain your voice while improving readability and professionalism. Wordtune also includes features like Spices for generating content (statistics, examples, jokes), summarization for long articles, and translation capabilities. Whether you're a non-native English speaker looking to write more naturally, a professional seeking to refine your communications, or a student working on essays, Wordtune acts as a real-time writing coach that helps you craft more effective messages with confidence.",
    logo: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=128&h=128&fit=crop",
    category: "Writing",
    categoryId: "writing",
    upvotes: 987,
    views: 36789,
    viewsWeek: 9456,
    viewsToday: 1523,
    trendPercentage: 39.7,
    website: "https://wordtune.com",
    screenshots: [
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200&h=675&fit=crop",
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=675&fit=crop",
    ],
    trendData: [
      { date: "Mon", views: 33000 },
      { date: "Tue", views: 34200 },
      { date: "Wed", views: 35100 },
      { date: "Thu", views: 35900 },
      { date: "Fri", views: 36300 },
      { date: "Sat", views: 36600 },
      { date: "Sun", views: 36789 },
    ],
    pricing: {
      model: "freemium",
      plans: [
        {
          name: "Free",
          price: "$0/month",
          features: ["10 rewrites/day", "3 Spices/day", "Basic tone adjustments", "Browser extension"]
        },
        {
          name: "Premium",
          price: "$9.99/month",
          features: ["Unlimited rewrites", "Unlimited Spices", "Tone & length control", "Premium support", "Custom recommendations"]
        }
      ]
    }
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
