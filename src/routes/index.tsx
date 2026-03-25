import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes } from "./public.route";
import { privateRoutes } from "./private.route";
import { ROUTE_PATHS } from "@/constants/enum";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTE_PATHS.LOGIN} replace />} />
      {publicRoutes}
      {privateRoutes}
      <Route path="*" element={<Navigate to={"*"} replace />} />
    </Routes>
  );
}