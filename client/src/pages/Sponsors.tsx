import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import SponsorCard from "@/components/SponsorCard";

export default function Sponsors() {
  const currentSponsors = [
    {
      id: "openai",
      name: "OpenAI",
      logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
      description: "Building safe and beneficial artificial intelligence",
      url: "https://openai.com",
      tier: "premium" as const,
    },
    {
      id: "anthropic",
      name: "Anthropic",
      logo: "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=128&h=128&fit=crop",
      description: "AI safety and research company focused on building reliable AI systems",
      url: "https://anthropic.com",
      tier: "standard" as const,
    },
    {
      id: "huggingface",
      name: "Hugging Face",
      logo: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=128&h=128&fit=crop",
      description: "The AI community building the future of machine learning",
      url: "https://huggingface.co",
      tier: "standard" as const,
    },
  ];

  const pricingPlans = [
    {
      name: "Standard",
      price: "$499",
      period: "per month",
      features: [
        "Logo placement on homepage",
        "Sponsor badge on profile",
        "1,000,000+ monthly impressions",
        "Link in sponsors section",
        "Monthly analytics report",
      ],
    },
    {
      name: "Premium",
      price: "$999",
      period: "per month",
      popular: true,
      features: [
        "Everything in Standard",
        "Priority logo placement",
        "Featured in newsletter",
        "3,000,000+ monthly impressions",
        "Dedicated account manager",
        "Custom promotional content",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      features: [
        "Everything in Premium",
        "Custom integration options",
        "Unlimited impressions",
        "Co-marketing opportunities",
        "API access for analytics",
        "White-label options",
      ],
    },
  ];

  return (
    <div className="pb-24 md:pb-8">
      <div className="bg-gradient-to-br from-background via-background to-muted">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-mono font-bold text-4xl md:text-5xl mb-6">
              Sponsor AITRENDSDATA
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Reach millions of AI enthusiasts, developers, and decision-makers actively searching for AI solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" data-testid="button-get-started">
                Get Started
              </Button>
              <Button size="lg" variant="outline" data-testid="button-view-media-kit">
                View Media Kit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="font-mono font-bold text-3xl mb-4 text-center">Why Sponsor Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="font-mono font-bold text-4xl text-primary mb-2">3M+</div>
              <p className="text-sm text-muted-foreground">Monthly Page Views</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="font-mono font-bold text-4xl text-primary mb-2">500K+</div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="font-mono font-bold text-4xl text-primary mb-2">75%</div>
              <p className="text-sm text-muted-foreground">Decision Makers</p>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="font-mono font-bold text-3xl mb-8 text-center">Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.name}
                className={`p-8 ${plan.popular ? "border-2 border-primary" : ""}`}
              >
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="font-mono font-bold text-2xl mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="font-mono font-bold text-4xl">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  data-testid={`button-select-${plan.name.toLowerCase()}`}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-mono font-bold text-3xl mb-8 text-center">Current Sponsors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {currentSponsors.map((sponsor) => (
              <SponsorCard key={sponsor.id} {...sponsor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
