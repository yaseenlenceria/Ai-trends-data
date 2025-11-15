import MobileNav from "../MobileNav";

export default function MobileNavExample() {
  return (
    <div className="relative h-screen">
      <div className="p-8">
        <p className="text-muted-foreground">Mobile navigation shown at the bottom</p>
      </div>
      <MobileNav />
    </div>
  );
}
