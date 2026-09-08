import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ToolGrid } from "./components/ToolGrid";
import { ToolView } from "./components/ToolView";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { AdminPanel } from "./components/AdminPanel";
import { AuthModal } from "./components/modals/AuthModal";
import { PricingModal } from "./components/modals/PricingModal";
import { SavedReportsModal } from "./components/modals/SavedReportsModal";
import { UserDashboardModal } from "./components/modals/UserDashboardModal";
import { LimitReachedModal } from "./components/modals/LimitReachedModal";

const MainContent: React.FC = () => {
  const { activeTool, adminPanelOpen, analyticsViewOpen } = useApp();

  return (
    <main className="flex-1">
      {adminPanelOpen ? (
        <AdminPanel />
      ) : analyticsViewOpen ? (
        <AnalyticsDashboard />
      ) : activeTool ? (
        <ToolView />
      ) : (
        <ToolGrid />
      )}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#f0f2f5] text-slate-800 font-sans selection:bg-[#2a69af] selection:text-white">
        <Header />
        <MainContent />
        <Footer />

        {/* Global Modals */}
        <AuthModal />
        <PricingModal />
        <SavedReportsModal />
        <UserDashboardModal />
        <LimitReachedModal />
      </div>
    </AppProvider>
  );
}
