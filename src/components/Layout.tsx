import { Link, useLocation } from "react-router-dom";
import { Shield, Search, Scale, Clock, BarChart3, Compass, Heart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { TurkeyTime } from "@/components/TurkeyTime";
import { NotificationBell } from "@/components/NotificationBell";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";
import { DailyStreak } from "@/components/DailyStreak";
import { RealTimeUpdates } from "@/components/RealTimeUpdates";
import { BackToTop } from "@/components/BackToTop";
import { NetworkStatus } from "@/components/NetworkStatus";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { CookieConsent } from "@/components/CookieConsent";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TipBanner } from "@/components/TipBanner";
import { Footer } from "@/components/Footer";
import { FloatingIcons } from "@/components/FloatingIcons";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: "/", label: "Ana Sayfa", icon: Shield },
  { path: "/dogrula", label: "Doğrula", icon: Search },
  { path: "/karsilastir", label: "Karşılaştır", icon: Scale },
  { path: "/gecmis", label: "Geçmiş", icon: Clock },
  { path: "/istatistikler", label: "İstatistik", icon: BarChart3 },
  { path: "/kesfet", label: "Keşfet", icon: Compass },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <BackToTop />
      <NetworkStatus />
      <KeyboardShortcuts />
      <PWAInstallPrompt />
      <CookieConsent />
      <ReadingProgress />

      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-warning/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-danger/5 rounded-full blur-3xl animate-blob animation-delay-3000" />
      </div>

      <TipBanner />

      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/70">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold tracking-tight">FactCheck</span>
            </Link>
            <DailyStreak />
            <RealTimeUpdates />
          </div>
          <div className="flex items-center gap-1">
            <TurkeyTime />
            <NotificationBell />
            <NotificationPreferences />
            <Link to="/favoriler">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <AccessibilityPanel />
            <Link to="/hakkinda">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Info className="h-5 w-5" />
              </Button>
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <nav className="border-b border-border/50 bg-background/50 backdrop-blur-sm sticky top-16 z-40 overflow-x-auto">
        <div className="container mx-auto px-4 flex gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`gap-1.5 text-xs rounded-none border-b-2 rounded-t-md ${
                    isActive ? "border-b-primary" : "border-b-transparent"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-2xl relative z-10 flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
