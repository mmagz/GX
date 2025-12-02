import { useState, lazy, Suspense } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { Navbar } from "./components/Navbar";
import { AppSidebar } from "./components/AppSidebar";
import { AdminOrderProvider } from "./contexts/OrderContext";
import { AdminProvider } from "./contexts/AdminContext";
import { AdminAuth } from "./components/AdminAuth";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PageLoader } from "./components/PageLoader";

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const Capsules = lazy(() => import('./pages/Capsules').then(m => ({ default: m.Capsules })));
const Featured = lazy(() => import('./pages/Featured').then(m => ({ default: m.Featured })));
const Orders = lazy(() => import('./pages/Orders').then(m => ({ default: m.Orders })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const Settings = lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveView} />;
      case 'products':
        return <Products />;
      case 'capsules':
        return <Capsules />;
      case 'featured':
        return <Featured />;
      case 'orders':
        return <Orders />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <AdminProvider>
        <AdminAuth>
          <AdminOrderProvider>
            <div className="min-h-screen bg-[#EAE7E2]">
              <SidebarProvider>
                <AppSidebar activeView={activeView} onNavigate={setActiveView} />
                <SidebarInset className="bg-[#EAE7E2]">
                  <Navbar />
                  <main className="p-4 sm:p-6 max-w-[1920px] mx-auto">
                    <ErrorBoundary>
                      <Suspense fallback={<PageLoader />}>
                        {renderContent()}
                      </Suspense>
                    </ErrorBoundary>
                  </main>
                </SidebarInset>
              </SidebarProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  className: 'bg-[#F5F3F0] text-[#262930]',
                }}
              />
            </div>
          </AdminOrderProvider>
        </AdminAuth>
      </AdminProvider>
    </ErrorBoundary>
  );
}
