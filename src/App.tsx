import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import AuthPage from "./pages/AuthPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import DashboardPage from "@/modules/idf/pages/DashboardPage";
import MapPage from "@/modules/idf/pages/dashboard/MapPage";
import OperatorsListPage from "@/modules/idf/pages/operators/OperatorsListPage";
import OperatorWizardPage from "@/modules/idf/pages/operators/OperatorWizardPage";
import OperatorDetailPage from "@/modules/idf/pages/operators/OperatorDetailPage";
import ForestAreasPage from "@/modules/idf/pages/areas/ForestAreasPage";
import ConcessionsPage from "@/modules/idf/pages/concessions/ConcessionsPage";
import ConcessionDetailPage from "@/modules/idf/pages/concessions/ConcessionDetailPage";
import ConcessionTramitationPage from "@/modules/idf/pages/concessions/ConcessionTramitationPage";
import InventoriesPage from "@/modules/idf/pages/inventories/InventoriesPage";
import InventoryDetailPage from "@/modules/idf/pages/inventories/InventoryDetailPage";
import ManagementPlansPage from "@/modules/idf/pages/plans/ManagementPlansPage";
import ManagementPlanDetailPage from "@/modules/idf/pages/plans/ManagementPlanDetailPage";
import QuotasPage from "@/modules/idf/pages/quotas/QuotasPage";
import QuotaDetailPage from "@/modules/idf/pages/quotas/QuotaDetailPage";
import LicensesPage from "@/modules/idf/pages/licenses/LicensesPage";
import LicenseWizardPage from "@/modules/idf/pages/licenses/LicenseWizardPage";
import LicenseDetailPage from "@/modules/idf/pages/licenses/LicenseDetailPage";
import LicensingPage from "@/modules/idf/pages/licensing/LicensingPage";
import ExploitationPage from "@/modules/idf/pages/exploitation/ExploitationPage";
import ExploitationDetailPage from "@/modules/idf/pages/exploitation/ExploitationDetailPage";
import ProductionPage from "@/modules/idf/pages/production/ProductionPage";
import LotDetailPage from "@/modules/idf/pages/production/LotDetailPage";
import LogDetailPage from "@/modules/idf/pages/production/LogDetailPage";
import TraceabilityPage from "@/modules/idf/pages/traceability/TraceabilityPage";
import TransitGuidesPage from "@/modules/idf/pages/transitGuides/TransitGuidesPage";
import TransitGuideDetailPage from "@/modules/idf/pages/transitGuides/TransitGuideDetailPage";
import WarehousesPage from "@/modules/idf/pages/warehouses/WarehousesPage";
import WarehouseDetailPage from "@/modules/idf/pages/warehouses/WarehouseDetailPage";
import CertificatesPage from "@/modules/idf/pages/certificates/CertificatesPage";
import CertificateDetailPage from "@/modules/idf/pages/certificates/CertificateDetailPage";
import InspectionsPage from "@/modules/idf/pages/inspections/InspectionsPage";
import InspectionDetailPage from "@/modules/idf/pages/inspections/InspectionDetailPage";
import ExportsPage from "@/modules/idf/pages/exports/ExportsPage";
import ExportDetailPage from "@/modules/idf/pages/exports/ExportDetailPage";
import AdminPage from "@/modules/idf/pages/admin/AdminPage";
import EnforcementPage from "@/modules/idf/pages/enforcement/EnforcementPage";
import EnforcementDetailPage from "@/modules/idf/pages/enforcement/EnforcementDetailPage";
import RevenuePage from "@/modules/idf/pages/revenue/RevenuePage";
import RevenueDetailPage from "@/modules/idf/pages/revenue/RevenueDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/idf/dashboard" replace />} />
              <Route path="/idf/dashboard" element={<DashboardPage />} />
              <Route path="/idf/map" element={<MapPage />} />
              <Route path="/idf/operators" element={<OperatorsListPage />} />
              <Route path="/idf/operators/new" element={<OperatorWizardPage />} />
              <Route path="/idf/operators/:id" element={<OperatorDetailPage />} />
              <Route path="/idf/areas" element={<ForestAreasPage />} />
              <Route path="/idf/concessions" element={<ConcessionsPage />} />
              <Route path="/idf/concessions/:id" element={<ConcessionDetailPage />} />
              <Route path="/idf/concessions/:id/tramitacao" element={<ConcessionTramitationPage />} />
              <Route path="/idf/inventories" element={<InventoriesPage />} />
              <Route path="/idf/inventories/:id" element={<InventoryDetailPage />} />
              <Route path="/idf/management-plans" element={<ManagementPlansPage />} />
              <Route path="/idf/management-plans/:id" element={<ManagementPlanDetailPage />} />
              <Route path="/idf/quotas" element={<QuotasPage />} />
              <Route path="/idf/quotas/:id" element={<QuotaDetailPage />} />
              <Route path="/idf/licenses" element={<LicensesPage />} />
              <Route path="/idf/licenses/new" element={<LicenseWizardPage />} />
              <Route path="/idf/licenses/:id" element={<LicenseDetailPage />} />
              <Route path="/idf/licensing" element={<LicensingPage />} />
              <Route path="/idf/exploitation" element={<ExploitationPage />} />
              <Route path="/idf/exploitation/:id" element={<ExploitationDetailPage />} />
              <Route path="/idf/production" element={<ProductionPage />} />
              <Route path="/idf/production/lots/:id" element={<LotDetailPage />} />
              <Route path="/idf/production/logs/:id" element={<LogDetailPage />} />
              <Route path="/idf/traceability" element={<TraceabilityPage />} />
              <Route path="/idf/traceability/:entityType/:id" element={<TraceabilityPage />} />
              <Route path="/idf/transit-guides" element={<TransitGuidesPage />} />
              <Route path="/idf/transit-guides/:id" element={<TransitGuideDetailPage />} />
              <Route path="/idf/warehouses" element={<WarehousesPage />} />
              <Route path="/idf/warehouses/:id" element={<WarehouseDetailPage />} />
              <Route path="/idf/certificates" element={<CertificatesPage />} />
              <Route path="/idf/certificates/:id" element={<CertificateDetailPage />} />
              <Route path="/idf/inspections" element={<InspectionsPage />} />
              <Route path="/idf/inspections/:id" element={<InspectionDetailPage />} />
              <Route path="/idf/exports" element={<ExportsPage />} />
              <Route path="/idf/exports/:id" element={<ExportDetailPage />} />
              <Route path="/idf/admin" element={<AdminPage />} />
              <Route path="/idf/enforcement" element={<EnforcementPage />} />
              <Route path="/idf/enforcement/:id" element={<EnforcementDetailPage />} />
              <Route path="/idf/revenue" element={<RevenuePage />} />
              <Route path="/idf/revenue/:id" element={<RevenueDetailPage />} />
              <Route path="/definicoes" element={<SettingsPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
            </Route>
            <Route path="/index" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
