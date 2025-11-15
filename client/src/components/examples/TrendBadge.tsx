import TrendBadge from "../TrendBadge";

export default function TrendBadgeExample() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex gap-4">
        <TrendBadge percentage={24.5} />
        <TrendBadge percentage={-12.3} />
      </div>
      <div className="flex gap-4">
        <TrendBadge percentage={156.8} size="sm" />
        <TrendBadge percentage={-5.2} size="sm" />
      </div>
    </div>
  );
}
