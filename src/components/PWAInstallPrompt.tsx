import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PWAInstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("fc_pwa_dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    
    // Show anyway after 30 seconds for iOS hint
    const timer = setTimeout(() => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS && !dismissed) setShow(true);
    }, 30000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    }
    setShow(false);
    localStorage.setItem("fc_pwa_dismissed", "true");
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("fc_pwa_dismissed", "true");
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 left-4 right-4 z-50 bg-card border border-border rounded-xl p-4 shadow-xl max-w-md mx-auto"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
      >
        <button className="absolute top-2 right-2" onClick={handleDismiss}>
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Smartphone className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Uygulamayı Yükleyin</p>
            <p className="text-xs text-muted-foreground">Ana ekrana ekleyerek hızlı erişim sağlayın</p>
          </div>
          <Button size="sm" onClick={handleInstall} className="gap-1 text-xs">
            <Download className="h-3.5 w-3.5" /> Yükle
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
