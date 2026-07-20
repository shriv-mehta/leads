import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import { ROLES } from "./utils/constants";

import LoginPage from "./pages/LoginPage";
import HomeRedirect from "./pages/HomeRedirect";

import MyLeadsPage from "./pages/employee/MyLeadsPage";
import AddLeadPage from "./pages/employee/AddLeadPage";
import MapPage from "./pages/employee/MapPage";
import LeadDetailPage from "./pages/leads/LeadDetailPage";

import DashboardPage from "./pages/admin/DashboardPage";
import AllLeadsPage from "./pages/admin/AllLeadsPage";
import TeamMapPage from "./pages/admin/TeamMapPage";
import AreaPerformancePage from "./pages/admin/AreaPerformancePage";
import EmployeePerformancePage from "./pages/admin/EmployeePerformancePage";
import UsersPage from "./pages/admin/UsersPage";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/leads/:id" element={<LeadDetailPage />} />

              <Route element={<ProtectedRoute roles={[ROLES.EMPLOYEE]} />}>
                <Route path="/leads" element={<MyLeadsPage />} />
                <Route path="/leads/new" element={<AddLeadPage />} />
                <Route path="/map" element={<MapPage />} />
              </Route>

              <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
                <Route path="/admin/dashboard" element={<DashboardPage />} />
                <Route path="/admin/leads" element={<AllLeadsPage />} />
                <Route path="/admin/map" element={<TeamMapPage />} />
                <Route path="/admin/areas" element={<AreaPerformancePage />} />
                <Route path="/admin/employees" element={<EmployeePerformancePage />} />
                <Route path="/admin/users" element={<UsersPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
