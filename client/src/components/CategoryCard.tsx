import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  toolCount: number;
  gradient: string;
}

export default function CategoryCard({ id, name, icon: Icon, toolCount, gradient }: CategoryCardProps) {
  return (
    <Card 
      className={`hover-elevate active-elevate-2 p-6 cursor-pointer transition-all overflow-visible ${gradient}`}
      data-testid={`card-category-${id}`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-mono font-bold text-base mb-1" data-testid={`text-category-name-${id}`}>
            {name}
          </h3>
          <p className="text-sm text-muted-foreground" data-testid={`text-tool-count-${id}`}>
            {toolCount} tools
          </p>
        </div>
      </div>
    </Card>
  );
}
