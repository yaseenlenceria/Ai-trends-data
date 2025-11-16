import type { Express } from "express";
import { createServer, type Server } from "http";
import { db, hasDatabase } from "./db";
import { tools, categories, sponsors, upvotes, analytics, submissions } from "@shared/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // ===============================================
  // CATEGORIES ENDPOINTS
  // ===============================================

  // GET /api/categories - Get all categories with tool count
  app.get("/api/categories", async (req, res) => {
    try {
      if (!hasDatabase || !db) {
        // Return empty array when database is not available
        // The frontend will use its fallback data
        return res.json([]);
      }

      const categoriesData = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          icon: categories.icon,
          description: categories.description,
          toolCount: sql<number>`count(${tools.id})::int`,
        })
        .from(categories)
        .leftJoin(tools, and(eq(tools.categoryId, categories.id), eq(tools.status, "approved")))
        .groupBy(categories.id);

      res.json(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // ===============================================
  // TOOLS ENDPOINTS
  // ===============================================

  // GET /api/tools - Get all approved tools
  app.get("/api/tools", async (req, res) => {
    try {
      if (!hasDatabase || !db) {
        // Return empty array when database is not available
        // The frontend will use its fallback data
        return res.json([]);
      }

      const allTools = await db
        .select()
        .from(tools)
        .where(eq(tools.status, "approved"))
        .orderBy(desc(tools.upvotes));

      res.json(allTools);
    } catch (error) {
      console.error("Error fetching tools:", error);
      res.status(500).json({ error: "Failed to fetch tools" });
    }
  });

  // GET /api/tools/trending - Get trending tools (highest upvotes)
  app.get("/api/tools/trending", async (req, res) => {
    try {
      const trendingTools = await db
        .select()
        .from(tools)
        .where(eq(tools.status, "approved"))
        .orderBy(desc(tools.upvotes))
        .limit(10);

      res.json(trendingTools);
    } catch (error) {
      console.error("Error fetching trending tools:", error);
      res.status(500).json({ error: "Failed to fetch trending tools" });
    }
  });

  // GET /api/tools/fastest-rising - Get fastest rising tools (by trend percentage)
  app.get("/api/tools/fastest-rising", async (req, res) => {
    try {
      const fastestRising = await db
        .select()
        .from(tools)
        .where(eq(tools.status, "approved"))
        .orderBy(desc(tools.trendPercentage))
        .limit(10);

      res.json(fastestRising);
    } catch (error) {
      console.error("Error fetching fastest rising tools:", error);
      res.status(500).json({ error: "Failed to fetch fastest rising tools" });
    }
  });

  // GET /api/tools/new - Get newly added tools
  app.get("/api/tools/new", async (req, res) => {
    try {
      const newTools = await db
        .select()
        .from(tools)
        .where(eq(tools.status, "approved"))
        .orderBy(desc(tools.createdAt))
        .limit(10);

      res.json(newTools);
    } catch (error) {
      console.error("Error fetching new tools:", error);
      res.status(500).json({ error: "Failed to fetch new tools" });
    }
  });

  // GET /api/tools/category/:categoryId - Get tools by category
  app.get("/api/tools/category/:categoryId", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const categoryTools = await db
        .select()
        .from(tools)
        .where(and(eq(tools.categoryId, categoryId), eq(tools.status, "approved")))
        .orderBy(desc(tools.upvotes));

      res.json(categoryTools);
    } catch (error) {
      console.error("Error fetching tools by category:", error);
      res.status(500).json({ error: "Failed to fetch tools by category" });
    }
  });

  // GET /api/tools/:slug - Get tool by slug
  app.get("/api/tools/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const tool = await db
        .select()
        .from(tools)
        .where(and(eq(tools.slug, slug), eq(tools.status, "approved")))
        .limit(1);

      if (tool.length === 0) {
        return res.status(404).json({ error: "Tool not found" });
      }

      res.json(tool[0]);
    } catch (error) {
      console.error("Error fetching tool:", error);
      res.status(500).json({ error: "Failed to fetch tool" });
    }
  });

  // GET /api/tools/:slug/analytics - Get tool analytics (7-day trend data)
  app.get("/api/tools/:slug/analytics", async (req, res) => {
    try {
      const { slug } = req.params;
      const tool = await db
        .select()
        .from(tools)
        .where(eq(tools.slug, slug))
        .limit(1);

      if (tool.length === 0) {
        return res.status(404).json({ error: "Tool not found" });
      }

      // Get analytics for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const analyticsData = await db
        .select({
          date: sql<string>`DATE(${analytics.createdAt})`,
          views: sql<number>`count(*)::int`,
        })
        .from(analytics)
        .where(
          and(
            eq(analytics.toolId, tool[0].id),
            eq(analytics.eventType, "view"),
            gte(analytics.createdAt, sevenDaysAgo)
          )
        )
        .groupBy(sql`DATE(${analytics.createdAt})`)
        .orderBy(sql`DATE(${analytics.createdAt})`);

      res.json(analyticsData);
    } catch (error) {
      console.error("Error fetching tool analytics:", error);
      res.status(500).json({ error: "Failed to fetch tool analytics" });
    }
  });

  // ===============================================
  // UPVOTES ENDPOINTS
  // ===============================================

  // POST /api/upvotes - Upvote a tool
  app.post("/api/upvotes", async (req, res) => {
    try {
      const { toolId, userId, ipAddress } = req.body;

      if (!toolId) {
        return res.status(400).json({ error: "Tool ID is required" });
      }

      // Check if already upvoted (by user or IP)
      let existingUpvote;
      if (userId) {
        existingUpvote = await db
          .select()
          .from(upvotes)
          .where(and(eq(upvotes.toolId, toolId), eq(upvotes.userId, userId)))
          .limit(1);
      } else if (ipAddress) {
        existingUpvote = await db
          .select()
          .from(upvotes)
          .where(and(eq(upvotes.toolId, toolId), eq(upvotes.ipAddress, ipAddress)))
          .limit(1);
      }

      if (existingUpvote && existingUpvote.length > 0) {
        return res.status(400).json({ error: "Already upvoted" });
      }

      // Create upvote
      await db.insert(upvotes).values({
        toolId,
        userId: userId || null,
        ipAddress: ipAddress || null,
      });

      // Increment tool upvotes count
      await db
        .update(tools)
        .set({ upvotes: sql`${tools.upvotes} + 1` })
        .where(eq(tools.id, toolId));

      // Track analytics event
      await db.insert(analytics).values({
        toolId,
        eventType: "upvote",
        ipAddress: ipAddress || null,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error creating upvote:", error);
      res.status(500).json({ error: "Failed to create upvote" });
    }
  });

  // ===============================================
  // ANALYTICS ENDPOINTS
  // ===============================================

  // POST /api/analytics/view - Track a tool view
  app.post("/api/analytics/view", async (req, res) => {
    try {
      const { toolId, ipAddress, userAgent, referrer } = req.body;

      if (!toolId) {
        return res.status(400).json({ error: "Tool ID is required" });
      }

      // Track view
      await db.insert(analytics).values({
        toolId,
        eventType: "view",
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        referrer: referrer || null,
      });

      // Increment tool views count
      await db
        .update(tools)
        .set({
          views: sql`${tools.views} + 1`,
          viewsToday: sql`${tools.viewsToday} + 1`,
          viewsWeek: sql`${tools.viewsWeek} + 1`,
        })
        .where(eq(tools.id, toolId));

      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking view:", error);
      res.status(500).json({ error: "Failed to track view" });
    }
  });

  // POST /api/analytics/click - Track a tool click
  app.post("/api/analytics/click", async (req, res) => {
    try {
      const { toolId, ipAddress, userAgent, referrer } = req.body;

      if (!toolId) {
        return res.status(400).json({ error: "Tool ID is required" });
      }

      // Track click
      await db.insert(analytics).values({
        toolId,
        eventType: "click",
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        referrer: referrer || null,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking click:", error);
      res.status(500).json({ error: "Failed to track click" });
    }
  });

  // ===============================================
  // SPONSORS ENDPOINTS
  // ===============================================

  // GET /api/sponsors - Get all active sponsors
  app.get("/api/sponsors", async (req, res) => {
    try {
      if (!hasDatabase || !db) {
        // Return empty array when database is not available
        // The frontend will use its fallback data
        return res.json([]);
      }

      const now = new Date();
      const activeSponsors = await db
        .select()
        .from(sponsors)
        .where(
          sql`${sponsors.endDate} IS NULL OR ${sponsors.endDate} > ${now}`
        )
        .orderBy(desc(sponsors.tier));

      res.json(activeSponsors);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      res.status(500).json({ error: "Failed to fetch sponsors" });
    }
  });

  // ===============================================
  // SUBMISSIONS ENDPOINTS
  // ===============================================

  // POST /api/submissions - Submit a new tool
  app.post("/api/submissions", async (req, res) => {
    try {
      const {
        name,
        tagline,
        description,
        logo,
        categoryId,
        website,
        twitter,
        github,
        screenshots,
        pricing,
        submitterEmail,
        submitterName,
      } = req.body;

      if (!name || !tagline || !logo || !categoryId || !submitterEmail) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create submission
      const submission = await db
        .insert(submissions)
        .values({
          name,
          tagline,
          description: description || null,
          logo,
          categoryId,
          website: website || null,
          twitter: twitter || null,
          github: github || null,
          screenshots: screenshots || null,
          pricing: pricing || null,
          submitterEmail,
          submitterName: submitterName || null,
          status: "pending",
        })
        .returning();

      res.json(submission[0]);
    } catch (error) {
      console.error("Error creating submission:", error);
      res.status(500).json({ error: "Failed to create submission" });
    }
  });

  // GET /api/submissions - Get all submissions (admin only)
  app.get("/api/submissions", async (req, res) => {
    try {
      const { status } = req.query;

      let query = db.select().from(submissions);

      if (status) {
        query = query.where(eq(submissions.status, status as any));
      }

      const allSubmissions = await query.orderBy(desc(submissions.createdAt));

      res.json(allSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // PATCH /api/submissions/:id/approve - Approve a submission (admin only)
  app.patch("/api/submissions/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const { reviewedBy } = req.body;

      // Get submission
      const submission = await db
        .select()
        .from(submissions)
        .where(eq(submissions.id, id))
        .limit(1);

      if (submission.length === 0) {
        return res.status(404).json({ error: "Submission not found" });
      }

      // Create slug from name
      const slug = submission[0].name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      // Create approved tool
      const newTool = await db
        .insert(tools)
        .values({
          name: submission[0].name,
          slug,
          tagline: submission[0].tagline,
          description: submission[0].description,
          logo: submission[0].logo,
          categoryId: submission[0].categoryId,
          website: submission[0].website,
          twitter: submission[0].twitter,
          github: submission[0].github,
          screenshots: submission[0].screenshots,
          pricing: submission[0].pricing,
          status: "approved",
          upvotes: 0,
          views: 0,
          viewsWeek: 0,
          viewsToday: 0,
          trendPercentage: 0,
        })
        .returning();

      // Update submission status
      await db
        .update(submissions)
        .set({
          status: "approved",
          reviewedBy: reviewedBy || null,
          reviewedAt: new Date(),
        })
        .where(eq(submissions.id, id));

      res.json(newTool[0]);
    } catch (error) {
      console.error("Error approving submission:", error);
      res.status(500).json({ error: "Failed to approve submission" });
    }
  });

  // PATCH /api/submissions/:id/reject - Reject a submission (admin only)
  app.patch("/api/submissions/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      const { reviewedBy } = req.body;

      // Update submission status
      const updated = await db
        .update(submissions)
        .set({
          status: "rejected",
          reviewedBy: reviewedBy || null,
          reviewedAt: new Date(),
        })
        .where(eq(submissions.id, id))
        .returning();

      if (updated.length === 0) {
        return res.status(404).json({ error: "Submission not found" });
      }

      res.json(updated[0]);
    } catch (error) {
      console.error("Error rejecting submission:", error);
      res.status(500).json({ error: "Failed to reject submission" });
    }
  });

  // ===============================================
  // SEARCH ENDPOINT
  // ===============================================

  // GET /api/search - Search tools
  app.get("/api/search", async (req, res) => {
    try {
      const { q, category } = req.query;

      let query = db.select().from(tools).where(eq(tools.status, "approved"));

      if (category) {
        query = query.where(eq(tools.categoryId, category as string));
      }

      let results = await query.orderBy(desc(tools.upvotes));

      // Filter by search query (simple text search)
      if (q) {
        const searchTerm = (q as string).toLowerCase();
        results = results.filter(
          (tool) =>
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.tagline.toLowerCase().includes(searchTerm) ||
            tool.description?.toLowerCase().includes(searchTerm)
        );
      }

      res.json(results);
    } catch (error) {
      console.error("Error searching tools:", error);
      res.status(500).json({ error: "Failed to search tools" });
    }
  });

  // ===============================================
  // EMBEDDABLE BADGE ENDPOINT
  // ===============================================

  // GET /api/badge/:slug - Get embeddable badge HTML
  app.get("/api/badge/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const tool = await db
        .select()
        .from(tools)
        .where(and(eq(tools.slug, slug), eq(tools.status, "approved")))
        .limit(1);

      if (tool.length === 0) {
        return res.status(404).send("Tool not found");
      }

      const badgeHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 8px; font-family: system-ui, -apple-system, sans-serif; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      transition: transform 0.2s;
    }
    .badge:hover { transform: translateY(-2px); }
    .badge-logo { width: 24px; height: 24px; border-radius: 4px; }
    .badge-text { display: flex; flex-direction: column; gap: 2px; }
    .badge-name { font-size: 14px; }
    .badge-votes { font-size: 12px; opacity: 0.9; }
  </style>
</head>
<body>
  <a href="${process.env.VITE_APP_URL || 'http://localhost:5000'}/tools/${tool[0].slug}" class="badge" target="_blank">
    <img src="${tool[0].logo}" alt="${tool[0].name}" class="badge-logo" />
    <div class="badge-text">
      <div class="badge-name">${tool[0].name}</div>
      <div class="badge-votes">⬆ ${tool[0].upvotes} upvotes on AITRENDSDATA</div>
    </div>
  </a>
</body>
</html>`;

      res.setHeader("Content-Type", "text/html");
      res.send(badgeHtml);
    } catch (error) {
      console.error("Error generating badge:", error);
      res.status(500).send("Failed to generate badge");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
