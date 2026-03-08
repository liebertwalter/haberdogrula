import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { CheckCircle, XCircle, AlertCircle, MinusCircle } from "lucide-react";

interface FactDensityProps {
  result: FactCheckResult;
}

export function FactDensity({ result }: FactDensityProps) {
  const totalFacts = result.verified.length + result.debunked.length;
  const totalInfo = totalFacts + result.warnings.length;

  if (totalInfo === 0) return null;

  const verifiedRatio = totalFacts > 0 ? Math.round((result.verified.length / totalFacts) * 100) : 0;

  return (
    <motion.div
      className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-1">
        <CheckCircle className="h-4 w-4 text-success" />
        <span className="text-xs font-bold text-success">{result.verified.length}</span>
      </div>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden flex">
        <div className="bg-success h-full" style={{ width: `${verifiedRatio}%` }} />
        <div className="bg-danger h-full" style={{ width: `${100 - verifiedRatio}%` }} />
      </div>
      <div className="flex items-center gap-1">
        <XCircle className="h-4 w-4 text-danger" />
        <span className="text-xs font-bold text-danger">{result.debunked.length}</span>
      </div>
    </motion.div>
  );
}
