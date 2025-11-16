import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Eye,
  ThumbsUp,
  TrendingUp,
  TrendingDown,
  X,
  Search,
  GitCompare,
  Crown,
  ExternalLink,
  Check,
  Minus,
  DollarSign,
} from 'lucide-react';
import { Link } from 'wouter';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function Compare() {
  const { tools, categories } = useData();
  const [selectedTools, setSelectedTools] = useState<typeof tools>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter tools for search
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.categoryId === parseInt(selectedCategory);
      const notSelected = !selectedTools.find(t => t.id === tool.id);
      return matchesSearch && matchesCategory && notSelected;
    });
  }, [tools, searchQuery, selectedCategory, selectedTools]);

  const addTool = (tool: typeof tools[0]) => {
    if (selectedTools.length < 4) {
      setSelectedTools([...selectedTools, tool]);
      setSearchQuery('');
    }
  };

  const removeTool = (toolId: number) => {
    setSelectedTools(selectedTools.filter(t => t.id !== toolId));
  };

  // Calculate comparison metrics
  const getMetricValue = (tool: typeof tools[0], metric: string): number => {
    switch (metric) {
      case 'Views':
        return tool.viewsWeek || 0;
      case 'Upvotes':
        return tool.upvotes || 0;
      case 'Growth':
        return tool.trendPercentage || 0;
      case 'Engagement':
        return ((tool.upvotes || 0) / Math.max(tool.viewsWeek || 1, 1)) * 100;
      case 'Popularity':
        return ((tool.viewsWeek || 0) / 100);
      default:
        return 0;
    }
  };

  // Radar chart data
  const radarData = useMemo(() => {
    if (selectedTools.length === 0) return [];

    const metrics = ['Views', 'Upvotes', 'Growth', 'Engagement', 'Popularity'];

    // Normalize values to 0-100 scale for better visualization
    const maxValues = metrics.reduce((acc, metric) => {
      acc[metric] = Math.max(...selectedTools.map(tool => getMetricValue(tool, metric)), 1);
      return acc;
    }, {} as Record<string, number>);

    return metrics.map(metric => {
      const dataPoint: any = { metric };
      selectedTools.forEach(tool => {
        const rawValue = getMetricValue(tool, metric);
        dataPoint[tool.name] = (rawValue / maxValues[metric]) * 100;
      });
      return dataPoint;
    });
  }, [selectedTools]);

  // Bar chart data for direct comparison
  const barChartData = useMemo(() => {
    return selectedTools.map(tool => ({
      name: tool.name.length > 12 ? tool.name.substring(0, 12) + '...' : tool.name,
      Views: tool.viewsWeek || 0,
      Upvotes: tool.upvotes || 0,
      Growth: tool.trendPercentage || 0,
    }));
  }, [selectedTools]);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  // Get category name
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  // Get pricing model
  const getPricingModel = (tool: typeof tools[0]) => {
    if (!tool.pricing) return 'Not specified';
    if (typeof tool.pricing === 'string') {
      try {
        const parsed = JSON.parse(tool.pricing);
        return parsed.model || 'Not specified';
      } catch {
        return 'Not specified';
      }
    }
    return tool.pricing.model || 'Not specified';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <GitCompare className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Compare AI Tools</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Select up to 4 AI tools to compare features, metrics, and performance side-by-side.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tool Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Tools to Compare</CardTitle>
            <CardDescription>
              Choose up to 4 tools ({selectedTools.length}/4 selected)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Tools */}
            {selectedTools.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTools.map(tool => (
                  <Badge key={tool.id} variant="secondary" className="gap-2 py-2 px-3">
                    {tool.logo && (
                      <img src={tool.logo} alt={tool.name} className="w-4 h-4 rounded" />
                    )}
                    {tool.name}
                    <button
                      onClick={() => removeTool(tool.id)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Search Results */}
            {searchQuery && filteredTools.length > 0 && (
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {filteredTools.slice(0, 10).map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => addTool(tool)}
                    disabled={selectedTools.length >= 4}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    {tool.logo && (
                      <img src={tool.logo} alt={tool.name} className="w-10 h-10 rounded-md object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{tool.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{tool.tagline}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comparison Content */}
        {selectedTools.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <GitCompare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Tools Selected</h3>
              <p className="text-muted-foreground mb-6">
                Start by searching and selecting tools above to begin your comparison
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {tools.slice(0, 5).map(tool => (
                  <Button
                    key={tool.id}
                    variant="outline"
                    onClick={() => addTool(tool)}
                    className="gap-2"
                  >
                    {tool.logo && (
                      <img src={tool.logo} alt={tool.name} className="w-4 h-4 rounded" />
                    )}
                    {tool.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Visual Comparison Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Radar</CardTitle>
                  <CardDescription>Multi-dimensional performance comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {selectedTools.map((tool, index) => (
                        <Radar
                          key={tool.id}
                          name={tool.name}
                          dataKey={tool.name}
                          stroke={COLORS[index]}
                          fill={COLORS[index]}
                          fillOpacity={0.3}
                        />
                      ))}
                      <Legend />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Metrics Comparison</CardTitle>
                  <CardDescription>Direct metric comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="Views" fill="#3b82f6" />
                      <Bar dataKey="Upvotes" fill="#10b981" />
                      <Bar dataKey="Growth" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
                <CardDescription>Side-by-side feature and metric comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Feature</th>
                        {selectedTools.map(tool => (
                          <th key={tool.id} className="text-center p-4">
                            <Link href={`/tool/${tool.slug}`}>
                              <div className="flex flex-col items-center gap-2 cursor-pointer group">
                                {tool.logo && (
                                  <img
                                    src={tool.logo}
                                    alt={tool.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                )}
                                <span className="font-semibold group-hover:text-primary transition-colors">
                                  {tool.name}
                                </span>
                              </div>
                            </Link>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Category */}
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">Category</td>
                        {selectedTools.map(tool => (
                          <td key={tool.id} className="p-4 text-center">
                            <Badge variant="outline">{getCategoryName(tool.categoryId)}</Badge>
                          </td>
                        ))}
                      </tr>

                      {/* Weekly Views */}
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-500" />
                            Weekly Views
                          </div>
                        </td>
                        {selectedTools.map(tool => {
                          const isMax = tool.viewsWeek === Math.max(...selectedTools.map(t => t.viewsWeek || 0));
                          return (
                            <td key={tool.id} className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {isMax && <Crown className="h-4 w-4 text-yellow-500" />}
                                <span className={isMax ? 'font-bold text-blue-500' : ''}>
                                  {(tool.viewsWeek || 0).toLocaleString()}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Upvotes */}
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                            Upvotes
                          </div>
                        </td>
                        {selectedTools.map(tool => {
                          const isMax = tool.upvotes === Math.max(...selectedTools.map(t => t.upvotes || 0));
                          return (
                            <td key={tool.id} className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {isMax && <Crown className="h-4 w-4 text-yellow-500" />}
                                <span className={isMax ? 'font-bold text-green-500' : ''}>
                                  {(tool.upvotes || 0).toLocaleString()}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Growth */}
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            Growth Rate
                          </div>
                        </td>
                        {selectedTools.map(tool => {
                          const isMax = tool.trendPercentage === Math.max(...selectedTools.map(t => t.trendPercentage || 0));
                          const growth = tool.trendPercentage || 0;
                          return (
                            <td key={tool.id} className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {isMax && growth > 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                                <span className={`flex items-center gap-1 ${isMax && growth > 0 ? 'font-bold text-emerald-500' : ''}`}>
                                  {growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                  {growth > 0 ? '+' : ''}{growth}%
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Engagement Rate */}
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">Engagement Rate</td>
                        {selectedTools.map(tool => {
                          const rate = ((tool.upvotes || 0) / Math.max(tool.viewsWeek || 1, 1)) * 100;
                          const isMax = rate === Math.max(...selectedTools.map(t => ((t.upvotes || 0) / Math.max(t.viewsWeek || 1, 1)) * 100));
                          return (
                            <td key={tool.id} className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {isMax && <Crown className="h-4 w-4 text-yellow-500" />}
                                <span className={isMax ? 'font-bold text-primary' : ''}>
                                  {rate.toFixed(2)}%
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Pricing Model */}
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Pricing
                          </div>
                        </td>
                        {selectedTools.map(tool => (
                          <td key={tool.id} className="p-4 text-center">
                            <Badge
                              variant={getPricingModel(tool) === 'Free' ? 'default' : 'secondary'}
                            >
                              {getPricingModel(tool)}
                            </Badge>
                          </td>
                        ))}
                      </tr>

                      {/* Status */}
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">Status</td>
                        {selectedTools.map(tool => (
                          <td key={tool.id} className="p-4 text-center">
                            <Badge variant={tool.status === 'active' ? 'default' : 'secondary'}>
                              {tool.status || 'Active'}
                            </Badge>
                          </td>
                        ))}
                      </tr>

                      {/* Website */}
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">Website</td>
                        {selectedTools.map(tool => (
                          <td key={tool.id} className="p-4 text-center">
                            {tool.website ? (
                              <a
                                href={tool.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Visit
                              </a>
                            ) : (
                              <Minus className="h-4 w-4 mx-auto text-muted-foreground" />
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Description */}
                      <tr className="hover:bg-muted/30">
                        <td className="p-4 font-medium align-top">Description</td>
                        {selectedTools.map(tool => (
                          <td key={tool.id} className="p-4 text-center text-sm text-muted-foreground">
                            {tool.tagline || tool.description || '-'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Winner Summary */}
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Comparison Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50">
                    <Eye className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Most Viewed</p>
                      <p className="font-semibold">
                        {[...selectedTools].sort((a, b) => (b.viewsWeek || 0) - (a.viewsWeek || 0))[0]?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50">
                    <ThumbsUp className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Most Loved</p>
                      <p className="font-semibold">
                        {[...selectedTools].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))[0]?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50">
                    <TrendingUp className="h-8 w-8 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fastest Growing</p>
                      <p className="font-semibold">
                        {[...selectedTools].sort((a, b) => (b.trendPercentage || 0) - (a.trendPercentage || 0))[0]?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
