import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NetworkStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const goOnline = () => { setOnline(true); setShowBanner(true); setTimeout(() => setShowBanner(false), 3000); };
    const goOffline = () => { setOnline(false); setShowBanner(true); };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-16 left-0 right-0 z-[100] text-center py-1.5 text-xs font-medium ${
            online ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}
        >
          {online ? (
            <span className="flex items-center justify-center gap-1"><Wifi className="h-3 w-3" /> Bağlantı geri geldi</span>
          ) : (
            <span className="flex items-center justify-center gap-1"><WifiOff className="h-3 w-3" /> İnternet bağlantısı yok</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
