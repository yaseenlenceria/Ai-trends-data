# AITRENDSDATA

> Discover the best new AI tools, ranked by real usage data and trends.

AITRENDSDATA is a comprehensive AI tools leaderboard and discovery platform. Companies can submit their AI tools for visibility, while users can discover, compare, and browse the latest AI innovations across various categories.

## Features

### For Users
- 🔍 **Discover AI Tools** - Browse trending, fastest-rising, and new AI tools
- 📊 **Compare Tools** - View detailed analytics, pricing, and features
- 🏷️ **Browse by Category** - AI Assistants, Image Generation, Code Assistants, and more
- 📈 **Track Trends** - See 7-day trend data and upvote counts
- 🔎 **Advanced Search** - Filter and search tools by category and keywords

### For Companies
- 📤 **Submit Your Tool** - Get listed on AITRENDSDATA for visibility
- 📊 **Analytics Dashboard** - Track views, upvotes, and trend performance
- 🎖️ **Embeddable Badges** - Show off your ranking on your website
- 🚀 **SEO Benefits** - Get a dedicated tool page with backlinks
- 💎 **Sponsorship Opportunities** - Featured placement for premium visibility

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS 4** - Styling
- **Shadcn UI** - Component library
- **Framer Motion** - Animations
- **Recharts** - Data visualization

### Backend
- **Express.js** - REST API server
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** (Neon Serverless) - Database
- **Zod** - Schema validation

### Deployment
- **Vercel** - Frontend and API hosting
- **Neon** - Serverless PostgreSQL

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Neon account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Ai-trends-data.git
   cd Ai-trends-data
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   VITE_APP_URL=http://localhost:5000
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Seed the database**
   ```bash
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to `http://localhost:5000`

## Database Schema

### Tables

#### `categories`
Stores AI tool categories (AI Assistant, Image Generation, etc.)

#### `tools`
Main table for approved AI tools with:
- Basic info (name, slug, tagline, description)
- Media (logo, screenshots)
- Metrics (upvotes, views, trend percentage)
- Pricing information
- Social links (Twitter, GitHub)
- Status (pending, approved, rejected)

#### `submissions`
Pending tool submissions before approval

#### `sponsors`
Sponsored companies and their tier level

#### `upvotes`
Tracks user upvotes (by userId or IP address)

#### `analytics`
Tracks view, click, and upvote events for analytics

#### `users`
User accounts (for future authentication)

## API Endpoints

### Tools
- `GET /api/tools` - Get all approved tools
- `GET /api/tools/trending` - Get trending tools (top 10)
- `GET /api/tools/fastest-rising` - Get fastest rising tools
- `GET /api/tools/new` - Get newly added tools
- `GET /api/tools/category/:categoryId` - Get tools by category
- `GET /api/tools/:slug` - Get tool by slug
- `GET /api/tools/:slug/analytics` - Get 7-day trend data

### Categories
- `GET /api/categories` - Get all categories with tool counts

### Sponsors
- `GET /api/sponsors` - Get active sponsors

### Submissions
- `POST /api/submissions` - Submit a new tool
- `GET /api/submissions` - Get all submissions (admin)
- `PATCH /api/submissions/:id/approve` - Approve submission (admin)
- `PATCH /api/submissions/:id/reject` - Reject submission (admin)

### Upvotes
- `POST /api/upvotes` - Upvote a tool

### Analytics
- `POST /api/analytics/view` - Track a tool view
- `POST /api/analytics/click` - Track a tool click

### Badges
- `GET /api/badge/:slug` - Get embeddable badge HTML

### Search
- `GET /api/search?q=&category=` - Search tools

## Project Structure

```
Ai-trends-data/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (DataContext)
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── index.html
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── db.ts             # Database config
│   ├── seed.ts           # Database seeding
│   └── storage.ts        # Storage interface
├── shared/
│   └── schema.ts         # Database schema (Drizzle)
└── api/
    └── index.js          # Vercel serverless function
```

## Development Scripts

```bash
npm run dev           # Start dev server (frontend + backend)
npm run build         # Build for production
npm run start         # Start production server
npm run check         # TypeScript type checking
npm run db:push       # Push schema to database
npm run db:seed       # Seed database with initial data
```

## Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL`
   - `VITE_APP_URL`
3. **Deploy!**

The project is configured for Vercel with:
- `vercel.json` for routing configuration
- `api/index.js` for serverless API functions

### Database Setup (Neon)

1. Create a Neon PostgreSQL database
2. Copy the connection string
3. Add to `.env` and Vercel environment variables
4. Run migrations: `npm run db:push`
5. Seed database: `npm run db:seed`

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

For support, email support@aitrendsdata.com or open an issue on GitHub.

## Roadmap

- [ ] User authentication and profiles
- [ ] Admin dashboard for managing submissions
- [ ] Advanced analytics dashboard
- [ ] Tool comparison feature
- [ ] Email newsletter integration
- [ ] API rate limiting
- [ ] Full-text search
- [ ] Tool reviews and ratings
- [ ] Chrome extension
- [ ] Mobile app

## Acknowledgments

- Built with [Replit](https://replit.com)
- Icons by [Lucide](https://lucide.dev)
- UI components by [Shadcn UI](https://ui.shadcn.com)
- Hosted on [Vercel](https://vercel.com)
- Database by [Neon](https://neon.tech)
