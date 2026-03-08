import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreComparisonProps {
  result: FactCheckResult;
  averageScore: number;
}

export function ScoreComparison({ result, averageScore }: ScoreComparisonProps) {
  const diff = result.score - averageScore;
  const isAbove = diff > 0;
  const isBelow = diff < 0;

  return (
    <motion.div
      className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <BarChart3 className="h-3.5 w-3.5" /> Ortalamaya Göre
        </span>
        <div className="flex items-center gap-1">
          {isAbove ? (
            <TrendingUp className="h-3.5 w-3.5 text-success" />
          ) : isBelow ? (
            <TrendingDown className="h-3.5 w-3.5 text-danger" />
          ) : (
            <Minus className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className={`text-xs font-bold ${isAbove ? "text-success" : isBelow ? "text-danger" : "text-muted-foreground"}`}>
            {isAbove ? "+" : ""}{diff} puan ({isAbove ? "ortalamanın üstünde" : isBelow ? "ortalamanın altında" : "ortalama"})
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <span>Genel ortalama: %{averageScore}</span>
        <span>•</span>
        <span>Bu haber: %{result.score}</span>
      </div>
    </motion.div>
  );
}
