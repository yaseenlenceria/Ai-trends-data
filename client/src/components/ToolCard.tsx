import { ArrowUpRight, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TrendBadge from "./TrendBadge";

interface ToolCardProps {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  category: string;
  upvotes: number;
  views: number;
  trendPercentage: number;
  isNew?: boolean;
}

export default function ToolCard({ 
  id, 
  name, 
  tagline, 
  logo, 
  category, 
  upvotes, 
  views, 
  trendPercentage,
  isNew = false 
}: ToolCardProps) {
  return (
    <Card 
      className="group hover-elevate active-elevate-2 p-6 cursor-pointer transition-all overflow-visible"
      data-testid={`card-tool-${id}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src={logo} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-mono font-bold text-lg leading-tight" data-testid={`text-tool-name-${id}`}>
              {name}
            </h3>
            {isNew && (
              <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">
                NEW
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-tagline-${id}`}>
            {tagline}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="text-xs">
          {category}
        </Badge>
        <TrendBadge percentage={trendPercentage} size="sm" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
          <div className="flex items-center gap-1" data-testid={`text-upvotes-${id}`}>
            <ArrowUp className="w-4 h-4" />
            {upvotes.toLocaleString()}
          </div>
          <div data-testid={`text-views-${id}`}>
            {views.toLocaleString()} views
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          data-testid={`button-view-tool-${id}`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
