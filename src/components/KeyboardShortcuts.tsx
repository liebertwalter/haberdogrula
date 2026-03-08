import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const shortcuts = [
  { keys: "Ctrl + Enter", desc: "Doğrulama başlat" },
  { keys: "Ctrl + K", desc: "Kısayolları göster" },
  { keys: "Ctrl + N", desc: "Yeni doğrulama" },
  { keys: "Ctrl + D", desc: "Temayı değiştir" },
  { keys: "Esc", desc: "Kapat / Geri" },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((p) => !p);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setOpen(false)}
    >
      <motion.div
        className="bg-card border border-border rounded-xl p-6 w-80 shadow-xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Keyboard className="h-4 w-4" /> Kısayollar
          </h3>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((s) => (
            <div key={s.keys} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{s.desc}</span>
              <kbd className="px-2 py-0.5 bg-muted rounded text-[10px] font-mono">{s.keys}</kbd>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
