/**
 * AI-Powered Tool Classification and Data Cleaning
 * Uses Claude/GPT to analyze, categorize, and enhance tool data
 */

import type { ScrapedToolData } from './toolScraper';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 2025 AI Tool Categories
export const AI_CATEGORIES = [
  'AI Assistants',
  'Image Generation',
  'Video Generation',
  'Audio Tools',
  'Music AI',
  'Coding AI',
  'Writing Tools',
  'SEO Tools',
  'Agents',
  'Productivity AI',
  'LLMs & Models',
  'Voice & Speech',
  'Developer Tools',
  'Design & Editing',
  'OCR & Computer Vision',
  'Data Analysis',
  'Marketing AI',
  'Customer Support AI',
  'API Tools',
  'Automation Tools',
  'Agents & Orchestrators',
  'Research AI',
] as const;

export interface CleanedToolData {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  pricing: {
    model: string;
    plans?: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
  categories: string[];
  tags: string[];
  seoSummary: string;
  logo?: string;
  screenshots?: string[];
  website: string;
  twitter?: string;
  github?: string;
  confidence: number; // 0-100
}

/**
 * Clean and enhance tool data using AI
 */
export async function cleanAndClassifyTool(
  scrapedData: ScrapedToolData
): Promise<CleanedToolData> {
  console.log(`Cleaning and classifying: ${scrapedData.name}`);

  // Prepare the prompt for AI
  const prompt = createClassificationPrompt(scrapedData);

  // Call AI model (try Claude first, fallback to GPT)
  let aiResponse: any;
  try {
    aiResponse = await callClaudeAPI(prompt);
  } catch (error) {
    console.error('Claude API error, trying OpenAI:', error);
    try {
      aiResponse = await callOpenAI(prompt);
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      // Fallback to rule-based classification
      return fallbackClassification(scrapedData);
    }
  }

  // Parse AI response
  const cleaned = parseAIResponse(aiResponse, scrapedData);

  return cleaned;
}

/**
 * Create classification prompt for AI
 */
function createClassificationPrompt(data: ScrapedToolData): string {
  return `You are an AI tool analyst. Analyze the following scraped data from an AI tool website and return structured, clean JSON.

Tool Data:
Name: ${data.name}
Website: ${data.website}
Tagline: ${data.tagline || 'Not provided'}
Description: ${data.description || 'Not provided'}
Raw Content Preview: ${data.rawContent.slice(0, 2000)}

Please analyze and return a JSON object with these fields:

1. name: Clean, proper name (no extra text)
2. tagline: Catchy, clear tagline (max 100 chars)
3. description: Well-written description (200-500 words)
4. features: Array of 5-10 key features (clear, benefit-focused)
5. pricing: Object with:
   - model: One of [free, freemium, paid, subscription, one-time, enterprise]
   - plans: Array of pricing tiers (if available)
6. categories: Array of 1-3 categories from this list ONLY: ${AI_CATEGORIES.join(', ')}
7. tags: Array of 8-15 relevant tags
8. seoSummary: SEO-optimized summary (150-160 chars, include main keywords)
9. confidence: Your confidence in this classification (0-100)

Important:
- Categories MUST be from the provided list
- Description should be engaging and informative
- Features should be specific benefits, not generic
- Tags should include technology stack, use cases, and target users
- Ensure all text is grammatically correct and professional

Return ONLY valid JSON, no markdown or explanation.`;
}

/**
 * Call Claude API
 */
async function callClaudeAPI(prompt: string): Promise<any> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Claude API key not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt: string): Promise<any> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an AI tool analyst that returns only valid JSON responses.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Parse AI response into structured data
 */
function parseAIResponse(aiResponse: string, original: ScrapedToolData): CleanedToolData {
  try {
    // Remove markdown code blocks if present
    let jsonStr = aiResponse.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }

    const parsed = JSON.parse(jsonStr);

    // Validate and sanitize
    return {
      name: parsed.name || original.name,
      tagline: (parsed.tagline || original.tagline || '').slice(0, 200),
      description: parsed.description || original.description || '',
      features: Array.isArray(parsed.features) ? parsed.features.slice(0, 15) : [],
      pricing: {
        model: parsed.pricing?.model || 'freemium',
        plans: parsed.pricing?.plans || [],
      },
      categories: validateCategories(parsed.categories),
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 20) : [],
      seoSummary: (parsed.seoSummary || '').slice(0, 160),
      logo: original.logo,
      screenshots: original.screenshots,
      website: original.website,
      twitter: original.twitter,
      github: original.github,
      confidence: Math.min(100, Math.max(0, parsed.confidence || 70)),
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return fallbackClassification(original);
  }
}

/**
 * Validate that categories are from the approved list
 */
function validateCategories(categories: any): string[] {
  if (!Array.isArray(categories)) return ['AI Assistants'];

  const validCategories = categories.filter(cat =>
    AI_CATEGORIES.includes(cat as any)
  );

  return validCategories.length > 0 ? validCategories.slice(0, 3) : ['AI Assistants'];
}

/**
 * Fallback classification without AI
 */
function fallbackClassification(data: ScrapedToolData): CleanedToolData {
  // Simple keyword-based categorization
  const content = `${data.name} ${data.tagline} ${data.description}`.toLowerCase();

  const categoryKeywords: Record<string, string[]> = {
    'Image Generation': ['image', 'photo', 'picture', 'visual', 'midjourney', 'stable diffusion'],
    'Video Generation': ['video', 'animation', 'motion', 'film'],
    'Coding AI': ['code', 'programming', 'developer', 'github', 'copilot'],
    'Writing Tools': ['writing', 'content', 'copywriting', 'blog', 'article'],
    'Chatbot': ['chat', 'conversation', 'messaging', 'support'],
    'Voice & Speech': ['voice', 'speech', 'audio', 'tts', 'stt'],
    'Data Analysis': ['data', 'analytics', 'insights', 'visualization'],
  };

  const detectedCategories: string[] = [];
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => content.includes(kw))) {
      detectedCategories.push(category);
    }
  }

  return {
    name: data.name,
    tagline: data.tagline || `AI-powered ${data.name}`,
    description: data.description || `${data.name} is an innovative AI tool.`,
    features: data.features || [],
    pricing: data.pricing || { model: 'freemium' },
    categories: detectedCategories.length > 0 ? detectedCategories : ['AI Assistants'],
    tags: data.tags || [],
    seoSummary: `${data.name} - AI tool for productivity and automation`,
    logo: data.logo,
    screenshots: data.screenshots,
    website: data.website,
    twitter: data.twitter,
    github: data.github,
    confidence: 50,
  };
}

/**
 * Batch classify multiple tools
 */
export async function batchClassifyTools(
  tools: ScrapedToolData[]
): Promise<CleanedToolData[]> {
  const results: CleanedToolData[] = [];

  for (const tool of tools) {
    try {
      const cleaned = await cleanAndClassifyTool(tool);
      results.push(cleaned);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`Error classifying ${tool.name}:`, error);
      results.push(fallbackClassification(tool));
    }
  }

  return results;
}

/**
 * Generate slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
