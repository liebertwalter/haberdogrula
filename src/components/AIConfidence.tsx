import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Brain } from "lucide-react";

interface Props { result: FactCheckResult; }

export function AIConfidence({ result }: Props) {
  const conf = result.confidence || "orta";
  const config: Record<string, { value: number; color: string; label: string }> = {
    yüksek: { value: 90, color: "bg-success", label: "Yüksek Güven" },
    orta: { value: 60, color: "bg-warning", label: "Orta Güven" },
    düşük: { value: 30, color: "bg-danger", label: "Düşük Güven" },
  };
  const c = config[conf] || config.orta;

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-1.5"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Brain className="h-3.5 w-3.5" /> AI Güven Seviyesi
        </span>
        <span className="text-xs font-bold">{c.label}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div className={`h-full rounded-full ${c.color}`} initial={{ width: 0 }} animate={{ width: `${c.value}%` }} transition={{ duration: 0.6 }} />
      </div>
    </motion.div>
  );
}
