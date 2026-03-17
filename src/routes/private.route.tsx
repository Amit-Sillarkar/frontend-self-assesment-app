import { Route } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard";
import ColorsPage from "@/pages/colors";
import DashboardPage from "@/pages/dashboard";
import { ROUTE_PATHS } from "@/constants/enum";
import ComponentsPage from "@/pages/custom-component";
import UserManagementPage from "@/pages/usermanagement";
import CustomRolesPage from "@/pages/rolemangement";
import AssessmentBuilderPage from "@/pages/assessment-builder";
import AssessmentPage from "@/pages/assement";
import PendingAssessmentsPage from "@/pages/pending-assessment";
import AssessmentTrackingPage from "@/pages/assessment-tracking";
import SupervisorApprovalListPage from "@/pages/supervisor-approoval";
import SupervisorReviewPage from "@/pages/supervisor-approoval/review";
import TrueinSyncPage from "@/pages/truein-sync";

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
    {/* Assessment Routes */}
    <Route path={ROUTE_PATHS.PENDING_ASSESSMENTS} element={<PendingAssessmentsPage />} />
    <Route path={ROUTE_PATHS.ASSESSMENT} element={<AssessmentPage />} />
    <Route path={ROUTE_PATHS.ASSESSMENT_TRACKING} element={<AssessmentTrackingPage />} />
    <Route path={ROUTE_PATHS.SUPERVISOR_APPROVAL} element={<SupervisorApprovalListPage />} />
    <Route path={ROUTE_PATHS.SUPERVISOR_REVIEW} element={<SupervisorReviewPage />} />
    <Route path={ROUTE_PATHS.TRUEIN_SYNC} element={<TrueinSyncPage />} />
  </Route>
);