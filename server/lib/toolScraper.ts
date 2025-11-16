/**
 * Tool Scraper
 * Extracts structured tool data from web pages using Jina Reader
 */

import { jinaReader, type JinaReaderResult } from './jinaClient';

export interface ScrapedToolData {
  name: string;
  tagline?: string;
  description?: string;
  features?: string[];
  pricing?: {
    model?: string;
    plans?: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
  logo?: string;
  screenshots?: string[];
  website: string;
  twitter?: string;
  github?: string;
  linkedIn?: string;
  discord?: string;
  slack?: string;
  youtube?: string;
  blog?: string;
  docs?: string;
  apiDocs?: string;
  changelog?: string;
  tutorials?: string[];
  faq?: string[];
  tags?: string[];
  category?: string;
  founded?: string;
  teamSize?: string;
  headquarters?: string;
  rawContent: string;
  metadata?: Record<string, any>;
}

/**
 * Scrape a tool's website and extract structured data
 */
export async function scrapeTool(url: string): Promise<ScrapedToolData> {
  console.log(`Scraping tool from: ${url}`);

  // Use Jina Reader to get the page content
  const content = await jinaReader({ url, bypassCache: false });

  // Extract structured data
  const toolData = extractToolData(content, url);

  return toolData;
}

/**
 * Extract structured tool data from Jina Reader result
 */
function extractToolData(content: JinaReaderResult, originalUrl: string): ScrapedToolData {
  const { title, content: text, description, images, links, metadata } = content;

  // Extract name (from title or metadata)
  const name = extractName(title, metadata);

  // Extract tagline/description
  const tagline = extractTagline(description, text);

  // Extract features
  const features = extractFeatures(text);

  // Extract pricing information
  const pricing = extractPricing(text);

  // Extract logo
  const logo = extractLogo(images, metadata, originalUrl);

  // Extract screenshots
  const screenshots = extractScreenshots(images);

  // Extract social links
  const socialLinks = extractSocialLinks(links, text);

  // Extract categories/tags
  const tags = extractTags(text, metadata);

  // Extract documentation links
  const docs = extractDocsLinks(links, text);

  return {
    name,
    tagline,
    description: extractDescription(text),
    features,
    pricing,
    logo,
    screenshots,
    website: originalUrl,
    ...socialLinks,
    ...docs,
    tags,
    rawContent: text,
    metadata,
  };
}

/**
 * Extract tool name from title
 */
function extractName(title: string, metadata?: any): string {
  // Clean up common patterns in titles
  let name = title
    .replace(/\s*[-|–]\s*.*/g, '') // Remove everything after dash or pipe
    .replace(/\s*\|\s*.*/g, '')
    .replace(/\s*:\s*.*/g, '')
    .trim();

  // Try to get from metadata
  if (metadata?.['og:site_name']) {
    name = metadata['og:site_name'];
  }

  return name || title;
}

/**
 * Extract tagline from description or content
 */
function extractTagline(description?: string, content?: string): string | undefined {
  if (description) return description.slice(0, 200);

  // Try to find a tagline in the content
  const taglinePatterns = [
    /(?:tagline|slogan|motto):\s*(.+)/i,
    /^(.{20,150}\.)\s/m, // First sentence
  ];

  for (const pattern of taglinePatterns) {
    const match = content?.match(pattern);
    if (match) return match[1].trim();
  }

  return undefined;
}

/**
 * Extract description from content
 */
function extractDescription(content: string): string {
  // Get first few paragraphs
  const paragraphs = content
    .split('\n')
    .filter(line => line.trim().length > 50)
    .slice(0, 3)
    .join('\n');

  return paragraphs.slice(0, 1000);
}

/**
 * Extract features from content
 */
function extractFeatures(content: string): string[] {
  const features: string[] = [];

  // Look for feature sections
  const featurePatterns = [
    /(?:features|capabilities|what we offer):\s*\n((?:[-•*]\s*.+\n)+)/gi,
    /(?:key features):\s*\n((?:[-•*]\s*.+\n)+)/gi,
  ];

  for (const pattern of featurePatterns) {
    const match = content.match(pattern);
    if (match) {
      const items = match[0]
        .split('\n')
        .filter(line => /^[-•*]\s/.test(line.trim()))
        .map(line => line.replace(/^[-•*]\s/, '').trim());
      features.push(...items);
    }
  }

  // Look for bullet points in general
  if (features.length === 0) {
    const bulletPoints = content
      .split('\n')
      .filter(line => /^[-•*]\s/.test(line.trim()))
      .map(line => line.replace(/^[-•*]\s/, '').trim())
      .filter(line => line.length > 10 && line.length < 200)
      .slice(0, 10);

    features.push(...bulletPoints);
  }

  return [...new Set(features)]; // Remove duplicates
}

/**
 * Extract pricing information
 */
function extractPricing(content: string): ScrapedToolData['pricing'] {
  const pricingModels = ['free', 'freemium', 'paid', 'subscription', 'one-time', 'enterprise'];

  // Try to detect pricing model
  let model: string | undefined;
  for (const pricingModel of pricingModels) {
    if (content.toLowerCase().includes(pricingModel)) {
      model = pricingModel;
      break;
    }
  }

  // Try to extract pricing plans
  const plans: Array<{ name: string; price: string; features: string[] }> = [];

  // Look for pricing section
  const pricingSection = content.match(/(?:pricing|plans):\s*\n([\s\S]{0,1000})/i);
  if (pricingSection) {
    // Extract plan information (simplified - would need more sophisticated parsing)
    const priceMatches = pricingSection[0].matchAll(/\$(\d+(?:\.\d{2})?)\s*\/?\s*(month|mo|year|yr)?/gi);
    for (const match of priceMatches) {
      plans.push({
        name: 'Plan',
        price: `$${match[1]}${match[2] ? '/' + match[2] : ''}`,
        features: [],
      });
    }
  }

  if (!model && plans.length === 0) return undefined;

  return {
    model,
    plans: plans.length > 0 ? plans : undefined,
  };
}

/**
 * Extract logo from images
 */
function extractLogo(images?: string[], metadata?: any, url?: string): string | undefined {
  // Try to get from metadata
  if (metadata?.['og:image']) {
    return metadata['og:image'];
  }

  if (metadata?.['twitter:image']) {
    return metadata['twitter:image'];
  }

  // Try to find logo in images
  if (images && images.length > 0) {
    const logoImage = images.find(img =>
      /logo|icon|brand/i.test(img) || img.includes('logo')
    );
    if (logoImage) return logoImage;

    // Return first image as fallback
    return images[0];
  }

  // Generate a default logo URL
  if (url) {
    const domain = new URL(url).hostname;
    return `https://logo.clearbit.com/${domain}`;
  }

  return undefined;
}

/**
 * Extract screenshots from images
 */
function extractScreenshots(images?: string[]): string[] {
  if (!images) return [];

  return images
    .filter(img =>
      /screenshot|screen-shot|preview|demo/i.test(img) ||
      img.includes('screenshot') ||
      img.includes('demo')
    )
    .slice(0, 5);
}

/**
 * Extract social media links
 */
function extractSocialLinks(links?: string[], content?: string) {
  const socialLinks: {
    twitter?: string;
    github?: string;
    linkedIn?: string;
    discord?: string;
    slack?: string;
    youtube?: string;
  } = {};

  const allLinks = [...(links || [])];

  // Extract from content
  if (content) {
    const urlRegex = /https?:\/\/[^\s<>"]+/g;
    const contentUrls = content.match(urlRegex) || [];
    allLinks.push(...contentUrls);
  }

  for (const link of allLinks) {
    if (link.includes('twitter.com') || link.includes('x.com')) {
      socialLinks.twitter = link;
    } else if (link.includes('github.com')) {
      socialLinks.github = link;
    } else if (link.includes('linkedin.com')) {
      socialLinks.linkedIn = link;
    } else if (link.includes('discord.gg') || link.includes('discord.com')) {
      socialLinks.discord = link;
    } else if (link.includes('slack.com')) {
      socialLinks.slack = link;
    } else if (link.includes('youtube.com') || link.includes('youtu.be')) {
      socialLinks.youtube = link;
    }
  }

  return socialLinks;
}

/**
 * Extract documentation links
 */
function extractDocsLinks(links?: string[], content?: string) {
  const docLinks: {
    docs?: string;
    apiDocs?: string;
    blog?: string;
    changelog?: string;
  } = {};

  const allLinks = [...(links || [])];

  if (content) {
    const urlRegex = /https?:\/\/[^\s<>"]+/g;
    const contentUrls = content.match(urlRegex) || [];
    allLinks.push(...contentUrls);
  }

  for (const link of allLinks) {
    if (/docs?|documentation|guide/i.test(link) && !docLinks.docs) {
      docLinks.docs = link;
    } else if (/api[/-]docs?|api-reference/i.test(link)) {
      docLinks.apiDocs = link;
    } else if (/blog|news|updates/i.test(link) && !docLinks.blog) {
      docLinks.blog = link;
    } else if (/changelog|release|versions/i.test(link)) {
      docLinks.changelog = link;
    }
  }

  return docLinks;
}

/**
 * Extract tags from content
 */
function extractTags(content: string, metadata?: any): string[] {
  const tags: string[] = [];

  // Get from metadata
  if (metadata?.keywords) {
    const keywords = metadata.keywords.split(',').map((k: string) => k.trim());
    tags.push(...keywords);
  }

  // Extract common AI/tech keywords
  const aiKeywords = [
    'ai', 'artificial intelligence', 'machine learning', 'deep learning',
    'nlp', 'computer vision', 'neural network', 'gpt', 'llm',
    'chatbot', 'automation', 'analytics', 'api', 'saas',
    'productivity', 'developer tools', 'no-code', 'low-code'
  ];

  const contentLower = content.toLowerCase();
  for (const keyword of aiKeywords) {
    if (contentLower.includes(keyword)) {
      tags.push(keyword);
    }
  }

  return [...new Set(tags)].slice(0, 15);
}

/**
 * Batch scrape multiple tool URLs
 */
export async function scrapeMultipleTools(urls: string[]): Promise<Map<string, ScrapedToolData>> {
  const results = new Map<string, ScrapedToolData>();

  for (const url of urls) {
    try {
      const toolData = await scrapeTool(url);
      results.set(url, toolData);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
    }
  }

  return results;
}
