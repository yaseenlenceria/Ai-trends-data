import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { useData } from "@/context/DataContext";

interface FormData {
  name: string;
  tagline: string;
  website: string;
  categoryId: string;
  description: string;
  pricingModel: string;
  twitter: string;
  github: string;
  logo: string;
  screenshots: string[];
  submitterEmail: string;
  submitterName: string;
}

export default function Submit() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { categories } = useData();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    tagline: "",
    website: "",
    categoryId: "",
    description: "",
    pricingModel: "",
    twitter: "",
    github: "",
    logo: "",
    screenshots: [],
    submitterEmail: "",
    submitterName: "",
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit the form
      setSubmitting(true);
      setError(null);
      try {
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            tagline: formData.tagline,
            description: formData.description,
            logo: formData.logo || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
            categoryId: formData.categoryId,
            website: formData.website,
            twitter: formData.twitter || null,
            github: formData.github || null,
            screenshots: formData.screenshots.length > 0 ? formData.screenshots : null,
            pricing: formData.pricingModel ? {
              model: formData.pricingModel,
              plans: [],
            } : null,
            submitterEmail: formData.submitterEmail,
            submitterName: formData.submitterName || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to submit");
        }

        setSubmitted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-mono font-bold text-3xl mb-4">Submission Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Your AI tool has been submitted for review. We'll notify you once it's approved and live on the platform.
          </p>
          <Button onClick={() => {
            setSubmitted(false);
            setStep(1);
            setFormData({
              name: "",
              tagline: "",
              website: "",
              categoryId: "",
              description: "",
              pricingModel: "",
              twitter: "",
              github: "",
              logo: "",
              screenshots: [],
              submitterEmail: "",
              submitterName: "",
            });
          }} data-testid="button-submit-another">
            Submit Another Tool
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-mono font-bold text-4xl mb-2">Submit Your AI Tool</h1>
        <p className="text-muted-foreground mb-8">
          Share your AI tool with the community and get discovered by thousands of users
        </p>

        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
                data-testid={`step-indicator-${s}`}
              >
                {s}
              </div>
              {s < 4 && (
                <div className={`flex-1 h-1 mx-2 ${s < step ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="p-8 mb-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-mono font-bold text-2xl mb-6">Basic Information</h2>
              <div className="space-y-2">
                <Label htmlFor="tool-name">Tool Name *</Label>
                <Input
                  id="tool-name"
                  placeholder="e.g., ChatGPT"
                  data-testid="input-tool-name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline *</Label>
                <Input
                  id="tagline"
                  placeholder="Short description in one sentence"
                  data-testid="input-tagline"
                  value={formData.tagline}
                  onChange={(e) => updateFormData("tagline", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website URL *</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  data-testid="input-website"
                  value={formData.website}
                  onChange={(e) => updateFormData("website", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => updateFormData("categoryId", value)}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="submitter-email">Your Email *</Label>
                <Input
                  id="submitter-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.submitterEmail}
                  onChange={(e) => updateFormData("submitterEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="submitter-name">Your Name (Optional)</Label>
                <Input
                  id="submitter-name"
                  placeholder="John Doe"
                  value={formData.submitterName}
                  onChange={(e) => updateFormData("submitterName", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-mono font-bold text-2xl mb-6">Media</h2>
              <div className="space-y-2">
                <Label htmlFor="logo-url">Logo URL *</Label>
                <Input
                  id="logo-url"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  data-testid="input-logo"
                  value={formData.logo}
                  onChange={(e) => updateFormData("logo", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Provide a URL to your tool's logo (Square image recommended)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="screenshot-url">Screenshot URL (Optional)</Label>
                <Input
                  id="screenshot-url"
                  type="url"
                  placeholder="https://example.com/screenshot.png"
                  data-testid="input-screenshots"
                  value={formData.screenshots[0] || ""}
                  onChange={(e) => {
                    const newScreenshots = e.target.value ? [e.target.value] : [];
                    updateFormData("screenshots", newScreenshots);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Provide a URL to a screenshot of your tool (16:9 ratio recommended)
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-mono font-bold text-2xl mb-6">Details</h2>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of your AI tool, its features, and use cases..."
                  rows={8}
                  data-testid="textarea-description"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricing">Pricing Model</Label>
                <Select value={formData.pricingModel} onValueChange={(value) => updateFormData("pricingModel", value)}>
                  <SelectTrigger data-testid="select-pricing">
                    <SelectValue placeholder="Select pricing model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter URL (Optional)</Label>
                <Input
                  id="twitter"
                  type="url"
                  placeholder="https://twitter.com/..."
                  data-testid="input-twitter"
                  value={formData.twitter}
                  onChange={(e) => updateFormData("twitter", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL (Optional)</Label>
                <Input
                  id="github"
                  type="url"
                  placeholder="https://github.com/..."
                  data-testid="input-github"
                  value={formData.github}
                  onChange={(e) => updateFormData("github", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-mono font-bold text-2xl mb-6">Review & Publish</h2>
              {error && (
                <div className="bg-destructive/10 text-destructive border border-destructive rounded-lg p-4 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-mono font-bold mb-1">Tool Name</h3>
                  <p className="text-muted-foreground">{formData.name || "Not provided"}</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-mono font-bold mb-1">Category</h3>
                  <p className="text-muted-foreground">
                    {categories.find((c) => c.id === formData.categoryId)?.name || "Not selected"}
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-mono font-bold mb-1">Tagline</h3>
                  <p className="text-muted-foreground">{formData.tagline || "Not provided"}</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-mono font-bold mb-1">Website</h3>
                  <p className="text-muted-foreground">{formData.website || "Not provided"}</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-mono font-bold mb-1">Email</h3>
                  <p className="text-muted-foreground">{formData.submitterEmail || "Not provided"}</p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-sm">
                <p className="text-muted-foreground">
                  By submitting, you agree that the information provided is accurate and you have the right to promote this tool on AITRENDSDATA.
                </p>
              </div>
            </div>
          )}
        </Card>

        <div className="flex gap-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
              data-testid="button-back"
              disabled={submitting}
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1"
            data-testid="button-next"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : step === 4 ? "Submit for Review" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
