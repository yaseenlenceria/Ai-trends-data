import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

export default function Submit() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      console.log(`Moving to step ${step + 1}`);
    } else {
      setSubmitted(true);
      console.log("Form submitted");
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
          <Button onClick={() => { setSubmitted(false); setStep(1); }} data-testid="button-submit-another">
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
                <Input id="tool-name" placeholder="e.g., ChatGPT" data-testid="input-tool-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline *</Label>
                <Input 
                  id="tagline" 
                  placeholder="Short description in one sentence"
                  data-testid="input-tagline"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website URL *</Label>
                <Input 
                  id="website" 
                  type="url" 
                  placeholder="https://example.com"
                  data-testid="input-website"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-assistant">AI Assistant</SelectItem>
                    <SelectItem value="image-generation">Image Generation</SelectItem>
                    <SelectItem value="video-generation">Video Generation</SelectItem>
                    <SelectItem value="code-assistant">Code Assistant</SelectItem>
                    <SelectItem value="audio-voice">Audio & Voice</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="data-analysis">Data Analysis</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-mono font-bold text-2xl mb-6">Media</h2>
              <div className="space-y-2">
                <Label>Logo *</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate cursor-pointer">
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 2MB (Square recommended)
                  </p>
                  <Input type="file" className="hidden" data-testid="input-logo" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Screenshots (up to 5)</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate cursor-pointer">
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 5MB each (16:9 ratio recommended)
                  </p>
                  <Input type="file" multiple className="hidden" data-testid="input-screenshots" />
                </div>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricing">Pricing Model</Label>
                <Select>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL (Optional)</Label>
                <Input 
                  id="github" 
                  type="url" 
                  placeholder="https://github.com/..."
                  data-testid="input-github"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-mono font-bold text-2xl mb-6">Review & Publish</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-mono font-bold mb-1">Tool Name</h3>
                  <p className="text-muted-foreground">ChatGPT (Example)</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-mono font-bold mb-1">Category</h3>
                  <p className="text-muted-foreground">AI Assistant</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-mono font-bold mb-1">Tagline</h3>
                  <p className="text-muted-foreground">Conversational AI that understands context</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-mono font-bold mb-1">Website</h3>
                  <p className="text-muted-foreground">https://chat.openai.com</p>
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
            <Button variant="outline" onClick={handleBack} className="flex-1" data-testid="button-back">
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1" data-testid="button-next">
            {step === 4 ? "Submit for Review" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
