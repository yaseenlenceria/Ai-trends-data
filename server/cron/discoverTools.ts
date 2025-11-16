/**
 * Tool Discovery Cron Job
 * Automatically discovers new AI tools using Jina Search API
 * Runs daily to find and queue new tools for processing
 */

import { db } from '../db';
import { discoveredTools, automationLogs } from '@shared/schema';
import { jinaSearch, batchSearch } from '../lib/jinaClient';
import { scrapeTool } from '../lib/toolScraper';
import { cleanAndClassifyTool, generateSlug } from '../lib/aiClassifier';
import { tools, categories } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Search queries to find new AI tools
const DISCOVERY_QUERIES = [
  'new ai tools 2025',
  'latest ai tools',
  'best ai tools launched today',
  'top ai websites 2025',
  'trending ai tools',
  'ai tools for developers',
  'ai productivity tools',
  'ai image generation tools',
  'ai code assistants',
  'ai writing tools 2025',
];

/**
 * Main discovery function
 */
export async function discoverNewTools() {
  const startTime = Date.now();
  console.log('🔍 Starting tool discovery...');

  // Create automation log
  const logId = await createLog('discovery', 'running');

  try {
    const stats = {
      toolsDiscovered: 0,
      toolsProcessed: 0,
      toolsFailed: 0,
      errors: [] as string[],
    };

    // Step 1: Search for tools using multiple queries
    console.log('📡 Searching for tools...');
    const searchResults = await batchSearch(DISCOVERY_QUERIES, {
      count: 10,
      fetchFavicons: true,
    });

    // Collect all unique URLs
    const discoveredUrls = new Set<string>();
    for (const [query, results] of searchResults) {
      console.log(`Found ${results.length} results for "${query}"`);
      for (const result of results) {
        if (isValidToolUrl(result.url)) {
          discoveredUrls.add(result.url);
        }
      }
    }

    console.log(`📊 Total unique URLs discovered: ${discoveredUrls.size}`);
    stats.toolsDiscovered = discoveredUrls.size;

    // Step 2: Check which URLs are new (not already discovered)
    const newUrls: string[] = [];
    for (const url of discoveredUrls) {
      const existing = await db
        .select()
        .from(discoveredTools)
        .where(eq(discoveredTools.url, url))
        .limit(1);

      if (existing.length === 0) {
        newUrls.push(url);
      }
    }

    console.log(`✨ New tools to process: ${newUrls.length}`);

    // Step 3: Add new URLs to discovered_tools table
    for (const url of newUrls) {
      try {
        await db.insert(discoveredTools).values({
          url,
          source: 'jina-search',
          status: 'discovered',
        });
        console.log(`➕ Added to queue: ${url}`);
      } catch (error) {
        console.error(`Error adding ${url}:`, error);
        stats.errors.push(`Failed to queue: ${url}`);
      }
    }

    // Step 4: Process a batch of discovered tools (limit to avoid timeout)
    const BATCH_SIZE = 5;
    const toolsToProcess = await db
      .select()
      .from(discoveredTools)
      .where(eq(discoveredTools.status, 'discovered'))
      .limit(BATCH_SIZE);

    console.log(`⚙️ Processing ${toolsToProcess.length} tools...`);

    for (const discoveredTool of toolsToProcess) {
      try {
        await processDiscoveredTool(discoveredTool.id, discoveredTool.url);
        stats.toolsProcessed++;
      } catch (error) {
        console.error(`Error processing ${discoveredTool.url}:`, error);
        stats.toolsFailed++;
        stats.errors.push(`Processing failed: ${discoveredTool.url}`);

        // Update status to failed
        await db
          .update(discoveredTools)
          .set({
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          })
          .where(eq(discoveredTools.id, discoveredTool.id));
      }
    }

    // Update log with success
    await updateLog(logId, 'success', {
      ...stats,
      duration: Date.now() - startTime,
    });

    console.log('✅ Tool discovery completed successfully');
    console.log(`📈 Stats:`, stats);

    return stats;
  } catch (error) {
    console.error('❌ Tool discovery failed:', error);

    await updateLog(logId, 'failed', {
      duration: Date.now() - startTime,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    });

    throw error;
  }
}

/**
 * Process a single discovered tool
 */
async function processDiscoveredTool(discoveredId: string, url: string) {
  console.log(`🔧 Processing: ${url}`);

  // Update status to processing
  await db
    .update(discoveredTools)
    .set({ status: 'processing' })
    .where(eq(discoveredTools.id, discoveredId));

  // Step 1: Scrape the tool website
  console.log('  📡 Scraping...');
  const scrapedData = await scrapeTool(url);

  // Step 2: Clean and classify with AI
  console.log('  🤖 Classifying with AI...');
  const cleanedData = await cleanAndClassifyTool(scrapedData);

  // Step 3: Check if tool already exists (by name or slug)
  const slug = generateSlug(cleanedData.name);
  const existingTool = await db
    .select()
    .from(tools)
    .where(eq(tools.slug, slug))
    .limit(1);

  if (existingTool.length > 0) {
    console.log('  ⚠️ Tool already exists, skipping');
    await db
      .update(discoveredTools)
      .set({
        status: 'processed',
        processedToolId: existingTool[0].id,
        processedAt: new Date(),
      })
      .where(eq(discoveredTools.id, discoveredId));
    return;
  }

  // Step 4: Find or create category
  const categoryId = await findOrCreateCategory(cleanedData.categories[0]);

  // Step 5: Create the tool in the database
  console.log('  💾 Saving to database...');
  const [newTool] = await db
    .insert(tools)
    .values({
      name: cleanedData.name,
      slug,
      tagline: cleanedData.tagline,
      description: cleanedData.description,
      logo: cleanedData.logo || `https://via.placeholder.com/128?text=${cleanedData.name[0]}`,
      categoryId,
      website: cleanedData.website,
      twitter: cleanedData.twitter,
      github: cleanedData.github,
      screenshots: cleanedData.screenshots,
      pricing: cleanedData.pricing as any,
      status: cleanedData.confidence > 70 ? 'approved' : 'pending',
      upvotes: 0,
      views: 0,
      viewsWeek: 0,
      viewsToday: 0,
      trendPercentage: 0,
    })
    .returning();

  // Step 6: Update discovered_tools with processed status
  await db
    .update(discoveredTools)
    .set({
      status: 'processed',
      processedToolId: newTool.id,
      rawData: scrapedData as any,
      processedAt: new Date(),
    })
    .where(eq(discoveredTools.id, discoveredId));

  console.log(`  ✅ Tool created: ${newTool.name} (${newTool.slug})`);
}

/**
 * Find or create a category
 */
async function findOrCreateCategory(categoryName: string): Promise<string> {
  // Try to find existing category
  const existing = await db
    .select()
    .from(categories)
    .where(eq(categories.name, categoryName))
    .limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  // Create new category
  const slug = generateSlug(categoryName);
  const icon = getCategoryIcon(categoryName);

  const [newCategory] = await db
    .insert(categories)
    .values({
      name: categoryName,
      slug,
      icon,
      description: `Tools for ${categoryName.toLowerCase()}`,
    })
    .returning();

  return newCategory.id;
}

/**
 * Get icon for category
 */
function getCategoryIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
    'AI Assistants': 'MessageSquare',
    'Image Generation': 'Image',
    'Video Generation': 'Video',
    'Audio Tools': 'Mic',
    'Music AI': 'Music',
    'Coding AI': 'Code',
    'Writing Tools': 'PenTool',
    'SEO Tools': 'Search',
    'Agents': 'Bot',
    'Productivity AI': 'Zap',
    'LLMs & Models': 'Brain',
    'Voice & Speech': 'Mic2',
    'Developer Tools': 'Terminal',
    'Design & Editing': 'Palette',
    'OCR & Computer Vision': 'Eye',
    'Data Analysis': 'BarChart',
    'Marketing AI': 'TrendingUp',
    'Customer Support AI': 'Headphones',
    'API Tools': 'Webhook',
    'Automation Tools': 'Workflow',
    'Agents & Orchestrators': 'Network',
    'Research AI': 'BookOpen',
  };

  return iconMap[categoryName] || 'Box';
}

/**
 * Validate if URL is a valid tool URL
 */
function isValidToolUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    // Exclude common non-tool domains
    const excludedDomains = [
      'wikipedia.org',
      'facebook.com',
      'twitter.com',
      'linkedin.com',
      'youtube.com',
      'reddit.com',
      'medium.com',
      'github.com/topics',
    ];

    for (const domain of excludedDomains) {
      if (urlObj.hostname.includes(domain)) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Create automation log
 */
async function createLog(type: string, status: string): Promise<string> {
  const [log] = await db
    .insert(automationLogs)
    .values({
      type: type as any,
      status: status as any,
      startedAt: new Date(),
    })
    .returning();

  return log.id;
}

/**
 * Update automation log
 */
async function updateLog(id: string, status: string, metadata: any) {
  await db
    .update(automationLogs)
    .set({
      status: status as any,
      completedAt: new Date(),
      metadata,
    })
    .where(eq(automationLogs.id, id));
}

// Export for cron job execution
export default discoverNewTools;
