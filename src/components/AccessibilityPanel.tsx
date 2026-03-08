import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Type, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AccessibilityPanel() {
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("fc_fontsize") || "100");
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem("fc_fontsize", String(fontSize));
  }, [fontSize]);

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" onClick={() => setShow(!show)} title="Erişilebilirlik">
        <Type className="h-4 w-4" />
      </Button>
      {show && (
        <motion.div
          className="absolute right-0 top-10 bg-card border border-border rounded-xl p-3 shadow-xl z-50 w-48"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold mb-2">Yazı Boyutu</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setFontSize((p) => Math.max(80, p - 10))}>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs font-mono flex-1 text-center">%{fontSize}</span>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setFontSize((p) => Math.min(140, p + 10))}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-7" onClick={() => setFontSize(100)}>
            Sıfırla
          </Button>
        </motion.div>
      )}
    </div>
  );
}
