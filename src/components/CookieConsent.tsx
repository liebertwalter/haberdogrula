import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("fc_cookie_consent");
    if (!accepted) {
      setTimeout(() => setShow(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("fc_cookie_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-4 right-4 z-[90] bg-card border border-border rounded-xl p-4 shadow-xl max-w-lg mx-auto"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-start gap-3">
        <Cookie className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold mb-1">Çerez Bildirimi</p>
          <p className="text-xs text-muted-foreground">
            Deneyiminizi iyileştirmek için çerezler ve yerel depolama kullanıyoruz. 
            Favoriler, ayarlar ve taslaklar cihazınızda saklanır.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <Button variant="outline" size="sm" onClick={handleAccept} className="text-xs h-7">
          Kabul Et
        </Button>
      </div>
    </motion.div>
  );
}
