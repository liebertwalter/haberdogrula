import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmbedWidgetProps {
  score: number;
}

export function EmbedWidget({ score }: EmbedWidgetProps) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  const embedCode = `<a href="https://haberdogrula.lovable.app" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:8px;background:${
    score >= 70 ? "#dcfce7" : score >= 40 ? "#fefce8" : "#fef2f2"
  };color:${
    score >= 70 ? "#166534" : score >= 40 ? "#854d0e" : "#991b1b"
  };font-family:system-ui;font-size:13px;text-decoration:none;border:1px solid ${
    score >= 70 ? "#86efac" : score >= 40 ? "#fde047" : "#fca5a5"
  }">🛡️ FactCheck Skoru: %${score}</a>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <Button variant="outline" size="sm" onClick={() => setShow(!show)} className="h-7 gap-1 text-[11px]">
        <Code className="h-3 w-3" /> Embed Kodu
      </Button>
      {show && (
        <motion.div
          className="p-3 bg-muted rounded-lg space-y-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <pre className="text-[10px] overflow-x-auto whitespace-pre-wrap break-all font-mono">{embedCode}</pre>
          <Button variant="outline" size="sm" onClick={handleCopy} className="h-6 gap-1 text-[10px]">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Kopyalandı" : "Kopyala"}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
