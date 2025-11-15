// Serverless function wrapper for Vercel
import express from "express";

const app = express();

// Parse JSON bodies
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Import and register your routes from the built server
// Note: You'll need to ensure your routes are properly exported and imported
app.get("/api", (_req, res) => {
  res.json({
    message: "API is running on Vercel",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Add your actual API routes here
// Example:
// import { registerRoutes } from "../dist/routes.js";
// await registerRoutes(app);

// Error handler
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel serverless
export default app;
