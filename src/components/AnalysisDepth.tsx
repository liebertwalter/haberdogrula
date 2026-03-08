import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Gauge } from "lucide-react";

interface Props { result: FactCheckResult; }

export function AnalysisDepth({ result }: Props) {
  const factors = [
    result.sources.length > 0,
    result.verified.length > 0,
    result.debunked.length > 0,
    result.warnings.length > 0,
    result.webSearchUsed,
    !!result.category,
    !!result.sentiment,
    !!result.detailedScores,
    !!result.confidence,
    !!result.freshness,
  ];
  const depth = Math.round((factors.filter(Boolean).length / factors.length) * 100);

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Gauge className="h-3.5 w-3.5" /> Analiz Derinliği
        </span>
        <span className={`text-xs font-bold ${depth >= 70 ? "text-success" : depth >= 40 ? "text-warning" : "text-danger"}`}>
          %{depth}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
        <motion.div className={`h-full rounded-full ${depth >= 70 ? "bg-success" : depth >= 40 ? "bg-warning" : "bg-danger"}`}
          initial={{ width: 0 }} animate={{ width: `${depth}%` }} transition={{ duration: 0.6 }} />
      </div>
    </motion.div>
  );
}
