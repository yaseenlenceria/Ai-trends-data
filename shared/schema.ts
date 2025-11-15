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
