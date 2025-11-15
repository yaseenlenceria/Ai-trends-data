import ScreenshotCarousel from "../ScreenshotCarousel";

export default function ScreenshotCarouselExample() {
  const screenshots = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop",
    "https://images.unsplash.com/photo-1686191128892-c21c4a86a8c6?w=1200&h=675&fit=crop",
    "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=675&fit=crop",
  ];

  return (
    <div className="p-8 max-w-4xl">
      <ScreenshotCarousel images={screenshots} />
    </div>
  );
}
