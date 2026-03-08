import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { PieChart, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface DetailedAnalysisProps {
  result: FactCheckResult;
}

export function DetailedAnalysis({ result }: DetailedAnalysisProps) {
  const [expanded, setExpanded] = useState(false);

  const totalItems = result.verified.length + result.debunked.length + result.warnings.length;
  const verifiedPercent = totalItems > 0 ? Math.round((result.verified.length / totalItems) * 100) : 0;
  const debunkedPercent = totalItems > 0 ? Math.round((result.debunked.length / totalItems) * 100) : 0;
  const warningPercent = totalItems > 0 ? Math.round((result.warnings.length / totalItems) * 100) : 0;

  return (
    <motion.div
      className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button className="flex items-center justify-between w-full" onClick={() => setExpanded(!expanded)}>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <PieChart className="h-3.5 w-3.5" /> Detaylı Analiz
        </h4>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {/* Mini stats always visible */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 rounded-lg bg-success/10">
          <p className="text-lg font-bold text-success">{result.verified.length}</p>
          <p className="text-[10px] text-success">Doğru</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-danger/10">
          <p className="text-lg font-bold text-danger">{result.debunked.length}</p>
          <p className="text-[10px] text-danger">Yanlış</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-warning/10">
          <p className="text-lg font-bold text-warning">{result.warnings.length}</p>
          <p className="text-[10px] text-warning">Uyarı</p>
        </div>
      </div>

      {expanded && totalItems > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="space-y-2"
        >
          {/* Distribution bar */}
          <div className="h-3 rounded-full overflow-hidden flex">
            {verifiedPercent > 0 && (
              <div className="bg-success h-full" style={{ width: `${verifiedPercent}%` }} />
            )}
            {warningPercent > 0 && (
              <div className="bg-warning h-full" style={{ width: `${warningPercent}%` }} />
            )}
            {debunkedPercent > 0 && (
              <div className="bg-danger h-full" style={{ width: `${debunkedPercent}%` }} />
            )}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>✅ %{verifiedPercent}</span>
            <span>⚠️ %{warningPercent}</span>
            <span>❌ %{debunkedPercent}</span>
          </div>

          {/* Source count */}
          <div className="text-xs text-muted-foreground pt-1">
            📚 {result.sources.length} kaynak bulundu
            {result.webSearchUsed && " • 🔍 Web araştırması yapıldı"}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
