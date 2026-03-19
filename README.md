# 🎯 Skill Assessment Portal

> **Enterprise Dashboard for Employee Skill Evaluations, Role Permissions & Assessment Workflows**

A **high-performance, feature-rich dashboard** built with modern web technologies. Designed for scalability, maintainability, and seamless user experience.

---

## 📚 Table of Contents

- [🚀 Tech Stack](#-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [⚡ Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🛣️ Routing Guide](#️-routing-guide)
- [✨ Creating New Features](#-creating-new-features)
- [🌿 Git Workflow](#-git-workflow)
- [🧩 Component Development](#-component-development)
- [🎨 Theme & Styling](#-theme--styling)
- [📦 Available Commands](#-available-commands)

---

## 🚀 Tech Stack

| Technology | Purpose |
| -----------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Fast build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **React Router DOM v7** | Client-side routing |
| **Lucide React** | Beautiful icon library |
| **Axios** | HTTP client |
| **DM Sans** | Modern variable font |

---

## 📋 Prerequisites

Before you start, ensure you have installed:

- **Node.js** `>= 18.0.0` ([Download](https://nodejs.org/))
- **npm** `>= 9.0.0` or **yarn** / **pnpm**
- **Git** ([Download](https://git-scm.com/))
- **VS Code** (Recommended) or any code editor

**Verify installation:**
```bash
node --version
npm --version
git --version
```

---

## ⚡ Quick Start

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd frontend-self-assesment-app

# Install dependencies
npm install
```

### 2️⃣ Start Development Server

```bash
npm run dev
```

✅ **Server runs at:** `http://localhost:5173`

### 3️⃣ Build for Production

```bash
npm run build
```

📦 **Output:** Optimized build in `dist/` folder

---

## 📁 Project Structure

```
src/
│
├── 📂 assets/                  # Images, logos, static files
│
├── 📂 components/              # Reusable UI components
│   ├── 📂 ui/                  # Atomic components (Button, Input, Badge, etc.)
│   ├── 📂 common/              # Shared business components (Modals, Cards)
│   ├── data-table.tsx          # Advanced reusable data table
│   ├── page-header.tsx         # Page titles & breadcrumbs
│   ├── search-filter-bar.tsx   # Global search & filters
│   ├── table-pagination.tsx    # Pagination controls
│   ├── toast-notification.tsx  # Toast notifications
│   └── role-badge.tsx          # Role display badge
│
├── 📂 constants/               # Enums & configuration
│   ├── enum.tsx                # Route paths & user roles
│   ├── messages.tsx            # Error/success messages
│   └── index.tsx               # Exported constants
│
├── 📂 context/                 # Global state management
│   └── AuthContext.tsx         # Authentication state
│
├── 📂 layouts/                 # Page wrapper layouts
│   └── 📂 dashboard/
│       ├── index.tsx           # Main dashboard layout
│       ├── 📂 header/          # Top navigation bar
│       └── 📂 sidebar/         # Sidebar navigation
│
├── 📂 lib/                     # Utility functions
│   ├── api.ts                  # API/HTTP calls
│   └── utils.ts                # Helper functions
│
├── 📂 mockdata/                # Sample data for UI testing
│   ├── users.tsx
│   ├── assessments.tsx
│   └── ...
│
├── 📂 pages/                   # Feature pages
│   ├── dashboard.tsx           # Dashboard home
│   ├── login.tsx               # Login page
│   ├── register.tsx            # Registration page
│   ├── 📂 usermanagement/      # User CRUD
│   ├── 📂 rolemangement/       # Role & permissions
│   ├── 📂 assessment-builder/  # Assessment creation
│   ├── 📂 assement/            # Assessment taking
│   ├── 📂 assessment-tracking/ # Assessment progress
│   ├── 📂 pending-assessment/  # Pending assessments
│   ├── 📂 supervisor-approoval/# Review & approval
│   └── 📂 truein-sync/         # Sync server
│
├── 📂 routes/                  # Route configuration
│   ├── index.tsx               # Main router
│   ├── private.route.tsx       # Protected routes
│   └── public.route.tsx        # Public routes
│
├── 📂 types/                   # TypeScript interfaces
│   └── table.tsx               # Table-related types
│
├── App.tsx                     # Root component
├── index.css                   # Global styles & theme
└── main.tsx                    # Application entry point
```

---

## 🛣️ Routing Guide

### 📍 Current Routes

All routes are defined in `src/constants/enum.tsx`:

```typescript
{
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  COLORS: "/dashboard/colors",
  COMPONENTS: "/dashboard/components",
  USER_MANAGEMENT: "/dashboard/user-management",
  CUSTOM_ROLES: "/dashboard/custom-roles",
  ASSESSMENT_BUILDER: "/dashboard/assessment-builder",
  PENDING_ASSESSMENTS: "/dashboard/pending-assessments",
  ASSESSMENT: "/dashboard/pending-assessments/assessment/:id",
  ASSESSMENT_TRACKING: "/dashboard/assessment-tracking",
  SUPERVISOR_APPROVAL: "/dashboard/supervisor-approval",
  SUPERVISOR_REVIEW: "/dashboard/supervisor-approval/review/:id",
  TRUEIN_SYNC: "/dashboard/truein-sync",
}
```

### 🔐 Route Protection

- **Public Routes**: Login, Register (auto-redirect if logged in)
- **Private Routes**: Protected by authentication check, auto-redirect to login if not authenticated
- All private routes are wrapped in `DashboardLayout` automatically

---

## ✨ Creating New Features

### Step-by-Step Guide to Add a New Page

Let's say you want to add a **"Reports"** feature:

#### **Step 1️⃣: Create Page Component**

Create `src/pages/reports/index.tsx`:

```typescript
import { PageHeader } from "@/components/page-header";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader 
        title="Reports" 
        description="View and analyze assessment reports"
      />
      
      {/* Your page content */}
      <div className="space-y-4">
        {/* Add your components here */}
      </div>
    </div>
  );
}
```

#### **Step 2️⃣: Add Route Path**

Edit `src/constants/enum.tsx`:

```typescript
export const ROUTE_PATHS = {
  // ... existing routes
  REPORTS: "/dashboard/reports",
};
```

#### **Step 3️⃣: Create Route**

Edit `src/routes/private.route.tsx`:

```typescript
import ReportsPage from "@/pages/reports";

export const privateRoutes = (
  <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardLayout />}>
    {/* ... existing routes */}
    <Route path={ROUTE_PATHS.REPORTS} element={<ReportsPage />} />
  </Route>
);
```

#### **Step 4️⃣: Add Sidebar Menu Item**

Edit `src/layouts/dashboard/sidebar/use-menu-items.tsx`:

```typescript
import { BarChart3Icon } from "lucide-react";

export const menuItems = [
  // ... existing items
  {
    key: "reports",
    label: "Reports",
    icon: BarChart3Icon,
    path: ROUTE_PATHS.REPORTS,
  },
];
```

#### ✅ Done!

Your page is now:
- ✓ Accessible at `/dashboard/reports`
- ✓ Visible in the sidebar menu
- ✓ Protected by authentication
- ✓ Integrated with the dashboard layout

---

## 🌿 Git Workflow

### 📋 Branch Naming Convention

```
feature/<feature-name>      # New features
bugfix/<bug-name>           # Bug fixes
hotfix/<issue-name>         # Critical fixes
docs/<description>          # Documentation updates
```

### 📝 Workflow Steps

#### **For Creating New Features:**

```bash
# 1. Pull latest main branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes & commit
git add .
git commit -m "feat: add new feature description"

# 4. Push to remote
git push origin feature/your-feature-name

# 5. Create Pull Request (PR) on GitHub
#    - Go to repository → Pull Requests
#    - Click "New Pull Request"
#    - Set base: main, compare: feature/your-feature-name
#    - Add description & request review

# 6. Once approved, merge to main
#    - Use "Squash and merge" for clean history
#    - Delete remote branch after merge

# 7. Update local main
git checkout main
git pull origin main
```

### 🎯 Commit Message Convention

```
feat: add new user filtering feature
fix: resolve table sorting bug
docs: update routing documentation
style: format component code
refactor: simplify authentication logic
test: add unit tests for DataTable
```

### ✅ PR Checklist

- [ ] Branch created from `main`
- [ ] Code follows project style guide
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings fixed (`npm run lint`)
- [ ] Component props documented
- [ ] PR description explains changes
- [ ] Ready for review

---

## 🧩 Component Development

### 📦 Using Existing UI Components

Always check `src/components/ui/` before creating new components. Available components:

- `Button` - Interactive button
- `Input` - Text input field
- `Label` - Form label
- `Badge` - Styled badge
- `Card` - Container card
- `Dialog` - Modal dialog
- `Select` - Dropdown select
- `Textarea` - Multi-line input
- `AlertDialog` - Confirmation dialog

### ✨ Creating New Components

```typescript
// src/components/ui/my-component.tsx

import { FC } from "react";

interface MyComponentProps {
  title: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export const MyComponent: FC<MyComponentProps> = ({
  title,
  variant = "primary",
  disabled = false,
}) => {
  return (
    <div className={`
      px-4 py-2 rounded-lg font-medium
      ${variant === "primary" ? "bg-primary text-white" : "bg-secondary"}
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    `}>
      {title}
    </div>
  );
};
```

### 🎯 Component Best Practices

✅ **Do:**
- Use Tailwind CSS classes consistently
- Type all props with TypeScript interfaces
- Keep components focused and reusable
- Use theme variables from `index.css`
- Document complex prop combinations
- Keep component files under 300 lines

❌ **Don't:**
- Mix inline styles with Tailwind
- Import from components outside `src/`
- Create unnamed/anonymous components
- Use hardcoded colors instead of theme variables
- Mix business logic with UI components

### 🎨 Using DataTable Component

The `DataTable` is highly reusable for displaying tabular data:

```typescript
import { DataTable } from "@/components/data-table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const data: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
  // ...
];

const columns = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
];

export function UsersTable() {
  return (
    <DataTable
      data={data}
      columns={columns}
      actions={[
        { label: "Edit", onClick: (row) => handleEdit(row) },
        { label: "Delete", onClick: (row) => handleDelete(row) },
      ]}
    />
  );
}
```

---

## 🎨 Theme & Styling

### 🎭 Color System

Edit `src/index.css` to customize theme:

```css
:root {
  --primary: #E05A1A;        /* Brand primary color */
  --secondary: #6B7280;      /* Secondary color */
  --success: #10B981;        /* Success state */
  --danger: #EF4444;         /* Error/danger state */
  --warning: #F59E0B;        /* Warning state */
  --neutral: #F3F4F6;        /* Background */
  --foreground: #111827;     /* Text color */
  --border: #E5E7EB;         /* Border color */
}

.dark {
  --foreground: #F9FAFB;
  --neutral: #1F2937;
  /* ... other dark mode colors */
}
```

### 🔤 Font

- **Family**: DM Sans (variable weight)
- **Weights**: 400, 500, 600, 700
- **Usage**: Applied globally via `index.css`

### 🌓 Dark Mode

Dark mode is supported via `.dark` class on root element:

```typescript
// Automatically applied based on system preference
// or user selection in settings
<html className="dark">
  {/* Application */}
</html>
```

---

## 📦 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Build for production (creates `dist/` folder) |
| `npm run lint` | Check code for style issues |
| `npm run preview` | Preview production build locally |

### 🐛 Development Tips

```bash
# Hot Module Replacement (HMR)
# Changes auto-refresh without page reload
npm run dev

# Debug TypeScript errors
npm run build

# Format & fix linting issues
npm run lint
```

---

## 🚀 Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npm run preview
```

### Deploy to Server

Follow your hosting provider's deployment guide:
- **Vercel**: Connect GitHub repo (auto-deploys)
- **Netlify**: Similar to Vercel
- **Traditional Server**: Upload `dist/` folder contents

---

## 🤝 Contributing Guidelines

1. **Always create feature branch** from `main`
2. **Follow commit message convention** (feat:, fix:, docs:, etc.)
3. **Keep commits atomic** (one feature per commit)
4. **Write descriptive PR description**
5. **Delete branch** after merge
6. **Pull latest main** before starting new feature

---

## 📚 File Reference Guide

### Key Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.js` | Tailwind CSS customization |
| `eslint.config.js` | Code style rules |
| `package.json` | Dependencies & scripts |

### Important Source Files

| File | Purpose |
|------|---------|
| `src/constants/enum.tsx` | **Route paths & enums** (EDIT FOR ROUTES) |
| `src/layouts/dashboard/sidebar/use-menu-items.tsx` | **Sidebar menu** (EDIT FOR NAVIGATION) |
| `src/routes/private.route.tsx` | **Protected routes** (EDIT FOR NEW PAGES) |
| `src/index.css` | **Theme & global styles** (EDIT FOR COLORS) |
| `src/App.tsx` | Application root |

---

## 🆘 Troubleshooting

### Port 5173 Already in Use

```bash
# Kill process using port 5173
# macOS/Linux:
lsof -ti:5173 | xargs kill -9

# Windows (PowerShell):
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Node Modules Issue

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Check all TypeScript errors
npm run build
```

### ESLint Issues

```bash
# View linting errors
npm run lint
```

---

## 📖 Resources & Documentation

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router v7](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 👥 Team Communication

- **Code Review**: All PRs require at least 1 approval before merge
- **Questions**: Ask in team Slack/channel before starting major changes
- **Documentation**: Update README when adding new patterns/components
- **Version Control**: Always use feature branches, never commit to `main`

---

## 📝 Further Notes

- This project uses **TypeScript** — leverage types for better IDE support
- Install **ESLint** VS Code extension for real-time error checking
- The project includes **Tailwind CSS** — use utility classes over custom CSS
- **Hot Module Replacement (HMR)** is enabled — changes reflect instantly
- API calls use **Axios** — see `src/lib/api.ts` for HTTP utilities

---

## 📄 License

[Add your license information here]

---

**Happy Coding! 🚀**

For questions or issues, please contact the development team or open an issue on the repository.