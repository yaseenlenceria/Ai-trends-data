import TrendingGraph from "../TrendingGraph";

export default function TrendingGraphExample() {
  const mockData = [
    { date: "Mon", views: 1200 },
    { date: "Tue", views: 1800 },
    { date: "Wed", views: 2400 },
    { date: "Thu", views: 2100 },
    { date: "Fri", views: 3200 },
    { date: "Sat", views: 4100 },
    { date: "Sun", views: 3800 },
  ];

  return (
    <div className="p-8 max-w-3xl">
      <TrendingGraph data={mockData} />
    </div>
  );
}
