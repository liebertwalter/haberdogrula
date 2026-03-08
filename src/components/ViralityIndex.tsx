import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Flame } from "lucide-react";

interface Props { result: FactCheckResult; }

export function ViralityIndex({ result }: Props) {
  const hasClickbait = result.warnings.some(w => w.toLowerCase().includes("clickbait") || w.toLowerCase().includes("sansasyonel"));
  const hasSensational = result.sentiment === "korkutucu" || result.sentiment === "olumsuz";
  const viralScore = Math.min(100, (hasClickbait ? 40 : 0) + (hasSensational ? 30 : 0) + (result.debunked.length * 10) + (result.score < 50 ? 20 : 0));

  const getLevel = (v: number) => {
    if (v >= 70) return { label: "Yüksek Virallik Riski", color: "text-danger" };
    if (v >= 40) return { label: "Orta Virallik", color: "text-warning" };
    return { label: "Düşük Virallik", color: "text-success" };
  };
  const level = getLevel(viralScore);

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5" /> Virallik İndeksi
        </span>
        <span className={`text-xs font-bold ${level.color}`}>{level.label} ({viralScore}%)</span>
      </div>
    </motion.div>
  );
}
