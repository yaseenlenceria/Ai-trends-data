import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface SponsorCardProps {
  id: string;
  name: string;
  logo: string;
  description: string;
  url: string;
  tier: "premium" | "standard";
}

export default function SponsorCard({ id, name, logo, description, url, tier }: SponsorCardProps) {
  return (
    <Card 
      className={`hover-elevate active-elevate-2 p-6 cursor-pointer transition-all overflow-visible ${
        tier === "premium" ? "border-2 border-primary/50" : ""
      }`}
      data-testid={`card-sponsor-${id}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            <img src={logo} alt={name} className="w-full h-full object-cover" />
          </div>
          <Badge variant="outline" className="text-xs">
            {tier === "premium" ? "Premium Sponsor" : "Sponsor"}
          </Badge>
        </div>
        
        <div>
          <h3 className="font-mono font-bold text-lg mb-2" data-testid={`text-sponsor-name-${id}`}>
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-sponsor-description-${id}`}>
            {description}
          </p>
        </div>

        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
          data-testid={`link-sponsor-${id}`}
        >
          Visit Website
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </Card>
  );
}
