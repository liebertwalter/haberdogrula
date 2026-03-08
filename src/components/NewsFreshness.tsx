import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Timer } from "lucide-react";

interface Props { result: FactCheckResult; }

export function NewsFreshness({ result }: Props) {
  const freshnessScore = result.detailedScores?.freshness || (result.freshness === "güncel" ? 90 : result.freshness === "eski" ? 30 : 50);

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Timer className="h-3.5 w-3.5" /> Haber Tazeliği
        </span>
        <span className={`text-xs font-bold ${freshnessScore >= 70 ? "text-success" : freshnessScore >= 40 ? "text-warning" : "text-danger"}`}>
          %{freshnessScore} {freshnessScore >= 70 ? "Taze" : freshnessScore >= 40 ? "Normal" : "Bayat"}
        </span>
      </div>
    </motion.div>
  );
}
