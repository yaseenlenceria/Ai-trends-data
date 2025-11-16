import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Eye,
  ThumbsUp,
  Sparkles,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
} from 'lucide-react';
import { Link } from 'wouter';

type TimeRange = 'week' | 'month' | 'all';

export default function MarketDashboard() {
  const { tools, categories } = useData();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter tools by category
  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter(tool => tool.categoryId === parseInt(selectedCategory));

  // Calculate top performers
  const topByViews = [...filteredTools]
    .sort((a, b) => (b.viewsWeek || 0) - (a.viewsWeek || 0))
    .slice(0, 10);

  const topByGrowth = [...filteredTools]
    .filter(tool => tool.trendPercentage && tool.trendPercentage > 0)
    .sort((a, b) => (b.trendPercentage || 0) - (a.trendPercentage || 0))
    .slice(0, 10);

  const topByUpvotes = [...filteredTools]
    .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    .slice(0, 10);

  const trending = [...filteredTools]
    .filter(tool => tool.viewsWeek && tool.viewsWeek > 100)
    .sort((a, b) => (b.viewsWeek || 0) - (a.viewsWeek || 0))
    .slice(0, 5);

  // Calculate market share data (top 8 + others)
  const totalViews = filteredTools.reduce((sum, tool) => sum + (tool.viewsWeek || 0), 0);
  const top8Tools = [...filteredTools]
    .sort((a, b) => (b.viewsWeek || 0) - (a.viewsWeek || 0))
    .slice(0, 8);

  const othersViews = filteredTools
    .slice(8)
    .reduce((sum, tool) => sum + (tool.viewsWeek || 0), 0);

  const marketShareData = [
    ...top8Tools.map(tool => ({
      name: tool.name,
      value: tool.viewsWeek || 0,
      percentage: ((tool.viewsWeek || 0) / totalViews * 100).toFixed(1),
    })),
    ...(othersViews > 0 ? [{
      name: 'Others',
      value: othersViews,
      percentage: (othersViews / totalViews * 100).toFixed(1),
    }] : []),
  ];

  // Chart colors - vibrant and professional
  const COLORS = [
    '#8b5cf6', // Purple
    '#3b82f6', // Blue
    '#06b6d4', // Cyan
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#ec4899', // Pink
    '#6366f1', // Indigo
    '#64748b', // Slate (for others)
  ];

  // Prepare bar chart data for top 10
  const barChartData = topByViews.map((tool, index) => ({
    name: tool.name.length > 15 ? tool.name.substring(0, 15) + '...' : tool.name,
    views: tool.viewsWeek || 0,
    growth: tool.trendPercentage || 0,
    rank: index + 1,
  }));

  // Prepare area chart data for trends (mock 7-day data)
  const generateTrendData = (tool: typeof tools[0]) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseViews = (tool.viewsWeek || 0) / 7;
    return days.map((day, i) => ({
      day,
      views: Math.round(baseViews * (0.8 + Math.random() * 0.4)),
    }));
  };

  // Calculate total stats
  const totalTools = filteredTools.length;
  const totalUpvotes = filteredTools.reduce((sum, tool) => sum + (tool.upvotes || 0), 0);
  const avgGrowth = filteredTools
    .filter(t => t.trendPercentage)
    .reduce((sum, t) => sum + (t.trendPercentage || 0), 0) /
    filteredTools.filter(t => t.trendPercentage).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">AI Market Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Real-time insights into the AI tools market. Track trends, compare tools, and discover market leaders.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            <Button
              variant={timeRange === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeRange('week')}
              size="sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              This Week
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeRange('month')}
              size="sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              This Month
            </Button>
            <Button
              variant={timeRange === 'all' ? 'default' : 'outline'}
              onClick={() => setTimeRange('all')}
              size="sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              All Time
            </Button>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-md border bg-background"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tools</p>
                  <p className="text-3xl font-bold">{totalTools}</p>
                </div>
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Upvotes</p>
                  <p className="text-3xl font-bold">{totalUpvotes.toLocaleString()}</p>
                </div>
                <ThumbsUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Growth</p>
                  <p className="text-3xl font-bold">{avgGrowth.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="market-share">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Market Share
            </TabsTrigger>
            <TabsTrigger value="trends">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="growth">
              <Sparkles className="h-4 w-4 mr-2" />
              Growth
            </TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top by Views */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-500" />
                    Top 10 by Views
                  </CardTitle>
                  <CardDescription>Most viewed AI tools this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barChartData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <Bar dataKey="views" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top by Upvotes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    Top 10 by Upvotes
                  </CardTitle>
                  <CardDescription>Most loved AI tools by community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topByUpvotes.map((tool, index) => (
                      <Link key={tool.id} href={`/tool/${tool.slug}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {index < 3 ? <Crown className="h-4 w-4" /> : index + 1}
                          </div>

                          {tool.logo && (
                            <img
                              src={tool.logo}
                              alt={tool.name}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate group-hover:text-primary transition-colors">
                              {tool.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {tool.upvotes} upvotes
                            </p>
                          </div>

                          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top by Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Fastest Growing Tools
                </CardTitle>
                <CardDescription>Tools with the highest growth rate this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {topByGrowth.slice(0, 5).map((tool, index) => (
                    <Link key={tool.id} href={`/tool/${tool.slug}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                        <CardContent className="pt-6">
                          {tool.logo && (
                            <img
                              src={tool.logo}
                              alt={tool.name}
                              className="w-16 h-16 mx-auto rounded-xl object-cover mb-3"
                            />
                          )}
                          <p className="font-semibold text-center mb-2 group-hover:text-primary transition-colors">
                            {tool.name}
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <span className="text-2xl font-bold text-emerald-500">
                              +{tool.trendPercentage}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Share Tab */}
          <TabsContent value="market-share" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Market Share Distribution</CardTitle>
                  <CardDescription>Share of total views by tool</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={marketShareData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {marketShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Market Share List */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Breakdown</CardTitle>
                  <CardDescription>View distribution by percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketShareData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.percentage}% ({item.value.toLocaleString()} views)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Trends - Top 5 Tools</CardTitle>
                <CardDescription>View trends over the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={generateTrendData(trending[0] || tools[0])}>
                    <defs>
                      {trending.slice(0, 5).map((tool, index) => (
                        <linearGradient key={tool.id} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS[index]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS[index]} stopOpacity={0}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Legend />
                    {trending.slice(0, 5).map((tool, index) => (
                      <Area
                        key={tool.id}
                        type="monotone"
                        dataKey="views"
                        stroke={COLORS[index]}
                        fillOpacity={1}
                        fill={`url(#color${index})`}
                        name={tool.name}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Trending Now */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Trending Right Now
                </CardTitle>
                <CardDescription>Tools gaining momentum this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trending.map((tool) => (
                    <Link key={tool.id} href={`/tool/${tool.slug}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            {tool.logo && (
                              <img
                                src={tool.logo}
                                alt={tool.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                {tool.name}
                              </p>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {tool.tagline}
                              </p>
                              <div className="flex items-center gap-2 text-sm">
                                <Badge variant="secondary" className="gap-1">
                                  <Eye className="h-3 w-3" />
                                  {tool.viewsWeek?.toLocaleString()}
                                </Badge>
                                {tool.trendPercentage && tool.trendPercentage > 0 && (
                                  <Badge variant="default" className="gap-1 bg-emerald-500">
                                    <TrendingUp className="h-3 w-3" />
                                    +{tool.trendPercentage}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Growth Tab */}
          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Comparison</CardTitle>
                <CardDescription>Compare growth rates across top tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topByGrowth.slice(0, 10).map((tool, index) => ({
                    name: tool.name.length > 15 ? tool.name.substring(0, 15) + '...' : tool.name,
                    growth: tool.trendPercentage || 0,
                    views: tool.viewsWeek || 0,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Bar dataKey="growth" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Growth Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fastest Riser</CardTitle>
                </CardHeader>
                <CardContent>
                  {topByGrowth[0] && (
                    <Link href={`/tool/${topByGrowth[0].slug}`}>
                      <div className="flex items-center gap-3 cursor-pointer group">
                        {topByGrowth[0].logo && (
                          <img
                            src={topByGrowth[0].logo}
                            alt={topByGrowth[0].name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold group-hover:text-primary transition-colors">
                            {topByGrowth[0].name}
                          </p>
                          <p className="text-2xl font-bold text-emerald-500">
                            +{topByGrowth[0].trendPercentage}%
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Viewed</CardTitle>
                </CardHeader>
                <CardContent>
                  {topByViews[0] && (
                    <Link href={`/tool/${topByViews[0].slug}`}>
                      <div className="flex items-center gap-3 cursor-pointer group">
                        {topByViews[0].logo && (
                          <img
                            src={topByViews[0].logo}
                            alt={topByViews[0].name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold group-hover:text-primary transition-colors">
                            {topByViews[0].name}
                          </p>
                          <p className="text-2xl font-bold text-blue-500">
                            {topByViews[0].viewsWeek?.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Community Favorite</CardTitle>
                </CardHeader>
                <CardContent>
                  {topByUpvotes[0] && (
                    <Link href={`/tool/${topByUpvotes[0].slug}`}>
                      <div className="flex items-center gap-3 cursor-pointer group">
                        {topByUpvotes[0].logo && (
                          <img
                            src={topByUpvotes[0].logo}
                            alt={topByUpvotes[0].name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold group-hover:text-primary transition-colors">
                            {topByUpvotes[0].name}
                          </p>
                          <p className="text-2xl font-bold text-green-500">
                            {topByUpvotes[0].upvotes} upvotes
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Want to see your AI tool here?</h3>
                <p className="text-muted-foreground">
                  Submit your AI tool and get instant access to our market dashboard with detailed analytics and comparisons.
                </p>
              </div>
              <Link href="/submit">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Submit Your Tool
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
