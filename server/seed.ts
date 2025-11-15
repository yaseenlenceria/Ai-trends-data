import { db } from "./db";
import { categories, tools, sponsors } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Seed categories
    console.log("📁 Seeding categories...");
    const seedCategories = await db
      .insert(categories)
      .values([
        {
          name: "AI Assistant",
          slug: "chat",
          icon: "MessageSquare",
          description: "Conversational AI and chatbots",
        },
        {
          name: "Image Generation",
          slug: "image",
          icon: "Image",
          description: "AI-powered image creation and editing",
        },
        {
          name: "Code Assistant",
          slug: "code",
          icon: "Code",
          description: "AI tools for developers and coding",
        },
        {
          name: "Video Generation",
          slug: "video",
          icon: "Video",
          description: "AI video creation and editing tools",
        },
        {
          name: "Audio & Voice",
          slug: "audio",
          icon: "Mic",
          description: "Voice synthesis and audio generation",
        },
        {
          name: "Writing",
          slug: "writing",
          icon: "FileText",
          description: "AI writing assistants and content creation",
        },
        {
          name: "Data Analysis",
          slug: "data",
          icon: "Database",
          description: "AI-powered data analysis and insights",
        },
        {
          name: "Automation",
          slug: "automation",
          icon: "Zap",
          description: "AI workflow automation tools",
        },
      ])
      .returning();
    console.log(`✅ Created ${seedCategories.length} categories`);

    // Get category IDs by slug for reference
    const categoryMap = seedCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat.id;
      return acc;
    }, {} as Record<string, string>);

    // Seed tools
    console.log("🔧 Seeding tools...");
    const seedTools = await db
      .insert(tools)
      .values([
        // AI Assistants
        {
          name: "ChatGPT",
          slug: "chatgpt",
          tagline: "Conversational AI that understands and generates human-like text",
          description: "ChatGPT is a state-of-the-art conversational AI developed by OpenAI. It uses advanced natural language processing to understand context, generate human-like responses, and assist with a wide variety of tasks.",
          logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
          categoryId: categoryMap.chat,
          upvotes: 2847,
          views: 125632,
          viewsWeek: 28847,
          viewsToday: 4521,
          trendPercentage: 24,
          website: "https://chat.openai.com",
          status: "approved",
          screenshots: [
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop",
            "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=1200&h=675&fit=crop",
          ],
          pricing: {
            model: "freemium",
            plans: [
              {
                name: "Free",
                price: "$0/month",
                features: ["GPT-3.5 access", "Standard response time", "Limited availability"],
              },
              {
                name: "Plus",
                price: "$20/month",
                features: ["GPT-4 access", "Faster response time", "Priority access"],
              },
            ],
          },
        },
        {
          name: "Claude",
          slug: "claude",
          tagline: "AI assistant by Anthropic focused on being helpful, harmless, and honest",
          description: "Claude is an AI assistant created by Anthropic. It's designed to be helpful, harmless, and honest, with strong capabilities in analysis, coding, writing, and creative tasks.",
          logo: "https://images.unsplash.com/photo-1655721531775-ca85c79aa590?w=128&h=128&fit=crop",
          categoryId: categoryMap.chat,
          upvotes: 1923,
          views: 98432,
          viewsWeek: 21543,
          viewsToday: 3214,
          trendPercentage: 32,
          website: "https://claude.ai",
          status: "approved",
          screenshots: [
            "https://images.unsplash.com/photo-1655721531775-ca85c79aa590?w=1200&h=675&fit=crop",
          ],
          pricing: {
            model: "freemium",
            plans: [
              {
                name: "Free",
                price: "$0/month",
                features: ["Claude access", "Message limits", "Standard features"],
              },
              {
                name: "Pro",
                price: "$20/month",
                features: ["Extended usage", "Priority access", "Advanced features"],
              },
            ],
          },
        },
        // Image Generation
        {
          name: "Midjourney",
          slug: "midjourney",
          tagline: "AI art generator creating stunning images from text descriptions",
          description: "Midjourney is an independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species through AI-generated art.",
          logo: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=128&h=128&fit=crop",
          categoryId: categoryMap.image,
          upvotes: 3421,
          views: 156789,
          viewsWeek: 34521,
          viewsToday: 5234,
          trendPercentage: 18,
          website: "https://midjourney.com",
          status: "approved",
          screenshots: [
            "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1200&h=675&fit=crop",
          ],
          pricing: {
            model: "subscription",
            plans: [
              {
                name: "Basic",
                price: "$10/month",
                features: ["200 images/month", "Personal use", "General commercial terms"],
              },
              {
                name: "Standard",
                price: "$30/month",
                features: ["Unlimited images", "Relax mode", "Commercial terms"],
              },
            ],
          },
        },
        {
          name: "DALL·E 3",
          slug: "dalle-3",
          tagline: "OpenAI's most advanced image generation model",
          description: "DALL·E 3 is OpenAI's latest image generation model that can create highly detailed images from text descriptions with improved prompt following and safety features.",
          logo: "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=128&h=128&fit=crop",
          categoryId: categoryMap.image,
          upvotes: 2156,
          views: 112345,
          viewsWeek: 25432,
          viewsToday: 3876,
          trendPercentage: 28,
          website: "https://openai.com/dall-e-3",
          status: "approved",
        },
        // Code Assistants
        {
          name: "GitHub Copilot",
          slug: "github-copilot",
          tagline: "AI pair programmer that helps you write code faster",
          description: "GitHub Copilot uses OpenAI's Codex to suggest code and entire functions in real-time, right from your editor. It's trained on billions of lines of code.",
          logo: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=128&h=128&fit=crop",
          categoryId: categoryMap.code,
          upvotes: 2789,
          views: 134567,
          viewsWeek: 29876,
          viewsToday: 4321,
          trendPercentage: 21,
          website: "https://github.com/features/copilot",
          status: "approved",
          pricing: {
            model: "subscription",
            plans: [
              {
                name: "Individual",
                price: "$10/month",
                features: ["Code suggestions", "Chat in IDE", "CLI assistance"],
              },
              {
                name: "Business",
                price: "$19/user/month",
                features: ["Everything in Individual", "Policy management", "Organization-wide"],
              },
            ],
          },
        },
        {
          name: "Cursor",
          slug: "cursor",
          tagline: "AI-first code editor built for productivity",
          description: "Cursor is an AI-powered code editor that helps you code faster with AI assistance, smart autocomplete, and natural language commands.",
          logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&h=128&fit=crop",
          categoryId: categoryMap.code,
          upvotes: 1567,
          views: 87654,
          viewsWeek: 19234,
          viewsToday: 2876,
          trendPercentage: 45,
          website: "https://cursor.sh",
          status: "approved",
        },
        // Video Generation
        {
          name: "Runway",
          slug: "runway",
          tagline: "AI-powered video editing and generation platform",
          description: "Runway is a comprehensive AI video platform offering text-to-video, image-to-video, and advanced video editing capabilities powered by AI.",
          logo: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=128&h=128&fit=crop",
          categoryId: categoryMap.video,
          upvotes: 1876,
          views: 94321,
          viewsWeek: 21098,
          viewsToday: 3124,
          trendPercentage: 35,
          website: "https://runwayml.com",
          status: "approved",
        },
        // Audio & Voice
        {
          name: "ElevenLabs",
          slug: "elevenlabs",
          tagline: "Realistic AI voice generation and voice cloning",
          description: "ElevenLabs offers state-of-the-art AI voice synthesis with natural-sounding voices, voice cloning, and multilingual support.",
          logo: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=128&h=128&fit=crop",
          categoryId: categoryMap.audio,
          upvotes: 2234,
          views: 108765,
          viewsWeek: 24321,
          viewsToday: 3654,
          trendPercentage: 29,
          website: "https://elevenlabs.io",
          status: "approved",
          pricing: {
            model: "freemium",
            plans: [
              {
                name: "Free",
                price: "$0/month",
                features: ["10,000 characters/month", "3 custom voices", "Personal use"],
              },
              {
                name: "Starter",
                price: "$5/month",
                features: ["30,000 characters/month", "10 custom voices", "Commercial use"],
              },
            ],
          },
        },
        // Writing
        {
          name: "Jasper",
          slug: "jasper",
          tagline: "AI writing assistant for marketing teams",
          description: "Jasper is an AI writing tool designed specifically for marketing teams to create high-quality content, ad copy, and marketing materials.",
          logo: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=128&h=128&fit=crop",
          categoryId: categoryMap.writing,
          upvotes: 1654,
          views: 82345,
          viewsWeek: 18234,
          viewsToday: 2654,
          trendPercentage: 15,
          website: "https://jasper.ai",
          status: "approved",
        },
        {
          name: "Grammarly",
          slug: "grammarly",
          tagline: "AI-powered writing assistant for clear communication",
          description: "Grammarly uses AI to help you write clearly and effectively, with grammar checking, style suggestions, and tone detection.",
          logo: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=128&h=128&fit=crop",
          categoryId: categoryMap.writing,
          upvotes: 3124,
          views: 145678,
          viewsWeek: 32456,
          viewsToday: 4876,
          trendPercentage: 12,
          website: "https://grammarly.com",
          status: "approved",
        },
        // Data Analysis
        {
          name: "Tableau AI",
          slug: "tableau-ai",
          tagline: "AI-powered data analytics and visualization",
          description: "Tableau combines powerful data visualization with AI-driven insights to help you understand and communicate data more effectively.",
          logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop",
          categoryId: categoryMap.data,
          upvotes: 987,
          views: 56789,
          viewsWeek: 12345,
          viewsToday: 1876,
          trendPercentage: 19,
          website: "https://tableau.com",
          status: "approved",
        },
        // Automation
        {
          name: "Zapier AI",
          slug: "zapier-ai",
          tagline: "Automate workflows with AI-powered integrations",
          description: "Zapier connects your apps and automates workflows with AI-enhanced automation capabilities for no-code workflow creation.",
          logo: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=128&h=128&fit=crop",
          categoryId: categoryMap.automation,
          upvotes: 2456,
          views: 118765,
          viewsWeek: 26543,
          viewsToday: 3987,
          trendPercentage: 22,
          website: "https://zapier.com",
          status: "approved",
        },
      ])
      .returning();
    console.log(`✅ Created ${seedTools.length} tools`);

    // Seed sponsors
    console.log("💎 Seeding sponsors...");
    const seedSponsors = await db
      .insert(sponsors)
      .values([
        {
          name: "OpenAI",
          logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop",
          description: "Leading AI research company creating safe and beneficial AGI",
          url: "https://openai.com",
          tier: "premium",
        },
        {
          name: "Anthropic",
          logo: "https://images.unsplash.com/photo-1655721531775-ca85c79aa590?w=200&h=200&fit=crop",
          description: "AI safety company building reliable, interpretable, and steerable AI systems",
          url: "https://anthropic.com",
          tier: "premium",
        },
        {
          name: "Hugging Face",
          logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&h=200&fit=crop",
          description: "The AI community building the future of machine learning",
          url: "https://huggingface.co",
          tier: "standard",
        },
      ])
      .returning();
    console.log(`✅ Created ${seedSponsors.length} sponsors`);

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("✅ Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
