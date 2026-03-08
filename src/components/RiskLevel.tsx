import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { AlertOctagon } from "lucide-react";

interface Props { result: FactCheckResult; }

export function RiskLevel({ result }: Props) {
  const risk = 100 - result.score;
  const getLevel = (r: number) => {
    if (r >= 70) return { label: "Yüksek Risk", color: "bg-danger", text: "text-danger", emoji: "🔴" };
    if (r >= 40) return { label: "Orta Risk", color: "bg-warning", text: "text-warning", emoji: "🟡" };
    return { label: "Düşük Risk", color: "bg-success", text: "text-success", emoji: "🟢" };
  };
  const level = getLevel(risk);

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <AlertOctagon className="h-3.5 w-3.5" /> Risk Değerlendirmesi
      </h4>
      <div className="flex items-center gap-3">
        <span className="text-xl">{level.emoji}</span>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-xs">
            <span className={`font-bold ${level.text}`}>{level.label}</span>
            <span className="text-muted-foreground">Risk: %{risk}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div className={`h-full rounded-full ${level.color}`} initial={{ width: 0 }} animate={{ width: `${risk}%` }} transition={{ duration: 0.8 }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
