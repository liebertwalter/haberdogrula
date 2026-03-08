import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { GitBranch } from "lucide-react";

interface Props { result: FactCheckResult; }

export function NarrativeTracker({ result }: Props) {
  const narratives = [];
  if (result.score >= 80) narratives.push({ label: "Ana akım", type: "positive" });
  if (result.score < 30) narratives.push({ label: "Komplo teorisi riski", type: "negative" });
  if (result.debunked.length > 0) narratives.push({ label: "Çürütülmüş iddia", type: "negative" });
  if (result.verified.length > result.debunked.length) narratives.push({ label: "Çoğunlukla doğru", type: "positive" });
  if (result.warnings.length > 3) narratives.push({ label: "Manipülatif anlatı", type: "negative" });

  if (narratives.length === 0) return null;

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2 flex-wrap">
        <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Anlatı:</span>
        {narratives.map((n, i) => (
          <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full ${n.type === "positive" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
            {n.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
