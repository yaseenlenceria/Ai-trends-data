import SponsorCard from "../SponsorCard";

export default function SponsorCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 max-w-7xl">
      <SponsorCard
        id="openai"
        name="OpenAI"
        logo="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=128&h=128&fit=crop"
        description="Building safe and beneficial artificial intelligence"
        url="https://openai.com"
        tier="premium"
      />
      <SponsorCard
        id="anthropic"
        name="Anthropic"
        logo="https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=128&h=128&fit=crop"
        description="AI safety and research company focused on building reliable AI systems"
        url="https://anthropic.com"
        tier="standard"
      />
      <SponsorCard
        id="huggingface"
        name="Hugging Face"
        logo="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=128&h=128&fit=crop"
        description="The AI community building the future of machine learning"
        url="https://huggingface.co"
        tier="standard"
      />
    </div>
  );
}
