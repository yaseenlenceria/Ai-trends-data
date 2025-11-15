// Serverless function wrapper for Vercel
import express from "express";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, desc, sql, and, gte } from "drizzle-orm";
import ws from "ws";

// Database schema imports
import {
  tools,
  categories,
  sponsors,
  upvotes,
  analytics,
  submissions
} from "../shared/schema.js";

// Configure Neon WebSocket
neonConfig.webSocketConstructor = ws;

// Initialize database connection
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set - API will not work properly");
}

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

const db = pool ? drizzle({ client: pool }) : null;

const app = express();

// Parse JSON bodies
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// CORS headers for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoints
app.get("/api", (_req, res) => {
  res.json({
    message: "AI Trends Data API",
    timestamp: new Date().toISOString(),
    status: db ? "connected" : "no database"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: db ? "ok" : "no database",
    timestamp: new Date().toISOString()
  });
});

// Database check middleware
const checkDb = (req, res, next) => {
  if (!db) {
    return res.status(503).json({ error: "Database not configured" });
  }
  next();
};

// ===============================================
// CATEGORIES ENDPOINTS
// ===============================================

app.get("/api/categories", checkDb, async (req, res) => {
  try {
    const categoriesData = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        icon: categories.icon,
        description: categories.description,
        toolCount: sql`count(${tools.id})::int`,
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

app.get("/api/tools", checkDb, async (req, res) => {
  try {
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

app.get("/api/tools/trending", checkDb, async (req, res) => {
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

app.get("/api/tools/fastest-rising", checkDb, async (req, res) => {
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

app.get("/api/tools/new", checkDb, async (req, res) => {
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

app.get("/api/tools/category/:categoryId", checkDb, async (req, res) => {
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

app.get("/api/tools/:slug/analytics", checkDb, async (req, res) => {
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
        date: sql`DATE(${analytics.createdAt})`,
        views: sql`count(*)::int`,
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

// This must come AFTER the specific routes like /api/tools/trending
app.get("/api/tools/:slug", checkDb, async (req, res) => {
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

// ===============================================
// UPVOTES ENDPOINTS
// ===============================================

app.post("/api/upvotes", checkDb, async (req, res) => {
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

app.post("/api/analytics/view", checkDb, async (req, res) => {
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

app.post("/api/analytics/click", checkDb, async (req, res) => {
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

app.get("/api/sponsors", checkDb, async (req, res) => {
  try {
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

app.post("/api/submissions", checkDb, async (req, res) => {
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

app.get("/api/submissions", checkDb, async (req, res) => {
  try {
    const { status } = req.query;

    let query = db.select().from(submissions);

    if (status) {
      query = query.where(eq(submissions.status, status));
    }

    const allSubmissions = await query.orderBy(desc(submissions.createdAt));

    res.json(allSubmissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

app.patch("/api/submissions/:id/approve", checkDb, async (req, res) => {
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

app.patch("/api/submissions/:id/reject", checkDb, async (req, res) => {
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

app.get("/api/search", checkDb, async (req, res) => {
  try {
    const { q, category } = req.query;

    let query = db.select().from(tools).where(eq(tools.status, "approved"));

    if (category) {
      query = query.where(eq(tools.categoryId, category));
    }

    let results = await query.orderBy(desc(tools.upvotes));

    // Filter by search query (simple text search)
    if (q) {
      const searchTerm = q.toLowerCase();
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

app.get("/api/badge/:slug", checkDb, async (req, res) => {
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
  <a href="${process.env.VITE_APP_URL || 'https://ai-trends-data.vercel.app'}/tools/${tool[0].slug}" class="badge" target="_blank">
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

// Error handler
app.use((err, _req, res, _next) => {
  console.error("Error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel serverless
export default app;
