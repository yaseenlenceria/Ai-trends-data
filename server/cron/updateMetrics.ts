/**
 * Metrics Update Cron Job
 * Updates tool metrics including GitHub stars, traffic scores, trends, and popularity
 * Runs daily to keep metrics fresh
 */

import { db } from '../db';
import { tools, toolMetrics, automationLogs, analytics } from '@shared/schema';
import { jinaSearch } from '../lib/jinaClient';
import { eq, desc, gte, sql } from 'drizzle-orm';

/**
 * Main metrics update function
 */
export async function updateToolMetrics() {
  const startTime = Date.now();
  console.log('📊 Starting metrics update...');

  // Create automation log
  const [log] = await db
    .insert(automationLogs)
    .values({
      type: 'metrics-update',
      status: 'running',
      startedAt: new Date(),
    })
    .returning();

  try {
    const stats = {
      toolsUpdated: 0,
      toolsFailed: 0,
      errors: [] as string[],
    };

    // Get all approved tools
    const allTools = await db
      .select()
      .from(tools)
      .where(eq(tools.status, 'approved'));

    console.log(`📈 Updating metrics for ${allTools.length} tools...`);

    for (const tool of allTools) {
      try {
        await updateSingleToolMetrics(tool);
        stats.toolsUpdated++;

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error updating metrics for ${tool.name}:`, error);
        stats.toolsFailed++;
        stats.errors.push(`${tool.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Update log with success
    await db
      .update(automationLogs)
      .set({
        status: 'success',
        completedAt: new Date(),
        metadata: {
          ...stats,
          duration: Date.now() - startTime,
        },
      })
      .where(eq(automationLogs.id, log.id));

    console.log('✅ Metrics update completed');
    console.log(`📈 Stats:`, stats);

    return stats;
  } catch (error) {
    console.error('❌ Metrics update failed:', error);

    await db
      .update(automationLogs)
      .set({
        status: 'failed',
        completedAt: new Date(),
        metadata: {
          duration: Date.now() - startTime,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
        },
      })
      .where(eq(automationLogs.id, log.id));

    throw error;
  }
}

/**
 * Update metrics for a single tool
 */
async function updateSingleToolMetrics(tool: typeof tools.$inferSelect) {
  console.log(`  📊 Updating: ${tool.name}`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate daily, weekly, and monthly views from analytics
  const metrics = await calculateViewMetrics(tool.id);

  // Get GitHub stars if GitHub URL exists
  let githubStars = 0;
  if (tool.github) {
    githubStars = await fetchGitHubStars(tool.github);
  }

  // Calculate SERP position (how well the tool ranks in search)
  const serpPosition = await calculateSERPPosition(tool.name, tool.website);

  // Calculate traffic score (based on views and engagement)
  const trafficScore = calculateTrafficScore(metrics);

  // Calculate trend score (based on view growth)
  const trendScore = await calculateTrendScore(tool.id, metrics);

  // Calculate popularity score (combined metric)
  const popularityScore = calculatePopularityScore({
    views: metrics.weeklyViews,
    upvotes: tool.upvotes,
    githubStars,
    trafficScore,
    trendScore,
  });

  // Insert metrics record
  await db.insert(toolMetrics).values({
    toolId: tool.id,
    date: today,
    dailyViews: metrics.dailyViews,
    weeklyViews: metrics.weeklyViews,
    monthlyViews: metrics.monthlyViews,
    githubStars,
    trafficScore,
    trendScore,
    popularityScore,
    serpPosition,
    socialMentions: 0, // TODO: Implement social media tracking
  });

  // Update tool trend percentage
  await db
    .update(tools)
    .set({
      trendPercentage: trendScore,
    })
    .where(eq(tools.id, tool.id));

  console.log(`  ✅ Metrics updated: score=${popularityScore}, trend=${trendScore}`);
}

/**
 * Calculate view metrics from analytics
 */
async function calculateViewMetrics(toolId: string) {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Daily views
  const dailyResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(analytics)
    .where(
      sql`${analytics.toolId} = ${toolId}
          AND ${analytics.eventType} = 'view'
          AND ${analytics.createdAt} >= ${oneDayAgo}`
    );

  // Weekly views
  const weeklyResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(analytics)
    .where(
      sql`${analytics.toolId} = ${toolId}
          AND ${analytics.eventType} = 'view'
          AND ${analytics.createdAt} >= ${oneWeekAgo}`
    );

  // Monthly views
  const monthlyResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(analytics)
    .where(
      sql`${analytics.toolId} = ${toolId}
          AND ${analytics.eventType} = 'view'
          AND ${analytics.createdAt} >= ${oneMonthAgo}`
    );

  return {
    dailyViews: dailyResult[0]?.count || 0,
    weeklyViews: weeklyResult[0]?.count || 0,
    monthlyViews: monthlyResult[0]?.count || 0,
  };
}

/**
 * Fetch GitHub stars for a repository
 */
async function fetchGitHubStars(githubUrl: string): Promise<number> {
  try {
    // Extract owner and repo from GitHub URL
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return 0;

    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, '');

    // Fetch from GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    if (!response.ok) {
      console.warn(`GitHub API error for ${owner}/${cleanRepo}: ${response.status}`);
      return 0;
    }

    const data = await response.json();
    return data.stargazers_count || 0;
  } catch (error) {
    console.error('Error fetching GitHub stars:', error);
    return 0;
  }
}

/**
 * Calculate SERP position using Jina Search
 */
async function calculateSERPPosition(toolName: string, toolWebsite: string): Promise<number | undefined> {
  try {
    const results = await jinaSearch({
      query: toolName,
      count: 20,
    });

    // Find position of the tool's website in results
    const position = results.findIndex(result =>
      result.url.includes(new URL(toolWebsite).hostname)
    );

    return position >= 0 ? position + 1 : undefined;
  } catch (error) {
    console.error('Error calculating SERP position:', error);
    return undefined;
  }
}

/**
 * Calculate traffic score (0-100)
 */
function calculateTrafficScore(metrics: { dailyViews: number; weeklyViews: number; monthlyViews: number }): number {
  // Weighted score based on views
  const score =
    metrics.dailyViews * 10 +
    metrics.weeklyViews * 2 +
    metrics.monthlyViews * 0.5;

  // Normalize to 0-100
  return Math.min(100, Math.floor(score / 10));
}

/**
 * Calculate trend score based on view growth (0-100)
 */
async function calculateTrendScore(toolId: string, currentMetrics: any): Promise<number> {
  try {
    // Get previous week's metrics
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const previousMetrics = await db
      .select()
      .from(toolMetrics)
      .where(eq(toolMetrics.toolId, toolId))
      .where(gte(toolMetrics.date, oneWeekAgo))
      .orderBy(desc(toolMetrics.date))
      .limit(1);

    if (previousMetrics.length === 0) {
      // No previous data, return moderate score
      return 50;
    }

    const previous = previousMetrics[0];

    // Calculate percentage change in weekly views
    const previousWeekly = previous.weeklyViews || 1;
    const currentWeekly = currentMetrics.weeklyViews || 0;

    const percentageChange = ((currentWeekly - previousWeekly) / previousWeekly) * 100;

    // Normalize to 0-100 scale (cap at ±200% change)
    const normalized = 50 + Math.max(-50, Math.min(50, percentageChange / 4));

    return Math.floor(normalized);
  } catch (error) {
    console.error('Error calculating trend score:', error);
    return 50;
  }
}

/**
 * Calculate overall popularity score (0-100)
 */
function calculatePopularityScore(data: {
  views: number;
  upvotes: number;
  githubStars: number;
  trafficScore: number;
  trendScore: number;
}): number {
  // Weighted formula
  const score =
    data.views * 0.3 +
    data.upvotes * 2 +
    data.githubStars * 0.1 +
    data.trafficScore * 0.5 +
    data.trendScore * 0.3;

  // Normalize to 0-100
  return Math.min(100, Math.floor(score / 5));
}

// Export for cron job execution
export default updateToolMetrics;
