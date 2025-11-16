import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Zap, Award, ArrowUp, ArrowDown, Minus, ExternalLink, Star } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function TrendingDashboard() {
  // Fetch tools data
  const { data: tools = [] } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const response = await fetch("/api/tools");
      if (!response.ok) return [];
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time data
  });

  // Calculate rankings
  const topByUpvotes = [...tools].sort((a, b) => b.upvotes - a.upvotes).slice(0, 10);
  const topByViews = [...tools].sort((a, b) => b.views - a.views).slice(0, 10);
  const fastestRising = [...tools].sort((a, b) => b.trendPercentage - a.trendPercentage).slice(0, 10);
  const newest = [...tools]
    .filter(tool => {
      const daysSinceCreated = (Date.now() - new Date(tool.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreated <= 7;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Category distribution for pie chart
  const categoryData = tools.reduce((acc: any, tool: any) => {
    const category = tool.category || "Other";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  })).slice(0, 8);

  // Trend data for line chart (mock weekly data)
  const trendData = [
    { week: "4 weeks ago", chatgpt: 45000, claude: 32000, midjourney: 28000, copilot: 25000 },
    { week: "3 weeks ago", chatgpt: 52000, claude: 38000, midjourney: 31000, copilot: 29000 },
    { week: "2 weeks ago", chatgpt: 58000, claude: 45000, midjourney: 33000, copilot: 32000 },
    { week: "Last week", chatgpt: 61000, claude: 51000, midjourney: 35000, copilot: 35000 },
    { week: "This week", chatgpt: 65000, claude: 58000, midjourney: 37000, copilot: 38000 },
  ];

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

  const getTrendIcon = (trendPercentage: number) => {
    if (trendPercentage > 10) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (trendPercentage < -10) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500 text-white">👑 #1</Badge>;
    if (index === 1) return <Badge className="bg-gray-400 text-white">🥈 #2</Badge>;
    if (index === 2) return <Badge className="bg-orange-600 text-white">🥉 #3</Badge>;
    return <Badge variant="outline">#{index + 1}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Live AI Tools Leaderboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Real-time rankings of the world's top AI tools. Updated every 30 seconds.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {tools.length} tools tracked
            </span>
          </div>
        </motion.div>

        {/* Market Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              Market Trends - Last 4 Weeks
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                <XAxis dataKey="week" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="chatgpt" stroke="#8b5cf6" strokeWidth={3} name="ChatGPT" />
                <Line type="monotone" dataKey="claude" stroke="#ec4899" strokeWidth={3} name="Claude" />
                <Line type="monotone" dataKey="midjourney" stroke="#06b6d4" strokeWidth={3} name="Midjourney" />
                <Line type="monotone" dataKey="copilot" stroke="#10b981" strokeWidth={3} name="GitHub Copilot" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="text-purple-600">Claude</strong> is gaining the fastest (+80.6% this week) 📈
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6 lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-600" />
              Top Tools by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topByUpvotes.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                <XAxis dataKey="name" stroke="#666" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="upvotes" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
            <h2 className="text-xl font-bold mb-6">Category Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Leaderboards */}
        <Tabs defaultValue="upvotes" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
            <TabsTrigger value="upvotes">🔥 Most Popular</TabsTrigger>
            <TabsTrigger value="views">👁️ Most Viewed</TabsTrigger>
            <TabsTrigger value="trending">⚡ Fastest Rising</TabsTrigger>
            <TabsTrigger value="new">✨ Newest</TabsTrigger>
          </TabsList>

          {[
            { key: "upvotes", data: topByUpvotes, metric: "upvotes", label: "upvotes" },
            { key: "views", data: topByViews, metric: "views", label: "views" },
            { key: "trending", data: fastestRising, metric: "trendPercentage", label: "trend" },
            { key: "new", data: newest, metric: "createdAt", label: "added" },
          ].map(({ key, data, metric, label }) => (
            <TabsContent key={key} value={key}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.map((tool: any, index: number) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-2 border-transparent hover:border-purple-500">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-gray-300 dark:text-gray-700">
                          {getRankBadge(index)}
                        </div>
                        <img
                          src={tool.logo}
                          alt={tool.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{tool.name}</h3>
                            {metric === "trendPercentage" && getTrendIcon(tool.trendPercentage)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                            {tool.tagline}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            {metric === "upvotes" && (
                              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                                <Star className="w-4 h-4 fill-current" />
                                {tool.upvotes.toLocaleString()}
                              </span>
                            )}
                            {metric === "views" && (
                              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                👁 {tool.views.toLocaleString()} views
                              </span>
                            )}
                            {metric === "trendPercentage" && (
                              <Badge className={tool.trendPercentage > 0 ? "bg-green-500" : "bg-red-500"}>
                                {tool.trendPercentage > 0 ? "+" : ""}
                                {tool.trendPercentage}% trend
                              </Badge>
                            )}
                            {metric === "createdAt" && (
                              <span className="text-green-600 dark:text-green-400 font-semibold">
                                🆕 {new Date(tool.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <Link href={`/tool/${tool.slug}`}>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            View
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Want to see your AI tool on this leaderboard?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join {tools.length}+ AI companies tracking their market position in real-time
            </p>
            <Link href="/submit">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                Submit Your Tool - It's Free
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
