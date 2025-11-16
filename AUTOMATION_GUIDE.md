# 🤖 AI Trends Data - Automated Tool Discovery System

## Overview

This document describes the comprehensive automated AI tool ingestion and trend analysis system built for AITRENDSDATA. The system automatically discovers, scrapes, categorizes, and tracks AI tools without manual intervention.

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    JINA AI SEARCH API                        │
│               (Discovers new AI tools daily)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  TOOL DISCOVERY CRON JOB                     │
│         (Runs daily at 2 AM - discovers new tools)          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    JINA READER API                           │
│            (Scrapes tool websites for data)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  AI CLASSIFICATION ENGINE                     │
│        (Claude/GPT analyzes and categorizes tools)           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                        │
│           (Stores tools, metrics, automation logs)           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              METRICS UPDATE CRON JOB                         │
│  (Runs every 6 hours - updates trends, GitHub stars, etc.)  │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Components

### 1. **Jina AI Integration** (`server/lib/jinaClient.ts`)

Handles all interactions with Jina AI APIs:

- **Jina Search**: Discovers new AI tools from web searches
- **Jina Reader**: Scrapes and extracts structured data from URLs
- **Batch Operations**: Processes multiple URLs efficiently

**Key Functions:**
```typescript
jinaSearch(options)      // Search for AI tools
jinaReader(options)      // Read and parse a webpage
batchSearch(queries)     // Run multiple searches
batchReader(urls)        // Scrape multiple URLs
```

### 2. **Tool Scraper** (`server/lib/toolScraper.ts`)

Extracts structured data from tool websites:

- Tool name, tagline, description
- Features and pricing information
- Logos and screenshots
- Social links (Twitter, GitHub, LinkedIn, Discord)
- Documentation links
- Tags and categories

**Extracted Data Structure:**
```typescript
{
  name: string
  tagline: string
  description: string
  features: string[]
  pricing: { model: string, plans: Array }
  logo: string
  screenshots: string[]
  website: string
  twitter?: string
  github?: string
  tags: string[]
}
```

### 3. **AI Classification Engine** (`server/lib/aiClassifier.ts`)

Uses Claude or GPT to:

- Clean and normalize scraped data
- Categorize tools into predefined categories
- Generate SEO-optimized summaries
- Extract and validate features
- Classify pricing models
- Generate relevant tags

**2025 AI Tool Categories:**
- AI Assistants, Image Generation, Video Generation
- Audio Tools, Music AI, Coding AI
- Writing Tools, SEO Tools, Agents
- Productivity AI, LLMs & Models, Voice & Speech
- Developer Tools, Design & Editing, OCR & Computer Vision
- Data Analysis, Marketing AI, Customer Support AI
- API Tools, Automation Tools, Agents & Orchestrators
- Research AI

### 4. **Cron Jobs**

#### a. **Tool Discovery** (`server/cron/discoverTools.ts`)

**Schedule**: Daily at 2 AM
**Endpoint**: `POST /api/cron/discover-tools`

**Process:**
1. Searches Jina for new AI tools using 10+ queries
2. Filters and deduplicates URLs
3. Queues new tools in `discovered_tools` table
4. Processes batch of 5 tools per run
5. Scrapes → Classifies → Saves to database

**Queries Used:**
- "new ai tools 2025"
- "latest ai tools"
- "best ai tools launched today"
- "top ai websites 2025"
- "trending ai tools"
- And 5 more category-specific queries

#### b. **Metrics Update** (`server/cron/updateMetrics.ts`)

**Schedule**: Every 6 hours
**Endpoint**: `POST /api/cron/update-metrics`

**Updates:**
- Daily, weekly, monthly view counts
- GitHub stars (if repo exists)
- SERP position (search ranking)
- Traffic score (0-100)
- Trend score (growth rate)
- Popularity score (combined metric)

**Metrics Calculation:**
```
Traffic Score = (dailyViews * 10 + weeklyViews * 2 + monthlyViews * 0.5) / 10
Trend Score = 50 + (weeklyViewsGrowth / 4)
Popularity Score = (views * 0.3 + upvotes * 2 + githubStars * 0.1 + trafficScore * 0.5 + trendScore * 0.3) / 5
```

#### c. **Tool Refresh** (`server/cron/refreshTools.ts`)

**Schedule**: Weekly on Sunday at 4 AM
**Endpoint**: `POST /api/cron/refresh-tools`

**Updates:**
- Re-scrapes tool websites
- Updates descriptions, features
- Refreshes pricing information
- Updates screenshots and logos
- Syncs social links

**Only updates changed fields** to preserve manual edits.

### 5. **Database Schema Extensions**

New tables added:

#### `tool_metrics`
Tracks daily metrics for each tool:
- Views (daily, weekly, monthly)
- GitHub stars
- Traffic score
- Trend score
- Popularity score
- SERP position

#### `discovered_tools`
Queue for newly discovered tools:
- URL, source, status
- Raw scraped data
- Processing errors
- Timestamps

#### `automation_logs`
Logs all cron job executions:
- Type (discovery, metrics-update, refresh)
- Status (running, success, failed)
- Metadata (stats, duration, errors)
- Timestamps

#### `tool_tags`
Many-to-many relationship for tags

#### `tool_features`
Extracted features for each tool

#### `similar_tools`
Tool recommendations based on similarity

### 6. **Admin Dashboard Enhancements**

New admin panel tabs:

#### **Bulk Import** (`client/src/components/admin/BulkImport.tsx`)
- Upload JSON or CSV files
- Manual JSON input
- Auto-categorization
- Import progress tracking
- Error reporting

**JSON Format:**
```json
[
  {
    "name": "Tool Name",
    "tagline": "Brief description",
    "description": "Detailed description",
    "logo": "https://example.com/logo.png",
    "categoryId": "uuid",
    "website": "https://example.com",
    "pricing": { "model": "freemium" }
  }
]
```

#### **Automation Dashboard** (`client/src/components/admin/AutomationDashboard.tsx`)
- Manual cron job triggers
- Real-time automation logs
- Discovered tools queue
- Success/failure metrics
- Error tracking

## 🚀 Setup Instructions

### 1. Environment Variables

Add to `.env`:

```bash
# Jina AI
JINA_API_KEY=jina_d8046360c20a427aafc55afc07e20d5aY78HBbD27vWA6JdbfPUZV93Bxlb1

# AI Classification (choose one or both)
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key

# GitHub (optional, for star tracking without rate limits)
GITHUB_TOKEN=your_github_token

# Cron Security
CRON_SECRET=your_random_secret
```

### 2. Database Migration

Push new schema to database:

```bash
npm run db:push
```

### 3. Vercel Cron Configuration

Already configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/discover-tools",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/update-metrics",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/refresh-tools",
      "schedule": "0 4 * * 0"
    }
  ]
}
```

**Cron Schedules:**
- Tool Discovery: Daily at 2:00 AM
- Metrics Update: Every 6 hours
- Tool Refresh: Sundays at 4:00 AM

### 4. Manual Cron Triggers

For testing or immediate execution:

```bash
# Discover new tools
curl -X POST https://your-domain.com/api/cron/discover-tools \
  -H "Authorization: Bearer your_cron_secret"

# Update metrics
curl -X POST https://your-domain.com/api/cron/update-metrics \
  -H "Authorization: Bearer your_cron_secret"

# Refresh tools
curl -X POST https://your-domain.com/api/cron/refresh-tools \
  -H "Authorization: Bearer your_cron_secret"
```

## 📊 API Endpoints

### Automation Endpoints

```
POST   /api/cron/discover-tools    # Run tool discovery
POST   /api/cron/update-metrics    # Update all metrics
POST   /api/cron/refresh-tools     # Refresh tool data
GET    /api/automation-logs        # Get automation logs
GET    /api/discovered-tools       # Get discovered tools queue
GET    /api/tool-metrics/:toolId   # Get tool metrics history
```

### Admin Endpoints

```
POST   /api/admin/tools            # Create tool
PUT    /api/admin/tools/:id        # Update tool
DELETE /api/admin/tools/:id        # Delete tool
GET    /api/admin/tools            # Get all tools (incl. pending)

POST   /api/admin/categories       # Create category
PUT    /api/admin/categories/:id   # Update category
DELETE /api/admin/categories/:id   # Delete category
```

## 🔧 How It Works

### Daily Tool Discovery Workflow

```
1. Cron trigger (2 AM daily)
   ↓
2. Search Jina AI with 10+ queries
   ↓
3. Collect unique tool URLs (filter duplicates)
   ↓
4. Check against discovered_tools table
   ↓
5. Queue new URLs (status: "discovered")
   ↓
6. Process batch of 5 tools:
   a. Scrape with Jina Reader
   b. Classify with Claude/GPT
   c. Find or create category
   d. Save to tools table
   e. Mark as "processed"
   ↓
7. Log results in automation_logs
```

### Metrics Update Workflow

```
1. Cron trigger (every 6 hours)
   ↓
2. For each approved tool:
   a. Calculate views from analytics table
   b. Fetch GitHub stars (if repo exists)
   c. Calculate SERP position via Jina Search
   d. Compute traffic, trend, popularity scores
   e. Insert into tool_metrics table
   f. Update tool's trendPercentage
   ↓
3. Log results
```

### Tool Refresh Workflow

```
1. Cron trigger (weekly Sunday 4 AM)
   ↓
2. Select oldest-updated tools (batch of 10)
   ↓
3. For each tool:
   a. Re-scrape website with Jina Reader
   b. Re-classify with AI
   c. Compare with existing data
   d. Update only changed fields
   ↓
4. Log results and changes
```

## 📈 Monitoring & Logs

### Viewing Automation Logs

Navigate to **Admin Panel → Automation** tab to see:

- Recent cron job executions
- Success/failure status
- Tools discovered/processed/updated
- Execution duration
- Error messages

### Discovered Tools Queue

View pending tools in **Automation** tab:

- URLs awaiting processing
- Processing status
- Discovery date
- Error messages (if failed)

## 🔐 Security

1. **Cron Secret**: All cron endpoints require `Authorization: Bearer ${CRON_SECRET}`
2. **Admin Routes**: Currently unprotected - add authentication middleware
3. **Rate Limiting**: Implemented via delays (2-3s between requests)
4. **API Keys**: Stored securely in environment variables

## 🎨 Future Enhancements

- [ ] Tool similarity detection with embeddings
- [ ] Social media mention tracking
- [ ] Website traffic analysis
- [ ] Automated screenshot generation
- [ ] Logo generation for missing logos
- [ ] Email notifications for new discoveries
- [ ] Slack/Discord integration for alerts
- [ ] Advanced analytics dashboard
- [ ] Tool comparison feature
- [ ] User authentication for admin panel

## 📚 Technical Stack

- **Backend**: Express.js, TypeScript, Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **AI**: Claude 3.5 Sonnet / GPT-4
- **APIs**: Jina AI (Search + Reader), GitHub API
- **Cron**: Vercel Cron Jobs
- **Frontend**: React, TanStack Query, Tailwind CSS

## 🐛 Troubleshooting

### Cron jobs not running

1. Check Vercel cron configuration in dashboard
2. Verify `CRON_SECRET` is set in environment
3. Check automation logs for errors
4. Manually trigger via API to test

### Tools not being discovered

1. Check Jina API key is valid
2. Review automation logs for errors
3. Verify search queries in `discoverTools.ts`
4. Check discovered_tools table for queued items

### AI classification failing

1. Verify `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` is set
2. Check API rate limits
3. Review fallback classification logic
4. Check automation logs for specific errors

### Metrics not updating

1. Verify analytics table has data
2. Check GitHub token if using GitHub API
3. Review metrics calculation formulas
4. Check automation logs for errors

## 📞 Support

For issues or questions:
1. Check automation logs in admin panel
2. Review error messages in console
3. Verify environment variables are set
4. Test cron jobs manually via API

---

**Built with ❤️ for AITRENDSDATA** | Fully automated AI tool discovery system
