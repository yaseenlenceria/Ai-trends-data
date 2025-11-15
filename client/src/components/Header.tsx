import { Link } from "wouter";
import { Moon, Sun, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import logoImage from "@assets/generated_images/AITRENDSDATA_logo_mark_8e712632.png";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <a className="flex items-center gap-3 hover-elevate px-3 py-2 rounded-md -ml-3" data-testid="link-home">
            <img src={logoImage} alt="AITRENDSDATA" className="w-8 h-8" />
            <span className="font-mono font-bold text-xl hidden sm:inline">
              AITRENDSDATA
            </span>
          </a>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <a className="px-4 py-2 text-sm font-medium hover-elevate rounded-md" data-testid="link-nav-home">
              Home
            </a>
          </Link>
          <Link href="/categories">
            <a className="px-4 py-2 text-sm font-medium hover-elevate rounded-md" data-testid="link-nav-categories">
              Categories
            </a>
          </Link>
          <Link href="/search">
            <a className="px-4 py-2 text-sm font-medium hover-elevate rounded-md" data-testid="link-nav-search">
              Search
            </a>
          </Link>
          <Link href="/sponsors">
            <a className="px-4 py-2 text-sm font-medium hover-elevate rounded-md" data-testid="link-nav-sponsors">
              Sponsors
            </a>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          <Link href="/submit">
            <a>
              <Button className="gap-2" data-testid="button-submit-tool">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Submit Tool</span>
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}
