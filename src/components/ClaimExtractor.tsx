import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { ListChecks } from "lucide-react";

interface Props { result: FactCheckResult; }

export function ClaimExtractor({ result }: Props) {
  const claims = [
    ...result.verified.map(v => ({ text: v, status: "verified" as const })),
    ...result.debunked.map(d => ({ text: d, status: "debunked" as const })),
    ...result.warnings.map(w => ({ text: w, status: "warning" as const })),
  ];

  if (claims.length === 0) return null;

  const statusConfig = {
    verified: { icon: "✅", bg: "bg-success/10", text: "text-success" },
    debunked: { icon: "❌", bg: "bg-danger/10", text: "text-danger" },
    warning: { icon: "⚠️", bg: "bg-warning/10", text: "text-warning" },
  };

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <ListChecks className="h-3.5 w-3.5" /> İddia Analizi ({claims.length} iddia)
      </h4>
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {claims.map((c, i) => {
          const cfg = statusConfig[c.status];
          return (
            <motion.div key={i} className={`flex items-start gap-2 p-2 rounded-lg ${cfg.bg}`}
              initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <span className="text-xs mt-0.5">{cfg.icon}</span>
              <span className={`text-xs ${cfg.text}`}>{c.text}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
