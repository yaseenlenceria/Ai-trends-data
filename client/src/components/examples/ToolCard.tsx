import ToolCard from "../ToolCard";

export default function ToolCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 max-w-7xl">
      <ToolCard
        id="chatgpt"
        name="ChatGPT"
        tagline="Conversational AI that understands and generates human-like text"
        logo="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop"
        category="AI Assistant"
        upvotes={1247}
        views={45632}
        trendPercentage={24.5}
        isNew={false}
      />
      <ToolCard
        id="midjourney"
        name="Midjourney"
        tagline="AI art generator creating stunning images from text descriptions"
        logo="https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=128&h=128&fit=crop"
        category="Image Generation"
        upvotes={892}
        views={32145}
        trendPercentage={156.8}
        isNew={true}
      />
      <ToolCard
        id="runway"
        name="Runway ML"
        tagline="Creative tools powered by machine learning for video editing"
        logo="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=128&h=128&fit=crop"
        category="Video Generation"
        upvotes={634}
        views={18423}
        trendPercentage={-5.2}
        isNew={false}
      />
    </div>
  );
}
