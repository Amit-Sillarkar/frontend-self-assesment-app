import { BellIcon, UserIcon,MenuIcon } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
}

// ─────────────────────────────────────────────
// HEADER
//
// Mobile-first layout:
//  [☰ hamburger]  [Page Title]  ··· [🔔][👤]
//
// The hamburger is always visible (mobile + desktop).
// On desktop it can be used to collapse the sidebar.
// ─────────────────────────────────────────────

export default function Header({ title, subtitle, onMenuToggle }: HeaderProps) {
  return (
    <header className="h-14 md:h-16 flex items-center justify-between px-3 md:px-6 bg-background border-b border-border flex-shrink-0 gap-3">

      {/* ── Left: Hamburger + Title ── */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Page title — truncates on very small screens */}
        <div className="min-w-0">
          <h1 className="text-base md:text-xl   font-bold text-foreground leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-xs md:text-sm text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── Right: Action icons ── */}
      <div className="flex items-center gap-1 shrink-0">

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <BellIcon className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        {/* User avatar */}
        <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity ml-0.5">
          <UserIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}