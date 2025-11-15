import CategoryCard from "@/components/CategoryCard";
import ToolCard from "@/components/ToolCard";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Search, Filter, Sparkles } from "lucide-react";

export default function Categories() {
  const { categories, getToolsByCategory, tools, isLoading } = useData();

  const totalTools = tools.length;

  if (isLoading) {
    return (
      <div className="pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12 animate-pulse">
            <div className="h-10 bg-muted rounded w-64 mb-4" />
            <div className="h-6 bg-muted rounded w-96 mb-2" />
            <div className="h-5 bg-muted rounded w-48" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{totalTools} AI Tools Available</span>
            </div>
            <h1 className="font-mono font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Browse by Category
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Explore {totalTools} AI tools organized by their primary use case and functionality across {categories.length} specialized categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/search">
                <Button size="lg" className="gap-2">
                  <Search className="w-4 h-4" />
                  Search All Tools
                </Button>
              </Link>
              <Link href="/submit">
                <Button size="lg" variant="outline" className="gap-2">
                  Submit Your Tool
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Category Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-mono font-bold text-3xl mb-2">All Categories</h2>
              <p className="text-muted-foreground">Select a category to explore specialized AI tools</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {categories.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-muted-foreground mb-4">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-mono font-bold text-xl mb-2">No categories found</h3>
                <p>Check back later for new categories.</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  {...category}
                  gradient="bg-gradient-to-br from-card to-card hover:from-primary/5 hover:to-primary/10 transition-all duration-300"
                />
              ))}
            </div>
          )}
        </div>

        {/* Tools by Category */}
        <div className="space-y-16">
          <div className="mb-8">
            <h2 className="font-mono font-bold text-3xl mb-2">Explore by Category</h2>
            <p className="text-muted-foreground">Top tools in each category</p>
          </div>

          {categories.map((category) => {
            const categoryTools = getToolsByCategory(category.id).slice(0, 6);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category.id} className="scroll-mt-20" id={category.slug}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-2xl md:text-3xl">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.toolCount} tools available</p>
                    </div>
                  </div>
                  <Link href={`/search?category=${category.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {category.description && (
                  <p className="text-muted-foreground mb-6 max-w-3xl">
                    {category.description}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((tool) => (
                    <ToolCard key={tool.id} {...tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <Card className="mt-16 p-8 md:p-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-mono font-bold text-2xl md:text-3xl mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-muted-foreground mb-6">
              Submit your AI tool and help others discover great solutions
            </p>
            <Link href="/submit">
              <Button size="lg" className="gap-2">
                Submit Your Tool
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
