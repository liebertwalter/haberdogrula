import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstagramPrompt() {
  const [show, setShow] = useState(() => !localStorage.getItem("ig-prompt-seen"));

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("ig-prompt-seen", "true");
  };

  const follow = () => {
    window.open("https://instagram.com/postal.dijital", "_blank");
    dismiss();
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center space-y-5"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-7 w-7 rounded-full"
            onClick={dismiss}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Instagram gradient icon */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            }}
          >
            <Instagram className="h-10 w-10 text-white" />
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold">Bizi takip ettiniz mi? 📸</h3>
            <p className="text-sm text-muted-foreground">
              En güncel haber doğrulama bilgileri ve dijital okuryazarlık içerikleri için Instagram'da bizi takip edin!
            </p>
          </div>

          <div className="space-y-2">
            <Button onClick={follow} className="w-full gap-2 h-12 text-base" style={{
              background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            }}>
              <Instagram className="h-5 w-5" />
              @postal.dijital
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground" onClick={dismiss}>
              Belki sonra
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
