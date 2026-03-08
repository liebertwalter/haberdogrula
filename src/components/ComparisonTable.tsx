import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Table2 } from "lucide-react";

interface Props { result: FactCheckResult; }

export function ComparisonTable({ result }: Props) {
  const rows = [
    { label: "Doğru Bilgiler", value: result.verified.length, max: 10, color: "text-success" },
    { label: "Yanlış Bilgiler", value: result.debunked.length, max: 10, color: "text-danger" },
    { label: "Uyarılar", value: result.warnings.length, max: 10, color: "text-warning" },
    { label: "Kaynaklar", value: result.sources.length, max: 10, color: "text-primary" },
  ];

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Table2 className="h-3.5 w-3.5" /> Karşılaştırma Tablosu
      </h4>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-28 text-muted-foreground">{r.label}</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div className={`h-full rounded-full ${r.color.replace("text-", "bg-")}`}
                initial={{ width: 0 }} animate={{ width: `${Math.min(100, (r.value / r.max) * 100)}%` }} transition={{ delay: i * 0.1, duration: 0.5 }} />
            </div>
            <span className={`font-bold w-6 text-right ${r.color}`}>{r.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
