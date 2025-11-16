/**
 * Tool Refresh Cron Job
 * Periodically refreshes existing tool data to keep information current
 * Updates descriptions, features, pricing, screenshots, and metadata
 */

import { db } from '../db';
import { tools, automationLogs } from '@shared/schema';
import { scrapeTool } from '../lib/toolScraper';
import { cleanAndClassifyTool } from '../lib/aiClassifier';
import { eq, desc, or } from 'drizzle-orm';

/**
 * Main tool refresh function
 */
export async function refreshExistingTools() {
  const startTime = Date.now();
  console.log('🔄 Starting tool refresh...');

  // Create automation log
  const [log] = await db
    .insert(automationLogs)
    .values({
      type: 'tool-refresh',
      status: 'running',
      startedAt: new Date(),
    })
    .returning();

  try {
    const stats = {
      toolsRefreshed: 0,
      toolsUpdated: 0,
      toolsFailed: 0,
      changes: [] as string[],
      errors: [] as string[],
    };

    // Refresh tools in batches (oldest updated first)
    const BATCH_SIZE = 10;
    const toolsToRefresh = await db
      .select()
      .from(tools)
      .where(eq(tools.status, 'approved'))
      .orderBy(desc(tools.updatedAt))
      .limit(BATCH_SIZE);

    console.log(`🔄 Refreshing ${toolsToRefresh.length} tools...`);

    for (const tool of toolsToRefresh) {
      try {
        const changes = await refreshSingleTool(tool);
        stats.toolsRefreshed++;

        if (changes.length > 0) {
          stats.toolsUpdated++;
          stats.changes.push(`${tool.name}: ${changes.join(', ')}`);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`Error refreshing ${tool.name}:`, error);
        stats.toolsFailed++;
        stats.errors.push(`${tool.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Update log with success
    await db
      .update(automationLogs)
      .set({
        status: stats.toolsFailed === 0 ? 'success' : 'partial',
        completedAt: new Date(),
        metadata: {
          ...stats,
          duration: Date.now() - startTime,
        },
      })
      .where(eq(automationLogs.id, log.id));

    console.log('✅ Tool refresh completed');
    console.log(`📊 Stats:`, stats);

    return stats;
  } catch (error) {
    console.error('❌ Tool refresh failed:', error);

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
 * Refresh a single tool's data
 */
async function refreshSingleTool(tool: typeof tools.$inferSelect): Promise<string[]> {
  console.log(`  🔄 Refreshing: ${tool.name}`);

  const changes: string[] = [];

  try {
    // Step 1: Re-scrape the tool website
    const freshData = await scrapeTool(tool.website || '');

    // Step 2: Re-classify and clean
    const cleanedData = await cleanAndClassifyTool(freshData);

    // Step 3: Compare and update changed fields
    const updates: Partial<typeof tools.$inferInsert> = {
      updatedAt: new Date(),
    };

    // Check tagline
    if (cleanedData.tagline && cleanedData.tagline !== tool.tagline) {
      updates.tagline = cleanedData.tagline;
      changes.push('tagline');
    }

    // Check description
    if (cleanedData.description && cleanedData.description !== tool.description) {
      updates.description = cleanedData.description;
      changes.push('description');
    }

    // Check logo
    if (cleanedData.logo && cleanedData.logo !== tool.logo) {
      updates.logo = cleanedData.logo;
      changes.push('logo');
    }

    // Check screenshots
    if (cleanedData.screenshots && JSON.stringify(cleanedData.screenshots) !== JSON.stringify(tool.screenshots)) {
      updates.screenshots = cleanedData.screenshots as any;
      changes.push('screenshots');
    }

    // Check pricing
    if (cleanedData.pricing && JSON.stringify(cleanedData.pricing) !== JSON.stringify(tool.pricing)) {
      updates.pricing = cleanedData.pricing as any;
      changes.push('pricing');
    }

    // Check social links
    if (cleanedData.twitter && cleanedData.twitter !== tool.twitter) {
      updates.twitter = cleanedData.twitter;
      changes.push('twitter');
    }

    if (cleanedData.github && cleanedData.github !== tool.github) {
      updates.github = cleanedData.github;
      changes.push('github');
    }

    // Only update if there are changes
    if (changes.length > 0) {
      await db
        .update(tools)
        .set(updates)
        .where(eq(tools.id, tool.id));

      console.log(`  ✅ Updated ${changes.length} fields: ${changes.join(', ')}`);
    } else {
      console.log(`  ℹ️ No changes detected`);
    }

    return changes;
  } catch (error) {
    console.error(`  ❌ Error refreshing tool:`, error);
    throw error;
  }
}

/**
 * Refresh only tools that haven't been updated recently
 */
export async function refreshStaleTools(daysOld: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const staleTools = await db
    .select()
    .from(tools)
    .where(eq(tools.status, 'approved'))
    .orderBy(desc(tools.updatedAt))
    .limit(20);

  console.log(`🔍 Found ${staleTools.length} stale tools (${daysOld}+ days old)`);

  const stats = {
    toolsChecked: 0,
    toolsUpdated: 0,
    toolsFailed: 0,
  };

  for (const tool of staleTools) {
    try {
      const changes = await refreshSingleTool(tool);
      stats.toolsChecked++;

      if (changes.length > 0) {
        stats.toolsUpdated++;
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`Error refreshing ${tool.name}:`, error);
      stats.toolsFailed++;
    }
  }

  return stats;
}

// Export for cron job execution
export default refreshExistingTools;
