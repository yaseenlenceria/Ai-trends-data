import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(), // Store icon name (e.g., "MessageSquare")
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories);
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Tools table
export const toolStatusEnum = pgEnum("tool_status", ["pending", "approved", "rejected"]);

export const tools = pgTable("tools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  tagline: text("tagline").notNull(),
  description: text("description"),
  logo: text("logo").notNull(),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  upvotes: integer("upvotes").default(0).notNull(),
  views: integer("views").default(0).notNull(),
  viewsWeek: integer("views_week").default(0).notNull(),
  viewsToday: integer("views_today").default(0).notNull(),
  trendPercentage: integer("trend_percentage").default(0).notNull(),
  website: text("website"),
  twitter: text("twitter"),
  github: text("github"),
  status: toolStatusEnum("status").default("pending").notNull(),
  screenshots: jsonb("screenshots").$type<string[]>(),
  pricing: jsonb("pricing").$type<{
    model: string;
    plans: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  }>(),
  submittedBy: varchar("submitted_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertToolSchema = createInsertSchema(tools);
export type Tool = typeof tools.$inferSelect;
export type InsertTool = z.infer<typeof insertToolSchema>;

// Sponsors table
export const sponsorTierEnum = pgEnum("sponsor_tier", ["premium", "standard"]);

export const sponsors = pgTable("sponsors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  tier: sponsorTierEnum("tier").notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSponsorSchema = createInsertSchema(sponsors);
export type Sponsor = typeof sponsors.$inferSelect;
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;

// Upvotes table (tracks user upvotes)
export const upvotes = pgTable("upvotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolId: varchar("tool_id").notNull().references(() => tools.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"), // For anonymous upvotes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUpvoteSchema = createInsertSchema(upvotes);
export type Upvote = typeof upvotes.$inferSelect;
export type InsertUpvote = z.infer<typeof insertUpvoteSchema>;

// Analytics table (tracks views and clicks)
export const analyticsEventEnum = pgEnum("analytics_event", ["view", "click", "upvote"]);

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolId: varchar("tool_id").notNull().references(() => tools.id, { onDelete: "cascade" }),
  eventType: analyticsEventEnum("event_type").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics);
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

// Submissions table (for pending tool submissions before approval)
export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description"),
  logo: text("logo").notNull(),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  website: text("website"),
  twitter: text("twitter"),
  github: text("github"),
  screenshots: jsonb("screenshots").$type<string[]>(),
  pricing: jsonb("pricing").$type<{
    model: string;
    plans: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  }>(),
  submitterEmail: text("submitter_email").notNull(),
  submitterName: text("submitter_name"),
  status: toolStatusEnum("status").default("pending").notNull(),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubmissionSchema = createInsertSchema(submissions);
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

// Tool Metrics table (for trend analysis and popularity tracking)
export const toolMetrics = pgTable("tool_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolId: varchar("tool_id").notNull().references(() => tools.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  dailyViews: integer("daily_views").default(0).notNull(),
  weeklyViews: integer("weekly_views").default(0).notNull(),
  monthlyViews: integer("monthly_views").default(0).notNull(),
  githubStars: integer("github_stars").default(0),
  trafficScore: integer("traffic_score").default(0).notNull(),
  trendScore: integer("trend_score").default(0).notNull(),
  popularityScore: integer("popularity_score").default(0).notNull(),
  serpPosition: integer("serp_position"),
  socialMentions: integer("social_mentions").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertToolMetricsSchema = createInsertSchema(toolMetrics);
export type ToolMetrics = typeof toolMetrics.$inferSelect;
export type InsertToolMetrics = z.infer<typeof insertToolMetricsSchema>;

// Discovered Tools table (tools found by automation before processing)
export const discoveryStatusEnum = pgEnum("discovery_status", ["discovered", "processing", "processed", "failed"]);

export const discoveredTools = pgTable("discovered_tools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull().unique(),
  name: text("name"),
  source: text("source").notNull(), // Where it was discovered (e.g., "jina-search", "manual")
  rawData: jsonb("raw_data").$type<any>(), // Raw scraped data
  status: discoveryStatusEnum("status").default("discovered").notNull(),
  processedToolId: varchar("processed_tool_id").references(() => tools.id),
  errorMessage: text("error_message"),
  discoveredAt: timestamp("discovered_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
});

export const insertDiscoveredToolSchema = createInsertSchema(discoveredTools);
export type DiscoveredTool = typeof discoveredTools.$inferSelect;
export type InsertDiscoveredTool = z.infer<typeof insertDiscoveredToolSchema>;

// Automation Logs table (for tracking cron jobs and automation tasks)
export const automationLogTypeEnum = pgEnum("automation_log_type", [
  "discovery", "scraping", "classification", "metrics-update", "tool-refresh", "bulk-import"
]);
export const automationLogStatusEnum = pgEnum("automation_log_status", ["running", "success", "failed", "partial"]);

export const automationLogs = pgTable("automation_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: automationLogTypeEnum("type").notNull(),
  status: automationLogStatusEnum("status").notNull(),
  message: text("message"),
  metadata: jsonb("metadata").$type<{
    toolsDiscovered?: number;
    toolsProcessed?: number;
    toolsFailed?: number;
    duration?: number;
    errors?: string[];
    [key: string]: any;
  }>(),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAutomationLogSchema = createInsertSchema(automationLogs);
export type AutomationLog = typeof automationLogs.$inferSelect;
export type InsertAutomationLog = z.infer<typeof insertAutomationLogSchema>;

// Tool Tags table (for better categorization and search)
export const toolTags = pgTable("tool_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolId: varchar("tool_id").notNull().references(() => tools.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertToolTagSchema = createInsertSchema(toolTags);
export type ToolTag = typeof toolTags.$inferSelect;
export type InsertToolTag = z.infer<typeof insertToolTagSchema>;

// Tool Features table (extracted features from AI analysis)
export const toolFeatures = pgTable("tool_features", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolId: varchar("tool_id").notNull().references(() => tools.id, { onDelete: "cascade" }),
  feature: text("feature").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertToolFeatureSchema = createInsertSchema(toolFeatures);
export type ToolFeature = typeof toolFeatures.$inferSelect;
export type InsertToolFeature = z.infer<typeof insertToolFeatureSchema>;

// Similar Tools table (for recommendations based on embeddings)
export const similarTools = pgTable("similar_tools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolId: varchar("tool_id").notNull().references(() => tools.id, { onDelete: "cascade" }),
  similarToolId: varchar("similar_tool_id").notNull().references(() => tools.id, { onDelete: "cascade" }),
  similarityScore: integer("similarity_score").notNull(), // 0-100
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSimilarToolSchema = createInsertSchema(similarTools);
export type SimilarTool = typeof similarTools.$inferSelect;
export type InsertSimilarTool = z.infer<typeof insertSimilarToolSchema>;
