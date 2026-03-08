import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Scale } from "lucide-react";

interface Props { result: FactCheckResult; }

export function MediaBiasChart({ result }: Props) {
  const bias = result.detailedScores?.bias || 50;
  const position = 100 - bias; // higher bias score = less biased, so invert for position

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Scale className="h-3.5 w-3.5" /> Tarafsızlık Ölçeği
      </h4>
      <div className="relative h-6 bg-muted rounded-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-danger/20" />
          <div className="flex-1 bg-warning/20" />
          <div className="flex-1 bg-success/20" />
          <div className="flex-1 bg-warning/20" />
          <div className="flex-1 bg-danger/20" />
        </div>
        <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-foreground border-2 border-background shadow"
          initial={{ left: "50%" }} animate={{ left: `${Math.max(5, Math.min(95, position))}%` }}
          transition={{ duration: 0.8, type: "spring" }}
          style={{ transform: "translateX(-50%)" }} />
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground">
        <span>Yanlı</span>
        <span>Dengeli</span>
        <span>Yanlı</span>
      </div>
    </motion.div>
  );
}
