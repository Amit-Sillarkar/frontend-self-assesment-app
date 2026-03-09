// ─────────────────────────────────────────────
// COLORS PAGE
// Displays all theme colors as swatches with class names
// ─────────────────────────────────────────────

const colorTokens = [
  // Brand
  { label: "Primary", bgClass: "bg-primary", textClass: "text-primary-foreground", token: "--primary" },
  { label: "Primary Foreground", bgClass: "bg-primary-foreground", textClass: "text-foreground", token: "--primary-foreground", border: true },

  // UI
  { label: "Background", bgClass: "bg-background", textClass: "text-foreground", token: "--background", border: true },
  { label: "Foreground", bgClass: "bg-foreground", textClass: "text-background", token: "--foreground" },
  { label: "Card", bgClass: "bg-card", textClass: "text-card-foreground", token: "--card", border: true },
  { label: "Card Foreground", bgClass: "bg-card-foreground", textClass: "text-card", token: "--card-foreground" },

  // Secondary
  { label: "Secondary", bgClass: "bg-secondary", textClass: "text-secondary-foreground", token: "--secondary" },
  { label: "Secondary Foreground", bgClass: "bg-secondary-foreground", textClass: "text-secondary", token: "--secondary-foreground" },

  // Muted
  { label: "Muted", bgClass: "bg-muted", textClass: "text-muted-foreground", token: "--muted" },
  { label: "Muted Foreground", bgClass: "bg-muted-foreground", textClass: "text-muted", token: "--muted-foreground" },

  // Accent
  { label: "Accent", bgClass: "bg-accent", textClass: "text-accent-foreground", token: "--accent" },
  { label: "Accent Foreground", bgClass: "bg-accent-foreground", textClass: "text-accent", token: "--accent-foreground" },

  // State
  { label: "Destructive", bgClass: "bg-destructive", textClass: "text-white", token: "--destructive" },
  { label: "Border", bgClass: "bg-border", textClass: "text-foreground", token: "--border", border: true },
  { label: "Input", bgClass: "bg-input", textClass: "text-foreground", token: "--input", border: true },
  { label: "Ring", bgClass: "bg-ring", textClass: "text-white", token: "--ring" },

  // Charts
  { label: "Chart 1", bgClass: "bg-chart-1", textClass: "text-white", token: "--chart-1" },
  { label: "Chart 2", bgClass: "bg-chart-2", textClass: "text-white", token: "--chart-2" },
  { label: "Chart 3", bgClass: "bg-chart-3", textClass: "text-white", token: "--chart-3" },
  { label: "Chart 4", bgClass: "bg-chart-4", textClass: "text-foreground", token: "--chart-4" },
  { label: "Chart 5", bgClass: "bg-chart-5", textClass: "text-white", token: "--chart-5" },

  // Sidebar
  { label: "Sidebar", bgClass: "bg-sidebar", textClass: "text-sidebar-foreground", token: "--sidebar", border: true },
  { label: "Sidebar Primary", bgClass: "bg-sidebar-primary", textClass: "text-sidebar-primary-foreground", token: "--sidebar-primary" },
  { label: "Sidebar Accent", bgClass: "bg-sidebar-accent", textClass: "text-sidebar-accent-foreground", token: "--sidebar-accent" },
  { label: "Sidebar Border", bgClass: "bg-sidebar-border", textClass: "text-sidebar-foreground", token: "--sidebar-border", border: true },
];

export default function ColorsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl   font-bold text-foreground">Color Palette</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          All theme color tokens defined in <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">index.css</code>. Use these Tailwind classes across the project.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {colorTokens.map((color) => (
          <div key={color.token} className="flex flex-col gap-2">
            {/* Color Swatch */}
            <div
              className={`
                w-full aspect-square rounded-lg flex flex-col items-center justify-center
                ${color.bgClass}
                ${color.border ? "border border-border" : ""}
              `}
            >
              <span className={`text-xs font-mono font-semibold ${color.textClass} text-center px-1 break-all`}>
                {color.bgClass}
              </span>
            </div>
            {/* Label */}
            <div>
              <p className="text-xs font-medium text-foreground leading-tight">{color.label}</p>
              <p className="text-xs text-muted-foreground font-mono">{color.token}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}