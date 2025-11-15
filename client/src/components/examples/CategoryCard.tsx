import CategoryCard from "../CategoryCard";
import { MessageSquare, Image, Video, Code, Mic, FileText, Database, Zap } from "lucide-react";

export default function CategoryCardExample() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 max-w-7xl">
      <CategoryCard
        id="chat"
        name="AI Assistant"
        icon={MessageSquare}
        toolCount={124}
        gradient="bg-gradient-to-br from-card to-card"
      />
      <CategoryCard
        id="image"
        name="Image Generation"
        icon={Image}
        toolCount={89}
        gradient="bg-gradient-to-br from-card to-card"
      />
      <CategoryCard
        id="video"
        name="Video Generation"
        icon={Video}
        toolCount={45}
        gradient="bg-gradient-to-br from-card to-card"
      />
      <CategoryCard
        id="code"
        name="Code Assistant"
        icon={Code}
        toolCount={67}
        gradient="bg-gradient-to-br from-card to-card"
      />
      <CategoryCard
        id="audio"
        name="Audio & Voice"
        icon={Mic}
        toolCount={53}
        gradient="bg-gradient-to-br from-card to-card"
      />
      <CategoryCard
        id="writing"
        name="Writing"
        icon={FileText}
        toolCount={98}
        gradient="bg-gradient-to-br from-card to-card"
      />
      <CategoryCard
        id="data"
        name="Data Analysis"
        icon={Database}
        toolCount={34}
        gradient="bg-gradient-to-br from-card to-card"
      />
      <CategoryCard
        id="automation"
        name="Automation"
        icon={Zap}
        toolCount={76}
        gradient="bg-gradient-to-br from-card to-card"
      />
    </div>
  );
}
