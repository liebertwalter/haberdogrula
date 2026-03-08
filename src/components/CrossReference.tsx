import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { GitCompareArrows } from "lucide-react";

interface Props { result: FactCheckResult; }

export function CrossReference({ result }: Props) {
  const crossRefScore = Math.min(100, result.sources.length * 20 + (result.webSearchUsed ? 20 : 0));
  const level = crossRefScore >= 60 ? "Güçlü" : crossRefScore >= 30 ? "Orta" : "Zayıf";
  const color = crossRefScore >= 60 ? "text-success" : crossRefScore >= 30 ? "text-warning" : "text-danger";

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <GitCompareArrows className="h-3.5 w-3.5" /> Çapraz Referans
        </span>
        <span className={`text-xs font-bold ${color}`}>{level} (%{crossRefScore})</span>
      </div>
    </motion.div>
  );
}
