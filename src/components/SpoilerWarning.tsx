import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface SpoilerWarningProps {
  result: FactCheckResult;
}

export function SpoilerWarning({ result }: SpoilerWarningProps) {
  const [revealed, setRevealed] = useState(false);

  if (result.score >= 40 || result.debunked.length === 0) return null;

  return (
    <motion.div
      className="p-3 rounded-xl bg-danger/5 border border-danger/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        className="flex items-center gap-2 w-full text-left"
        onClick={() => setRevealed(!revealed)}
      >
        {revealed ? <EyeOff className="h-4 w-4 text-danger" /> : <Eye className="h-4 w-4 text-danger" />}
        <span className="text-xs font-semibold text-danger flex-1">
          ⚠️ Bu haber güvenilir bulunmadı - Detayları görmek için tıklayın
        </span>
        {revealed ? <ChevronUp className="h-4 w-4 text-danger" /> : <ChevronDown className="h-4 w-4 text-danger" />}
      </button>
      {revealed && (
        <motion.div
          className="mt-2 space-y-1"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
        >
          {result.debunked.map((d, i) => (
            <p key={i} className="text-xs text-danger/80 pl-6">• {d}</p>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
