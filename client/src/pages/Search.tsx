import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/context/DataContext";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { tools, categories } = useData();

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || tool.categoryId === categoryFilter;
    const matchesFilter = filter === "all" || 
                         (filter === "new" && tool.isNew) ||
                         (filter === "trending" && tool.trendPercentage > 50);
    return matchesSearch && matchesCategory && matchesFilter;
  });

  return (
    <div className="pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-mono font-bold text-4xl mb-4">Search AI Tools</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover the perfect AI tool for your needs
          </p>
          <SearchBar 
            placeholder="Search by name, description, or category..."
            onSearch={setSearchQuery}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Tabs value={filter} onValueChange={setFilter} className="flex-1">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="trending" data-testid="tab-trending">Trending</TabsTrigger>
              <TabsTrigger value="new" data-testid="tab-new">New</TabsTrigger>
              <TabsTrigger value="top" data-testid="tab-top">Top Rated</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]" data-testid="select-pricing-filter">
                <SelectValue placeholder="Pricing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pricing</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="freemium">Freemium</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-mono font-bold text-foreground">{filteredTools.length}</span> tools found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">No tools found matching your search</p>
            <Button variant="outline" onClick={() => setSearchQuery("")} data-testid="button-clear-filters">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
