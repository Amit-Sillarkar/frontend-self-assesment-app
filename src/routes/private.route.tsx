import { Route } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard";
import ColorsPage from "@/pages/colors";
import DashboardPage from "@/pages/dashboard";
import { ROUTE_PATHS } from "@/constants/enum";
import ComponentsPage from "@/pages/custom-component";
import UserManagementPage from "@/pages/usermanagement";
import CustomRolesPage from "@/pages/rolemangement";
import AssessmentBuilderPage from "@/pages/assessment-builder";

// ─────────────────────────────────────────────
// PRIVATE ROUTES
// All rendered inside DashboardLayout
// ─────────────────────────────────────────────

export const privateRoutes = (
  <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardLayout />}>
    <Route index element={<DashboardPage />} />
    <Route path={ROUTE_PATHS.COLORS} element={<ColorsPage />} />
    <Route path={ROUTE_PATHS.COMPONENTS} element={<ComponentsPage />} />
    <Route path={ROUTE_PATHS.USER_MANAGEMENT} element={<UserManagementPage />} />
    <Route path={ROUTE_PATHS.CUSTOM_ROLES}    element={<CustomRolesPage />} />
    <Route path={ROUTE_PATHS.ASSESSMENT_BUILDER} element={<AssessmentBuilderPage />} />
  </Route>
);