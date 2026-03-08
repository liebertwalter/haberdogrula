import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { SmilePlus } from "lucide-react";

interface Props { result: FactCheckResult; }

const sentimentMap: Record<string, { label: string; color: string; emoji: string; value: number }> = {
  olumlu: { label: "Olumlu", color: "bg-success", emoji: "😊", value: 80 },
  olumsuz: { label: "Olumsuz", color: "bg-danger", emoji: "😟", value: 30 },
  nötr: { label: "Nötr", color: "bg-primary", emoji: "😐", value: 50 },
  korkutucu: { label: "Korkutucu", color: "bg-warning", emoji: "😨", value: 20 },
  umut_verici: { label: "Umut Verici", color: "bg-success", emoji: "🌟", value: 75 },
};

export function SentimentChart({ result }: Props) {
  const s = sentimentMap[result.sentiment || "nötr"] || sentimentMap.nötr;
  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <SmilePlus className="h-3.5 w-3.5" /> Duygu Analizi
      </h4>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{s.emoji}</span>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium">{s.label}</span>
            <span className="text-muted-foreground">%{s.value}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div className={`h-full rounded-full ${s.color}`} initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 0.8 }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
