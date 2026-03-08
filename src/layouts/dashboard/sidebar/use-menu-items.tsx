import { ROUTE_PATHS } from "@/constants/enum";
import { PaletteIcon, LayoutIcon, UsersIcon, BrickWallShieldIcon, FileSignatureIcon } from "lucide-react";

// ─────────────────────────────────────────────
// SIDEBAR MENU ITEMS
// THIS IS THE ONLY FILE YOU EDIT TO ADD / REMOVE
// / REORDER SIDEBAR NAV ITEMS.
//
// Each item needs:
//   key    → unique string id
//   label  → text shown in sidebar
//   icon   → any lucide-react icon component
//   path   → route path from ROUTE_PATHS (constants/enums.js)
// ─────────────────────────────────────────────

export const menuItems = [
  {
    key: "colors",
    label: "Colors",
    icon: PaletteIcon,
    path: ROUTE_PATHS.COLORS,
  },
  {
    key: "components",
    label: "Components",
    icon: LayoutIcon,
    path: ROUTE_PATHS.COMPONENTS,
  },
  {
    key: "user-management",
    label: "User Management",
    icon: UsersIcon,
    path: ROUTE_PATHS.USER_MANAGEMENT,
  },
  {
    key: "custom-roles",
    label: "Custom Roles",
    icon: BrickWallShieldIcon,
    path: ROUTE_PATHS.CUSTOM_ROLES,
  },
  {
    key: "assessment-builder",
    label: "Assessment Builder",
    icon: FileSignatureIcon,  
    path: ROUTE_PATHS.ASSESSMENT_BUILDER,
  },
];
