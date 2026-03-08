import { motion } from "framer-motion";
import { Clipboard, Check } from "lucide-react";
import { useState } from "react";
import { type FactCheckResult } from "@/lib/api/factcheck";

interface QuickSummaryProps {
  result: FactCheckResult;
}

export function QuickSummary({ result }: QuickSummaryProps) {
  const [copied, setCopied] = useState(false);

  const emoji = result.score >= 70 ? "✅" : result.score >= 40 ? "⚠️" : "❌";
  const label = result.score >= 70 ? "Güvenilir" : result.score >= 40 ? "Şüpheli" : "Güvenilmez";
  const summaryLine = `${emoji} ${label} (%${result.score}) — ${result.summary.substring(0, 100)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summaryLine);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-2 p-3 rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 cursor-pointer hover:bg-card/80 transition-colors"
      onClick={handleCopy}
    >
      <p className="text-xs text-muted-foreground flex-1 line-clamp-1">{summaryLine}</p>
      {copied ? <Check className="h-3.5 w-3.5 text-success shrink-0" /> : <Clipboard className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
    </motion.div>
  );
}
