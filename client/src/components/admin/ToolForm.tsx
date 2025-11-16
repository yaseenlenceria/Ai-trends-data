import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/context/DataContext";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface ToolFormProps {
  tool?: any;
  onClose: () => void;
}

export default function ToolForm({ tool, onClose }: ToolFormProps) {
  const { categories } = useData();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screenshots, setScreenshots] = useState<string[]>(tool?.screenshots || []);
  const [screenshotInput, setScreenshotInput] = useState("");

  const [formData, setFormData] = useState({
    name: tool?.name || "",
    tagline: tool?.tagline || "",
    description: tool?.description || "",
    logo: tool?.logo || "",
    categoryId: tool?.categoryId || "",
    website: tool?.website || "",
    twitter: tool?.twitter || "",
    github: tool?.github || "",
    pricingModel: tool?.pricing?.model || "",
    status: tool?.status || "approved",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addScreenshot = () => {
    if (screenshotInput.trim()) {
      setScreenshots([...screenshots, screenshotInput.trim()]);
      setScreenshotInput("");
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description || null,
        logo: formData.logo || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop",
        categoryId: formData.categoryId,
        website: formData.website || null,
        twitter: formData.twitter || null,
        github: formData.github || null,
        screenshots: screenshots.length > 0 ? screenshots : null,
        pricing: formData.pricingModel ? {
          model: formData.pricingModel,
          plans: [],
        } : null,
        status: formData.status,
      };

      const url = tool ? `/api/admin/tools/${tool.id}` : "/api/admin/tools";
      const method = tool ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save tool");
      }

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tools"] });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save tool");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          {tool ? "Edit Tool" : "Add New Tool"}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Tool Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g., ChatGPT"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category *</Label>
            <Select value={formData.categoryId} onValueChange={(value) => updateField("categoryId", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline *</Label>
          <Input
            id="tagline"
            value={formData.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            placeholder="Short description of the tool"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Detailed description of the tool"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL *</Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={(e) => updateField("logo", e.target.value)}
              placeholder="https://example.com/logo.png"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={formData.twitter}
              onChange={(e) => updateField("twitter", e.target.value)}
              placeholder="https://twitter.com/username"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={formData.github}
              onChange={(e) => updateField("github", e.target.value)}
              placeholder="https://github.com/username/repo"
              type="url"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="pricingModel">Pricing Model</Label>
            <Select value={formData.pricingModel} onValueChange={(value) => updateField("pricingModel", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select pricing model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="freemium">Freemium</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="one-time">One-time Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Screenshots</Label>
          <div className="flex gap-2">
            <Input
              value={screenshotInput}
              onChange={(e) => setScreenshotInput(e.target.value)}
              placeholder="https://example.com/screenshot.png"
              type="url"
            />
            <Button type="button" onClick={addScreenshot} variant="outline" size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {screenshots.length > 0 && (
            <div className="space-y-2 mt-2">
              {screenshots.map((screenshot, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="flex-1 text-sm truncate">{screenshot}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeScreenshot(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>{tool ? "Update" : "Create"} Tool</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
