import CategoryCard from "@/components/CategoryCard";
import ToolCard from "@/components/ToolCard";
import { useData } from "@/context/DataContext";

export default function Categories() {
  const { categories, getToolsByCategory, tools } = useData();
  
  const totalTools = tools.length;

  return (
    <div className="pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="font-mono font-bold text-4xl mb-4">Browse by Category</h1>
          <p className="text-lg text-muted-foreground">
            Explore AI tools organized by their primary use case and functionality
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <span className="font-mono font-bold text-2xl text-foreground">{totalTools}</span> tools across <span className="font-mono font-bold text-foreground">{categories.length}</span> categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              {...category}
              gradient="bg-gradient-to-br from-card to-card"
            />
          ))}
        </div>

        <div className="space-y-12">
          {categories.map((category) => {
            const categoryTools = getToolsByCategory(category.id).slice(0, 3);
            if (categoryTools.length === 0) return null;
            
            return (
              <div key={category.id}>
                <div className="flex items-center gap-3 mb-6">
                  <category.icon className="w-6 h-6 text-primary" />
                  <h2 className="font-mono font-bold text-3xl">{category.name}</h2>
                  <span className="text-muted-foreground">{category.toolCount} tools</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((tool) => (
                    <ToolCard key={tool.id} {...tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
