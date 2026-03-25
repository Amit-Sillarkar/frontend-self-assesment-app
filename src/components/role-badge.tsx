import type { PrimaryRole } from "@/constants/enum";
import { PRIMARY_ROLE_LABELS } from "@/constants/enum";

// ─────────────────────────────────────────────
// PRIMARY ROLE BADGE
// ─────────────────────────────────────────────

const ROLE_STYLES: Record<PrimaryRole, string> = {
  SUPER_ADMIN: "bg-primary text-primary-foreground",
  MANAGER:     "bg-secondary text-secondary-foreground",
  SUPERVISOR:  "bg-accent text-accent-foreground border border-border",
  USER:        "bg-muted text-muted-foreground border border-border",
};

interface RoleBadgeProps {
  role: PrimaryRole;
  className?: string;
}

export default function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
        whitespace-nowrap
        ${ROLE_STYLES[role]} ${className}
      `}
    >
      {PRIMARY_ROLE_LABELS[role]}
    </span>
  );
}

// ─────────────────────────────────────────────
// CUSTOM ROLE BADGE
//
// Visually distinct from PrimaryRole badges:
// - Dashed border instead of solid fill
// - Uses ring color (your brand primary) as border
// - Slightly different shape (rounded-md not rounded-full)
// - A small ✦ prefix to signal "extra permissions"
//
// WHY separate component and not just a prop on RoleBadge?
// PrimaryRole badge maps a fixed enum → fixed style dict.
// CustomRole names are arbitrary strings from the API,
// so there's no style dict to look up — they all share
// one consistent "custom" visual treatment.
// ─────────────────────────────────────────────

interface CustomRoleBadgeProps {
  role: string;
  className?: string;
}

export function CustomRoleBadge({ role, className = "" }: CustomRoleBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium
        whitespace-nowrap
        bg-ring/10 text-ring border border-ring/40 border-dashed
        ${className}
      `}
    >
      <span className="text-[10px] leading-none">✦</span>
      {role}
    </span>
  );
}