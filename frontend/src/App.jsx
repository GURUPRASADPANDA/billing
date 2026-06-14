import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Download, RefreshCw, Sun, Moon, LogOut } from "lucide-react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { api } from "./services/api";
import { ThemeContext } from "./context/ThemeContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { useWindowSize } from "./hooks/useWindowSize";
import { useToast } from "./hooks/useToast";

import { Sidebar } from "./components/layout/Sidebar";
import { BottomNav } from "./components/layout/BottomNav";
import { Toast } from "./components/ui/Toast";

import { BillingPage } from "./pages/BillingPage";
import { HistoryPage } from "./pages/HistoryPage";
import { PartiesPage } from "./pages/PartiesPage";
import { ItemsPage } from "./pages/ItemsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { TrashPage } from "./pages/TrashPage";
import { AuthPage } from "./pages/AuthPage";
import { OnboardingPage } from "./pages/OnboardingPage";

import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

import { BillingSkeleton } from "./components/skeletons/BillingSkeleton";
import { HistorySkeleton } from "./components/skeletons/HistorySkeleton";
import { PartiesSkeleton } from "./components/skeletons/PartiesSkeleton";
import { ItemsSkeleton } from "./components/skeletons/ItemsSkeleton";
import { ProfileSkeleton } from "./components/skeletons/ProfileSkeleton";
import { TableSkeleton } from "./components/skeletons/TableSkeleton";
import { DashboardSkeleton } from "./components/skeletons/DashboardSkeleton";

function AppContent() {
  const [dark, setDark] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);

  const { isAuthenticated, loading: authLoading, logout, user } = useContext(AuthContext);

  useEffect(() => {
    const handleUpdate = (e) => {
      setUpdateAvailable(true);
      setSwRegistration(e.detail);
    };
    document.addEventListener('pwa-update-available', handleUpdate);
    return () => document.removeEventListener('pwa-update-available', handleUpdate);
  }, []);

  const handleUpdateApp = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (let name of names) caches.delete(name);
        });
      }
    }
    window.location.reload();
  };

  const { toasts, toast, removeToast } = useToast();
  
  const [company, setCompany] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setShowSplash(false);
      return;
    }
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        setShowInstall(false);
      }
      setDeferredPrompt(null);
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      setProfileLoaded(false);
      api.getProfile()
        .then(data => {
          setCompany(data);
          setNeedsOnboarding(false);
        })
        .catch(() => {
          setNeedsOnboarding(true);
        })
        .finally(() => {
          setProfileLoaded(true);
        });
    } else {
      setCompany(null);
      setProfileLoaded(false);
      setNeedsOnboarding(false);
    }
  }, [isAuthenticated]);

  const handleSetCompany = (updated) => {
    setCompany(updated);
    if (needsOnboarding) {
      setNeedsOnboarding(false);
    }
  };

  const theme = {
    "--bg": dark ? "#0f172a" : "#ffffff",
    "--sidebar": dark ? "#1e293b" : "#f8fafc",
    "--card": dark ? "#1e293b" : "#ffffff",
    "--text": dark ? "#f1f5f9" : "#0f172a",
    "--text-muted": dark ? "#94a3b8" : "#64748b",
    "--border": dark ? "#334155" : "#e2e8f0",
    "--primary": "#3b82f6",
  };

  if (showSplash && isMobile) {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999
      }}>
        <style>{`
          @keyframes splash-pulse {
            0% { transform: scale(0.85); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.9; }
          }
        `}</style>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", animation: "splash-pulse 1.8s ease-in-out infinite"
        }}>
          <img src="/favicon.png" alt="logo" style={{ width: 80, height: 80, borderRadius: 20, objectFit: "cover", overflow: "hidden" }} />
        </div>
      </div>
    );
  }

  if (authLoading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f1f5f9", ...theme }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <ThemeContext.Provider value={{ dark, setDark }}>
        <div style={theme}>
          <Routes>
            <Route path="/auth" element={<AuthPage toast={toast} />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
          <Toast toasts={toasts} remove={removeToast} />
        </div>
      </ThemeContext.Provider>
    );
  }

  if (!profileLoaded) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f1f5f9", ...theme }}>Loading profile...</div>;
  }

  if (needsOnboarding) {
    return (
      <ThemeContext.Provider value={{ dark, setDark }}>
        <div style={theme}>
          <Routes>
            <Route path="/onboarding" element={<OnboardingPage toast={toast} setCompany={handleSetCompany} />} />
            <Route path="*" element={<Navigate to="/onboarding" />} />
          </Routes>
          <Toast toasts={toasts} remove={removeToast} />
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <SkeletonTheme baseColor={dark ? "#1e293b" : "#e2e8f0"} highlightColor={dark ? "#334155" : "#f8fafc"}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: "100vh", background: dark ? "#0f172a" : "#f1f5f9", ...theme }}>
          {!isMobile && <Sidebar dark={dark} setDark={setDark} company={company} showInstall={showInstall} onInstall={handleInstallClick} updateAvailable={updateAvailable} onUpdate={handleUpdateApp} />}
          
          {isMobile && (
            <header style={{ background: "var(--sidebar)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: dark ? "#fff" : "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src="/favicon.png" alt="logo" style={{ width: 22, height: 22, objectFit: "contain" }} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{company?.companyName || "Mahavir"}</div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {showInstall && (
                  <button onClick={handleInstallClick} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                    <Download size={14} /> Install
                  </button>
                )}
                <button onClick={handleUpdateApp} title="Force Refresh / Update" style={{ background: updateAvailable ? "#f59e0b" : "transparent", color: updateAvailable ? "#fff" : "var(--text-muted)", border: "none", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: updateAvailable ? "0 0 10px rgba(245, 158, 11, 0.6)" : "none", transition: "all 0.2s" }}>
                  <RefreshCw size={18} />
                </button>
                <button onClick={() => setDark(!dark)} style={{ background: "none", border: "none", fontSize: 20, display: "flex", color: "var(--text)" }}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
                <button onClick={logout} style={{ background: "none", border: "none", fontSize: 20, display: "flex", color: "#ef4444" }}><LogOut size={18} /></button>
              </div>
            </header>
          )}

          <main style={{ flex: 1, padding: isMobile ? "20px 16px 80px" : "32px 36px", overflowY: "auto", overflowX: "hidden", minWidth: 0 }}>
            <div style={{ maxWidth: "100%", margin: "0 auto", padding: isMobile < 600 ? "0 10px" : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                 {!isMobile && <button onClick={logout} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "8px 16px", borderRadius: 8, display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}><LogOut size={16} /> Logout ({user?.username})</button>}
              </div>
              <Routes>
                <Route path="/" element={<BillingPage toast={toast} company={company} isMobile={isMobile} />} />
                <Route path="/history" element={<HistoryPage toast={toast} company={company} isMobile={isMobile} />} />
                <Route path="/parties" element={<PartiesPage toast={toast} isMobile={isMobile} />} />
                <Route path="/items" element={<ItemsPage toast={toast} isMobile={isMobile} />} />
                <Route path="/profile" element={<ProfilePage toast={toast} company={company} setCompany={handleSetCompany} user={user} logout={logout} />} />
                <Route path="/trash" element={<TrashPage toast={toast} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>

          {isMobile && <BottomNav />}
          <Toast toasts={toasts} remove={removeToast} />
        </div>
      </SkeletonTheme>
    </ThemeContext.Provider>
  );
}

function AdminApp({ adminToken, setAdminToken }) {
  const { toasts, toast, removeToast } = useToast();
  return (
    <>
      <Routes>
        <Route path="/admin" element={
          adminToken 
            ? <AdminDashboard adminToken={adminToken} logout={() => setAdminToken(null)} toast={toast} /> 
            : <AdminLoginPage setAdminToken={setAdminToken} toast={toast} />
        } />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
      <Toast toasts={toasts} remove={removeToast} />
    </>
  );
}

export default function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);

  const handleSetAdminToken = (token) => {
    if (token) localStorage.setItem('adminToken', token);
    else localStorage.removeItem('adminToken');
    setAdminToken(token);
  };

  if (window.location.pathname.startsWith('/admin')) {
    return (
      <ThemeContext.Provider value={{ dark: false, setDark: () => {} }}>
        <AdminApp adminToken={adminToken} setAdminToken={handleSetAdminToken} />
      </ThemeContext.Provider>
    );
  }

  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
