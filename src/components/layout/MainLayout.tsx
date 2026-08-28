import { useState } from "react";
import { Outlet } from "react-router-dom";
import { IdfSidebar } from "@/components/layout/IdfSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { AlertBanner } from "@/components/idf/AlertBanner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { IdfProvider } from "@/modules/idf/context/IdfContext";

const LayoutShell = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => (isMobile ? setMobileOpen((v) => !v) : setSidebarOpen((v) => !v));

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {!isMobile && <IdfSidebar collapsed={!sidebarOpen} onToggleCollapse={toggleSidebar} />}

      <Sheet open={isMobile && mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 border-none p-0">
          <IdfSidebar className="flex w-full" onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader sidebarOpen={isMobile ? mobileOpen : sidebarOpen} onToggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-y-auto">
          <AlertBanner />
          <main className="p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export const MainLayout = () => (
  <IdfProvider>
    <LayoutShell />
  </IdfProvider>
);

export default MainLayout;
