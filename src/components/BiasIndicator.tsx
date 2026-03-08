import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Scale, ThumbsUp, ThumbsDown, Minus } from "lucide-react";

interface BiasIndicatorProps {
  result: FactCheckResult;
}

export function BiasIndicator({ result }: BiasIndicatorProps) {
  const biasScore = result.detailedScores?.bias || 50;
  
  const getBiasLevel = (score: number) => {
    if (score >= 80) return { label: "Tarafsız", color: "text-success", emoji: "⚖️" };
    if (score >= 60) return { label: "Hafif Taraflı", color: "text-warning", emoji: "↗️" };
    if (score >= 40) return { label: "Orta Taraflı", color: "text-warning", emoji: "➡️" };
    return { label: "Çok Taraflı", color: "text-danger", emoji: "⚠️" };
  };

  const info = getBiasLevel(biasScore);

  return (
    <motion.div
      className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Scale className="h-3.5 w-3.5" /> Tarafsızlık Analizi
        </span>
        <span className={`text-xs font-medium ${info.color}`}>
          {info.emoji} {info.label}
        </span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-danger via-warning to-success"
          initial={{ width: 0 }}
          animate={{ width: `${biasScore}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>Taraflı</span>
        <span>Tarafsız</span>
      </div>
    </motion.div>
  );
}
