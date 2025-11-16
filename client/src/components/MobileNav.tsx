import { Link, useLocation } from "wouter";
import { Home, Search, Plus, BarChart3, GitCompare } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/submit", icon: Plus, label: "Submit", isPrimary: true },
    { href: "/compare", icon: GitCompare, label: "Compare" },
    { href: "/search", icon: Search, label: "Search" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, icon: Icon, label, isPrimary }) => {
          const isActive = location === href;
          
          if (isPrimary) {
            return (
              <Link 
                key={href} 
                href={href}
                className="flex flex-col items-center gap-1 relative"
                data-testid={`link-mobile-${label.toLowerCase()}`}
              >
                <div className="w-12 h-12 -mt-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          }

          return (
            <Link 
              key={href} 
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`link-mobile-${label.toLowerCase()}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
